import os
import requests
import json
import base64
import time
import threading
import uuid
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback_secret_key_2025")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Global in-memory storage - no file writing
stop_flags = {}
logs = {}
sending = False
user_sessions = {}
active_batches = {}
message_stats = {
    'total_sent': 0,
    'success_count': 0,
    'failed_count': 0
}

def clear_logs():
    """Clear all logs and reset stats"""
    global logs, message_stats
    logs.clear()
    message_stats = {
        'total_sent': 0,
        'success_count': 0,
        'failed_count': 0
    }

def get_client_ip():
    """Get client IP address"""
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        return request.environ['REMOTE_ADDR']
    else:
        return request.environ['HTTP_X_FORWARDED_FOR']

def convert_to_base64_with_padding(plain_key):
    """Convert plain text encryption key to base64 with padding"""
    key_bytes = plain_key.encode('utf-8')
    base64_key = base64.b64encode(key_bytes).decode('utf-8')
    padding = len(base64_key) % 4
    if padding != 0:
        base64_key += '=' * (4 - padding)
    return base64_key

def encrypt_message(message, encryption_key):
    """Encrypt message using E2EE encryption key"""
    encryption_key = convert_to_base64_with_padding(encryption_key)
    key_bytes = base64.b64decode(encryption_key)
    encrypted_message = base64.b64encode(message.encode('utf-8'))
    return encrypted_message

def get_account_name(access_token):
    """Get account name from Facebook Graph API with optimized timeout"""
    url = "https://graph.facebook.com/v17.0/me"
    params = {'access_token': access_token}
    try:
        # Added timeout for faster response handling
        response = requests.get(url, params=params, timeout=10)
        if response.ok:
            data = response.json()
            return data.get('name', 'Unknown')
        else:
            return f'Error: {response.status_code}'
    except requests.exceptions.Timeout:
        return 'Error: Request timeout'
    except Exception as e:
        return f'Error: {str(e)}'

def check_uid_exists(uid):
    """Check if UID exists on Facebook without requiring access token"""
    try:
        # Method 1: Check via public profile endpoint
        url = f"https://graph.facebook.com/v17.0/{uid}"
        params = {'fields': 'id'}
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data:
                return {
                    'success': True, 
                    'exists': True,
                    'uid': data['id'],
                    'message': 'UID exists and is valid on Facebook'
                }
        elif response.status_code == 803:
            # This usually means the profile exists but is private/restricted
            return {
                'success': True, 
                'exists': True,
                'uid': uid,
                'message': 'UID exists but profile is private or restricted'
            }
        elif response.status_code == 404:
            return {
                'success': True, 
                'exists': False,
                'uid': uid,
                'message': 'UID does not exist on Facebook'
            }
        else:
            # For other status codes, try alternative check
            return {
                'success': True,
                'exists': 'unknown',
                'uid': uid,
                'message': f'Could not verify UID (Status: {response.status_code}). May exist but be private.'
            }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error checking UID: {str(e)}'
        }

def get_profile_by_uid(uid, access_token):
    """Get profile name by UID using Facebook Graph API"""
    url = f"https://graph.facebook.com/v17.0/{uid}"
    params = {'access_token': access_token, 'fields': 'name'}
    try:
        response = requests.get(url, params=params)
        if response.ok:
            data = response.json()
            return data.get('name', 'Unknown')
        else:
            return f'Error: {response.status_code}'
    except Exception as e:
        return f'Error: {str(e)}'

def send_facebook_message(access_token, uid, message, is_e2ee=False, encryption_key=None):
    """Send message via Facebook Graph API"""
    try:
        if is_e2ee and encryption_key:
            # E2EE messaging (experimental)
            encrypted_message = encrypt_message(message, encryption_key)
            url = f"https://www.facebook.com/messages/e2ee/t/{uid}"
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json',
            }
            data = {
                'message': encrypted_message.decode('utf-8'),
                'thread_id': uid,
                'encryption_key': encryption_key,
            }
            response = requests.post(url, headers=headers, data=json.dumps(data))
        else:
            # Standard messaging via Graph API - Using working thread method from provided code
            url = f"https://graph.facebook.com/v17.0/t_{uid}/"
            headers = {
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; Samsung Galaxy S9 Build/OPR6.170623.017; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.125 Mobile Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
                'referer': 'www.google.com'
            }
            data = {
                'access_token': access_token,
                'message': message
            }
            response = requests.post(url, json=data, headers=headers, timeout=15)
        
        return response.ok, response.status_code, response.text
    except Exception as e:
        return False, 500, str(e)

def send_messages_continuously(tokens, uid, messages, prompt, delay, is_e2ee, encryption_key, batch_id):
    """Send messages continuously with delay"""
    global sending
    
    num_messages = len(messages)
    num_tokens = len(tokens)
    
    message_index = 0
    while not stop_flags.get(batch_id, threading.Event()).is_set():
        try:
            token_index = message_index % num_tokens
            access_token = tokens[token_index].strip()
            message = messages[message_index % num_messages].strip()
            full_message = f"{prompt} {message}" if prompt else message
            
            account_name = get_account_name(access_token)
            success, status_code, response_text = send_facebook_message(
                access_token, uid, full_message, is_e2ee, encryption_key
            )
            
            # Enhanced logging with response details for debugging
            log_entry = {
                "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
                "account_name": account_name,
                "status": "Success" if success else "Failed",
                "status_code": status_code,
                "message": full_message[:50] + "..." if len(full_message) > 50 else full_message,
                "uid": uid,
                "error_details": response_text if not success else None
            }
            
            # Debug logging for message failures
            if not success:
                logging.error(f"Message failed - Status: {status_code}, Response: {response_text}, UID: {uid}, Token: {access_token[:20]}...")
            
            logs.setdefault(batch_id, []).append(log_entry)
            message_index += 1
            
            time.sleep(delay)
            
        except Exception as e:
            logging.error(f"Error in message sending: {e}")
            time.sleep(30)

@app.route('/')
def index():
    """Home page - Facebook Message Sender"""
    client_ip = get_client_ip()
    session['client_ip'] = client_ip
    if client_ip not in user_sessions:
        user_sessions[client_ip] = {'start_time': datetime.now()}
    
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    """Handle message sending from home page"""
    try:
        # Get form data
        token_method = request.form.get('token_method')
        uid = request.form.get('uid')
        delay = float(request.form.get('delay', 1))
        prompt = request.form.get('prompt', '')
        message_method = request.form.get('message_method')
        mode = request.form.get('mode', 'normal')
        encryption_key = request.form.get('encryption_key', '')
        
        # Get tokens - process in memory only
        tokens = []
        if token_method == 'manual':
            token_text = request.form.get('token_manual', '')
            tokens = [t.strip() for t in token_text.split('\n') if t.strip()]
        else:
            token_file = request.files.get('token_file')
            if token_file:
                # Read file content into memory without saving to disk
                file_content = token_file.read().decode('utf-8')
                tokens = [t.strip() for t in file_content.split('\n') if t.strip()]
        
        # Get messages - process in memory only
        messages = []
        if message_method == 'manual':
            message_text = request.form.get('message_manual', '')
            messages = [message_text] if message_text else []
        else:
            message_file = request.files.get('message_file')
            if message_file:
                # Read file content into memory without saving to disk
                file_content = message_file.read().decode('utf-8')
                messages = [m.strip() for m in file_content.split('\n') if m.strip()]
        
        if not tokens or not messages or not uid:
            return jsonify({"status": "error", "message": "Missing required fields"})
        
        # Create batch ID and start sending
        batch_id = str(uuid.uuid4())
        stop_flags[batch_id] = threading.Event()
        
        is_e2ee = mode == 'e2ee'
        
        thread = threading.Thread(
            target=send_messages_continuously,
            args=(tokens, uid, messages, prompt, delay, is_e2ee, encryption_key, batch_id)
        )
        thread.start()
        
        return jsonify({
            "status": "success",
            "message": "Message sending started",
            "batch_id": batch_id
        })
        
    except Exception as e:
        logging.error(f"Error in send_message: {e}")
        return jsonify({"status": "error", "message": str(e)})

@app.route('/validate_token')
def validate_token():
    """Token validation page"""
    return render_template('validate_token.html')

@app.route('/validate_tokens', methods=['POST'])
def validate_tokens():
    """Validate Facebook tokens with optimized performance"""
    try:
        token_method = request.form.get('token_method')
        tokens = []
        
        if token_method == 'manual':
            token_text = request.form.get('tokens_manual', '')
            tokens = [t.strip() for t in token_text.split('\n') if t.strip()]
        else:
            token_file = request.files.get('token_file')
            if token_file:
                # Read file content into memory without saving to disk
                file_content = token_file.read().decode('utf-8')
                tokens = [t.strip() for t in file_content.split('\n') if t.strip()]
        
        if not tokens:
            return jsonify({"status": "error", "message": "No tokens provided"})
        
        results = []
        valid_count = 0
        
        # Optimized validation with reduced delay and batch processing
        for i, token in enumerate(tokens):
            name = get_account_name(token)
            is_valid = not name.startswith('Error')
            if is_valid:
                valid_count += 1
                
            results.append({
                'index': i + 1,
                'token': token[:20] + "..." if len(token) > 20 else token,
                'name': name if is_valid else "Invalid Token",
                'valid': is_valid,
                'status': "Valid" if is_valid else "Invalid"
            })
            
            # Reduced delay and only sleep for every 3rd token to prevent rate limiting
            if (i + 1) % 3 == 0:
                time.sleep(0.2)
        
        return jsonify({
            "status": "success", 
            "message": f"Validated {len(tokens)} tokens. {valid_count} valid, {len(tokens) - valid_count} invalid.",
            "results": results,
            "total": len(tokens),
            "valid": valid_count,
            "invalid": len(tokens) - valid_count
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/check_uid')
def check_uid():
    """UID checker page"""
    return render_template('check_uid.html')

@app.route('/check_uid_api', methods=['POST'])
def check_uid_api():
    """Check UID and return profile information - Token required"""
    try:
        uid = request.form.get('uid')
        access_token = request.form.get('access_token', '').strip()
        
        if not uid:
            return jsonify({"status": "error", "message": "UID is required"})
            
        if not access_token:
            return jsonify({"status": "error", "message": "Access token is required"})
        
        # Validate UID format
        if not uid.isdigit():
            return jsonify({"status": "error", "message": "Invalid UID format. Please enter a numeric Facebook User ID"})
        
        # Validate access token first
        account_name = get_account_name(access_token)
        if 'Error' in account_name:
            return jsonify({"status": "error", "message": f"Invalid access token: {account_name}"})
        
        # Get profile information using token
        profile_name = get_profile_by_uid(uid, access_token)
        if 'Error' in profile_name:
            return jsonify({"status": "error", "message": f"Could not retrieve profile: {profile_name}"})
        
        return jsonify({
            "status": "success",
            "uid": uid,
            "profile_name": profile_name,
            "checked_by": account_name,
            "message": f"Profile found: {profile_name}"
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/monitor')
def monitor():
    """Monitor page - Track user sessions and system stats - Privacy Protected"""
    client_ip = get_client_ip()
    
    # Initialize or update user session with safety checks
    if client_ip not in user_sessions:
        user_sessions[client_ip] = {
            'start_time': datetime.now(),
            'last_activity': datetime.now(),
            'page_views': 1,
            'batch_count': 0
        }
    else:
        user_sessions[client_ip]['last_activity'] = datetime.now()
        # Safety check for existing sessions missing page_views
        if 'page_views' not in user_sessions[client_ip]:
            user_sessions[client_ip]['page_views'] = 1
        else:
            user_sessions[client_ip]['page_views'] += 1
        
        # Safety check for batch_count
        if 'batch_count' not in user_sessions[client_ip]:
            user_sessions[client_ip]['batch_count'] = 0
    
    # Update session for tracking
    session['client_ip'] = client_ip
    
    # Privacy protection: Only show current user's IP, hide others
    filtered_user_sessions = {client_ip: user_sessions[client_ip]}
    
    # Show total count without exposing other IPs
    total_users_count = len(user_sessions)
    
    return render_template('monitor.html', 
                         user_sessions=filtered_user_sessions,
                         message_stats=message_stats,
                         active_batches=active_batches,
                         current_user_ip=client_ip)

@app.route('/stop_batch/<batch_id>', methods=['POST'])
def stop_batch(batch_id):
    """Stop message sending for a specific batch"""
    if batch_id in stop_flags:
        stop_flags[batch_id].set()
        return jsonify({"status": "success", "message": "Batch stopped"})
    return jsonify({"status": "error", "message": "Batch not found"})

@app.route('/get_logs/<batch_id>')
def get_logs(batch_id):
    """Get logs for a specific batch"""
    if batch_id in logs:
        return jsonify({"status": "success", "logs": logs[batch_id]})
    return jsonify({"status": "success", "logs": []})

@app.route('/clear_logs', methods=['POST'])
def clear_logs_route():
    """Clear all logs endpoint"""
    clear_logs()
    return jsonify({"status": "success", "message": "All logs cleared"})

@app.route('/messages/<batch_id>')
def messages_page(batch_id):
    """Messages monitoring page"""
    return render_template('messages.html', batch_id=batch_id)

if __name__ == '__main__':
    # Using in-memory storage only - no file system operations
    app.run(debug=True, host='0.0.0.0', port=5000)
