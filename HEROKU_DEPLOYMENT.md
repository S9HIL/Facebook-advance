# FB@SAHIL_PRAJAPATI - Heroku Deployment Guide

## Step-by-Step Heroku Deployment

### Step 1: Install Heroku CLI
**Windows:**
- Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)
- Run installer

**Mac:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Prepare Project Files
1. Copy `deployment_requirements.txt` to create `requirements.txt`:
```txt
flask==3.1.1
flask-sqlalchemy==3.1.1
gunicorn==23.0.0
psycopg2-binary==2.9.10
requests==2.32.4
werkzeug==3.1.3
email-validator==2.2.0
```

2. Create `Procfile` (no extension):
```
web: gunicorn --bind 0.0.0.0:$PORT main:app
```

3. Create `runtime.txt`:
```
python-3.11.0
```

### Step 3: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

### Step 4: Heroku Login
```bash
heroku login
```
- Press any key to open browser
- Login to your Heroku account

### Step 5: Create Heroku App
```bash
heroku create fb-sahil-prajapati
```
Or with custom name:
```bash
heroku create your-custom-app-name
```

### Step 6: Set Environment Variables
```bash
heroku config:set SESSION_SECRET=your_heroku_secret_key_123456789
```

### Step 7: Deploy to Heroku
```bash
git push heroku main
```

### Step 8: Open Your App
```bash
heroku open
```
Your app will open at: `https://fb-sahil-prajapati.herokuapp.com`

### Step 9: View Logs (if needed)
```bash
heroku logs --tail
```

### Step 10: Test Application
Visit your Heroku URL and verify:
- All pages load correctly
- Token validation works
- Message sending operates properly
- Monitor page functions correctly

### Additional Heroku Commands:

**Scale your app:**
```bash
heroku ps:scale web=1
```

**Restart app:**
```bash
heroku restart
```

**View app info:**
```bash
heroku info
```

**Set additional config vars:**
```bash
heroku config:set VARIABLE_NAME=value
```

### Custom Domain Setup:
1. Add domain to Heroku:
```bash
heroku domains:add www.yourdomain.com
```

2. Update DNS records as instructed
3. Add SSL (automatic with paid dynos)

### Heroku Features:
- Easy Git-based deployments
- Automatic SSL with custom domains
- Add-ons marketplace
- Built-in monitoring
- Team collaboration

### Pricing (2025):
- Free tier discontinued
- Basic dynos: $5/month
- Standard dynos: $25/month
- Performance dynos: $250/month

### Troubleshooting:
- Check `heroku logs` for errors
- Verify all files are committed to Git
- Ensure Procfile is in root directory
- Check environment variables with `heroku config`

### Database Setup (if needed):
```bash
heroku addons:create heroku-postgresql:mini
```

### Useful Heroku Resources:
- Dashboard: dashboard.heroku.com
- Documentation: devcenter.heroku.com
- Status: status.heroku.com

### Support:
Heroku support for paid plans
Community forums for general help

Built by SAHIL PRAJAPATI