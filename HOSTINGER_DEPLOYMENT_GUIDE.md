# TOP SPARK DIGITAL — HOSTINGER DEPLOYMENT & PROTECTION GUIDE

**Authoritative Production Domain:** `https://topsparkdigital.com/`  
**Protected Subdomain (DO NOT TOUCH):** `https://dnm.topsparkdigital.com/` (Dhaka Night Market)

---

## 1. CRITICAL NOTICE: EXISTING SUBDOMAIN PROTECTION

> **CRITICAL DIRECTIVE:**
> The owner operates a separate website: **https://dnm.topsparkdigital.com/** (Dhaka Night Market).  
> **This website and its files, database, DNS records, SSL certificates, and server directories must remain completely untouched.**

Before any deployment activity:
1. **Never delete all files** in the root account.
2. Verify you are inside the document root for `topsparkdigital.com` only (usually `/public_html` or a dedicated Node.js application directory, distinct from `/public_html/dnm` or subdomain directories).
3. Do not alter DNS records for `dnm.topsparkdigital.com`.
4. Create a full cPanel / hPanel backup of your hosting account before making any deployment changes.

---

## 2. UNDERSTANDING YOUR HOSTINGER HOSTING PLAN

Hostinger provides several hosting tiers. Check your current plan in **hPanel** (under **Hosting → Details**):

### Scenario A: Hostinger VPS or Cloud Hosting (Recommended for Node.js)
- Full root access, Node.js 18/20/22 runtime, PM2 process manager, Nginx reverse proxy.
- Direct execution of `tsx server.ts` or `npm run build && npm start`.
- High performance, automatic background restarts, and direct SSL management.

### Scenario B: Hostinger Business Web Hosting / Cloud Startup (With Node.js Selector)
- Some Hostinger shared/business plans include the **Node.js Web App** feature in hPanel.
- Allows running a Node.js application on port `3000` with an automatic reverse proxy mapping from `topsparkdigital.com`.

### Scenario C: Standard Hostinger Shared Web Hosting (Static HTML/JS Frontend + PHP/Node API)
- The frontend can be built via `npm run build` and uploaded directly to `public_html/`.
- If Node.js is not supported on your shared plan, you can either upgrade to Hostinger Cloud Startup / VPS or run the lightweight Node.js backend on an entry-level VPS or Cloud Run while keeping the domain on Hostinger.

---

## 3. PRE-DEPLOYMENT BACKUP PROCEDURE

Before touching any files on Hostinger:
1. Log in to **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Go to **Files → Backups**.
3. Click **Generate New Backup** and wait for completion.
4. Download the **Files Backup** and **MySQL Databases Backup** to your local computer.
5. In File Manager, inspect the directory tree. Ensure you locate `dnm` or any files related to the Dhaka Night Market so you know where they reside and can avoid modifying them.

---

## 4. PRODUCTION BUILD PREPARATION

On your local workstation or CI/CD runner:

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build
```

This compiles optimized client bundles into the `/dist` directory.

---

## 5. ENVIRONMENT VARIABLES CONFIGURATION

Create a `.env` file in your application root directory on Hostinger. Never commit this file to public repositories.

```env
# SERVER
PORT=3000
NODE_ENV=production
APP_URL=https://topsparkdigital.com

# SECURITY & AUTHENTICATION
SESSION_SECRET="generate-a-secure-64-character-random-hex-string"
ADMIN_PASSWORD="ChooseAStrongAdminPassword2026!"

# SMTP EMAIL NOTIFICATIONS (info@topsparkdigital.com)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@topsparkdigital.com
SMTP_PASS="your-hostinger-email-password"
NOTIFICATION_EMAIL=info@topsparkdigital.com
```

---

## 6. DEPLOYING ON HOSTINGER VPS (STEP-BY-STEP)

If using Hostinger VPS (Ubuntu 22.04 / 24.04):

```bash
# 1. Connect to VPS via SSH
ssh root@your-vps-ip

# 2. Install Node.js 20 & Git & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2

# 3. Clone or upload your project
mkdir -p /var/www/topsparkdigital
cd /var/www/topsparkdigital
# (Copy project files or git clone)

# 4. Install production dependencies and build
npm install
npm run build

# 5. Start application with PM2 process manager
pm2 start server.ts --name "topspark-agency" --interpreter tsx
pm2 save
pm2 startup
```

### Nginx Reverse Proxy Configuration:
Edit `/etc/nginx/sites-available/topsparkdigital.com`:

```nginx
server {
    server_name topsparkdigital.com www.topsparkdigital.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and activate SSL:
```bash
sudo ln -s /etc/nginx/sites-available/topsparkdigital.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d topsparkdigital.com -d www.topsparkdigital.com
```

---

## 7. HOSTINGER EMAIL & SMTP VERIFICATION

1. In hPanel, go to **Emails → topsparkdigital.com**.
2. If `info@topsparkdigital.com` is not created yet, click **Create Email Account**:
   - Email: `info`
   - Password: (Set a strong password and save it)
3. Note Hostinger's standard SMTP settings:
   - **SMTP Host:** `smtp.hostinger.com`
   - **Port:** `465` (SSL)
   - **Username:** `info@topsparkdigital.com`
   - **Password:** The password created above
4. Enter these values into the production `.env` file.
5. In the Top Spark Admin Dashboard (`https://topsparkdigital.com/admin`), navigate to **System & SMTP** to verify active connection.

---

## 8. POST-DEPLOYMENT VERIFICATION CHECKLIST

- [ ] Visit `https://topsparkdigital.com/` — verifies that homepage renders in dark theme with Top Spark logo.
- [ ] Visit `https://dnm.topsparkdigital.com/` — **CONFIRM Dhaka Night Market is completely intact and functional.**
- [ ] Test mobile menu navigation on iOS / Android.
- [ ] Submit a test project inquiry on `https://topsparkdigital.com/contact`.
- [ ] Log in to `/admin` using your configured admin credentials.
- [ ] Confirm the test submission appears in the admin inquiry inbox.
- [ ] Verify receipt of the email notification at `info@topsparkdigital.com`.
- [ ] Check `https://topsparkdigital.com/sitemap.xml` and `https://topsparkdigital.com/robots.txt`.
