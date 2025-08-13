# FB@SAHIL_PRAJAPATI - Koyeb Deployment Guide

## Step-by-Step Koyeb Deployment

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

### Step 2: GitHub Repository
1. Create new GitHub repository
2. Upload all project files with `requirements.txt`
3. Push to GitHub

### Step 3: Koyeb Account Setup
1. Visit [koyeb.com](https://www.koyeb.com)
2. Sign up with GitHub account
3. Verify your email address
4. Complete account setup

### Step 4: Create New App
1. Click "Create App" button
2. Select "GitHub" as source
3. Connect your GitHub account
4. Choose your repository

### Step 5: App Configuration
- **App Name**: `fb-sahil-prajapati`
- **Branch**: `main`
- **Build Pack**: `Python`
- **Instance Type**: `nano` (free tier) or `micro` (paid)

### Step 6: Advanced Settings
1. Click "Advanced" tab
2. **Build Command**: (leave empty, auto-detected)
3. **Run Command**: `gunicorn --bind 0.0.0.0:$PORT main:app`
4. **Port**: `8000` (Koyeb default)

### Step 7: Environment Variables
Add these environment variables:
- `SESSION_SECRET`: `your_super_secret_key_12345678`
- `PORT`: `8000`

### Step 8: Deploy Application
1. Click "Deploy" button
2. Wait 3-5 minutes for build and deployment
3. Your app will be live at: `https://fb-sahil-prajapati-[random].koyeb.app`

### Step 9: Custom Domain (Optional)
1. Go to "Domains" section
2. Add your custom domain
3. Update DNS settings as instructed

### Step 10: Test Application
1. Visit your Koyeb URL
2. Test all features:
   - Token validation
   - UID checking
   - Message sending
   - Monitor page

### Koyeb Features:
- Global edge network
- Automatic scaling
- Free tier with 512MB RAM
- Easy GitHub integration
- Built-in monitoring

### Troubleshooting:
- Check deployment logs for errors
- Ensure Python version compatibility
- Verify environment variables
- Check port configuration (8000 for Koyeb)

### Billing:
- Free tier: 512MB RAM, 1 vCPU
- Paid plans: Start from $5.50/month

### Support:
Contact Koyeb support for technical issues
Developed by SAHIL PRAJAPATI