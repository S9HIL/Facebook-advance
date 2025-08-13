# FB@SAHIL_PRAJAPATI - Deployment Guide

## Quick Deployment Instructions

### 1. Requirements
Copy `deployment_requirements.txt` content to create `requirements.txt`:

```txt
flask==3.1.1
flask-sqlalchemy==3.1.1
gunicorn==23.0.0
psycopg2-binary==2.9.10
requests==2.32.4
werkzeug==3.1.3
email-validator==2.2.0
```

### 2. Environment Variables
Set these environment variables on your hosting platform:

```bash
SESSION_SECRET=your_secret_key_here_make_it_complex
DATABASE_URL=your_database_url_here (if using database)
PORT=5000
```

### 3. Deployment Commands

**For Heroku:**
```bash
git init
git add .
git commit -m "Initial deployment"
heroku create your-app-name
heroku config:set SESSION_SECRET=your_secret_key
git push heroku main
```

**For Railway/Render:**
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

**For VPS/Server:**
```bash
pip install -r requirements.txt
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

### 4. File Structure
```
project/
├── main.py              # Entry point
├── app.py               # Main Flask application
├── requirements.txt     # Python dependencies
├── static/
│   ├── css/style.css   # Styling
│   └── js/main.js      # Frontend functionality
├── templates/          # HTML templates
│   ├── index.html
│   ├── validate_token.html
│   ├── check_uid.html
│   ├── monitor.html
│   └── messages.html
└── messages/           # Message storage directory
```

### 5. Features
- Facebook token validation
- UID checking with profile retrieval
- Message sending automation
- Real-time monitoring with privacy protection
- Beautiful glass UI with animations
- Terminal-style logging interface

### 6. Important Notes
- Ensure your Facebook tokens have proper permissions
- The application uses Facebook Graph API v17.0
- All user data is kept private (IP addresses, session info)
- Message sending uses the thread-based API endpoint for better compatibility

### 7. Support
Developed by SAHIL PRAJAPATI
This is a premium Facebook automation tool with advanced features.