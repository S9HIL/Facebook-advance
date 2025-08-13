# FB@SAHIL_PRAJAPATI - Render Deployment Guide

## Step-by-Step Render Deployment

### Step 1: Prepare Files
1. Copy content from `deployment_requirements.txt` and create `requirements.txt`:
```txt
flask==3.1.1
flask-sqlalchemy==3.1.1
gunicorn==23.0.0
psycopg2-binary==2.9.10
requests==2.32.4
werkzeug==3.1.3
email-validator==2.2.0
```

### Step 2: GitHub Setup
1. Create new repository on GitHub
2. Upload all project files including the new `requirements.txt`
3. Commit and push to GitHub

### Step 3: Render Account Setup
1. Go to [render.com](https://render.com)
2. Sign up or login with your GitHub account
3. Click "New +" button
4. Select "Web Service"

### Step 4: Connect Repository
1. Click "Connect" next to your GitHub repository
2. Give your service a name: `fb-sahil-prajapati`
3. Select region closest to your users
4. Branch: `main` (or `master`)

### Step 5: Configure Build Settings
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT main:app`

### Step 6: Environment Variables
Click "Advanced" and add these environment variables:
- Key: `SESSION_SECRET` 
- Value: `your_complex_secret_key_here_123456789`
- Key: `PYTHON_VERSION`
- Value: `3.11.0`

### Step 7: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your app will be live at: `https://fb-sahil-prajapati.onrender.com`

### Step 8: Test Your App
1. Visit your Render URL
2. Test token validation
3. Try message sending functionality

### Important Notes for Render:
- Free tier sleeps after 15 minutes of inactivity
- Paid plans start at $7/month for always-on hosting
- Automatic HTTPS included
- Automatic deployments on Git push

### Troubleshooting:
- Check build logs if deployment fails
- Ensure all files are in repository root
- Verify environment variables are set correctly

### Support:
Contact Render support for hosting issues
Built by SAHIL PRAJAPATI