# TOP SPARK DIGITAL — BACKUP & DISASTER RECOVERY GUIDE

This document establishes the mandatory backup, storage, and recovery standards for Top Spark Digital (`https://topsparkdigital.com/`).

---

## 1. CRITICAL SCOPE BOUNDARY

All backup and restoration procedures documented here apply **strictly and exclusively** to:
- **Domain:** `https://topsparkdigital.com/`
- **Application Files & Database:** The Top Spark Digital agency application.

**The Dhaka Night Market website (`https://dnm.topsparkdigital.com/`) is a separate project and must NEVER be affected by any restore, rollback, or database wipe.**

---

## 2. BACKUP TARGETS & COMPONENTS

A complete recovery snapshot requires three separate components:

| Component | Location | Frequency | Retention |
| :--- | :--- | :--- | :--- |
| **Application State & Inquiries** | `/data/app_data.json` or Hostinger MySQL database | Daily automated snapshot | 30 Days |
| **Uploaded Media & Assets** | `/src/assets/images/` and `/public/` | Weekly / On upload | 90 Days |
| **Application Source & Config** | Git repository + `.env` backup (kept offline securely) | On every deploy | Permanent |

---

## 3. MANUAL BACKUP PROCEDURE

### A. Quick Snapshot via Command Line (VPS / Server)
```bash
# 1. Create a dated backup directory
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p /root/backups/topspark_$BACKUP_DATE

# 2. Archive database and media
cp /var/www/topsparkdigital/data/app_data.json /root/backups/topspark_$BACKUP_DATE/
tar -czf /root/backups/topspark_$BACKUP_DATE/images.tar.gz -C /var/www/topsparkdigital src/assets/images

# 3. Archive environment configuration (securely permissions restricted)
cp /var/www/topsparkdigital/.env /root/backups/topspark_$BACKUP_DATE/.env
chmod 600 /root/backups/topspark_$BACKUP_DATE/.env

echo "Backup complete: /root/backups/topspark_$BACKUP_DATE"
```

### B. Backup via Hostinger hPanel
1. Navigate to **Hostinger hPanel → Files → Backups**.
2. Click **Generate New Backup**.
3. Download the resulting zip file to an encrypted external storage drive.

---

## 4. RESTORATION & DISASTER RECOVERY PROCEDURE

If the application requires restoration:

### Step 1: Pre-Restoration Verification
1. Inspect the server environment to ensure the target directory is `/var/www/topsparkdigital` (or the root domain folder).
2. Confirm you are **not** modifying `dnm` or any files belonging to Dhaka Night Market.

### Step 2: Stop Running Process
```bash
pm2 stop topspark-agency
```

### Step 3: Restore Database & Assets
```bash
# Replace application data with backup snapshot
cp /root/backups/topspark_YYYYMMDD_HHMMSS/app_data.json /var/www/topsparkdigital/data/app_data.json

# Restore media assets if required
tar -xzf /root/backups/topspark_YYYYMMDD_HHMMSS/images.tar.gz -C /var/www/topsparkdigital/
```

### Step 4: Restart & Verify
```bash
pm2 start topspark-agency
pm2 logs topspark-agency --lines 20
```

### Step 5: Post-Restoration Acceptance Checks
1. Load `https://topsparkdigital.com/` and confirm public rendering.
2. Load `https://topsparkdigital.com/admin` and log in to verify existing inquiry history is restored.
3. Check `https://dnm.topsparkdigital.com/` to verify Dhaka Night Market remains operating normally.
