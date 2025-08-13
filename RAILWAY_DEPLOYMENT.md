# FB@SAHIL_PRAJAPATI - Railway Deployment Guide

## Step-by-Step Railway Deployment

### Step 1: Requirements File
1. Copy from `deployment_requirements.txt` to create `requirements.txt`:
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
1. Create GitHub repository
2. Upload all files including `requirements.txt`
3. Commit and push changes

### Step 3: Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Grant necessary permissions

### Step 4: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Click "Deploy Now"

### Step 5: Project Configuration
- **Service Name**: `fb-sahil-prajapati`
- **Framework**: Python (auto-detected)
- **Start Command**: Will be auto-configured

### Step 6: Environment Variables
1. Go to "Variables" tab
2. Add these variables:
   - `SESSION_SECRET`: `your_railway_secret_key_987654321`
   - `PORT`: `${{PORT}}` (Railway auto-assigns)
   - `PYTHONUNBUFFERED`: `1`

### Step 7: Custom Start Command (if needed)
1. Go to "Settings" tab
2. Under "Deploy", set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT main:app`

### Step 8: Deploy and Monitor
1. Railway auto-deploys after setup
2. Monitor deployment in "Deployments" tab
3. Check logs for any errors

### Step 9: Get Your URL
1. Go to "Settings" tab
2. Under "Networking", click "Generate Domain"
3. Your app will be at: `https://fb-sahil-prajapati-production.up.railway.app`

### Step 10: Test Everything
Visit your Railway URL and test:
- Homepage loads correctly
- Token validation works
- Message sending functions
- Monitor page displays properly

### Railway Features:
- Usage-based pricing
- Automatic SSL certificates  
- GitHub integration
- Built-in metrics and logs
- Global deployments

### Custom Domain Setup:
1. Go to "Settings" → "Networking"
2. Click "Custom Domain"
3. Enter your domain
4. Update DNS CNAME record

### Troubleshooting Railway:
- Check build and deploy logs
- Verify environment variables
- Ensure requirements.txt is in root
- Check Railway status page for outages

### Pricing:
- $5 free credit monthly
- Pay only for what you use
- No idle fees

### Advanced Features:
- Database plugins available
- Redis, PostgreSQL add-ons
- Team collaboration
- Private repositories

### Support:
Railway community Discord
Documentation: docs.railway.app
Created by SAHIL PRAJAPATI