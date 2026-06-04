# Free Bucks Hosting - Production Deployment Guide

This guide covers everything you need to deploy Free Bucks Hosting on a production VPS using either Docker or PM2.

## Prerequisites
- A Linux VPS (Ubuntu 22.04 LTS recommended)
- Root or sudo access
- A domain name with A records pointing to your VPS IP:
  - `freebucks.example.com` (Frontend)
  - `api.freebucks.example.com` (Backend)

---

## 🚀 Option 1: Docker Compose (Recommended)
Docker automatically handles Node.js versions, Postgres, and Redis isolation.

### 1. Install Docker & Docker Compose
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the backend directory. Update the `DATABASE_URL` and `REDIS_URL` to point to the docker services:
```env
DATABASE_URL="postgresql://freebucks:password@postgres:5432/freebucks?schema=public"
REDIS_URL="redis://redis:6379"
```

### 3. Build & Run
From the root of the project:
```bash
docker-compose build
docker-compose up -d
```
Your backend will be available on port 5000 and frontend on port 3000.

---

## 🛠 Option 2: PM2 (Bare-Metal)
If you prefer running services directly on the host machine without Docker.

### 1. Install Node.js, PM2, Postgres, and Redis
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs postgresql redis-server
sudo npm install -g pm2
```

### 2. Setup PostgreSQL
```sql
sudo -u postgres psql
CREATE DATABASE freebucks;
CREATE USER freebucks WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE freebucks TO freebucks;
```

### 3. Configure PM2 Ecosystem
The `ecosystem.config.js` is already provided.
Run the application using PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🔒 Nginx & SSL Configuration
Nginx acts as a reverse proxy mapping your domains to the internal ports (3000 & 5000).

### 1. Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Copy Configuration
Copy the provided `nginx/freebucks.conf` to Nginx:
```bash
sudo cp nginx/freebucks.conf /etc/nginx/sites-available/freebucks
sudo ln -s /etc/nginx/sites-available/freebucks /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Generate SSL Certificates
```bash
sudo certbot --nginx -d freebucks.example.com -d api.freebucks.example.com
```

---

## 💾 Database Backups
Scripts are provided in the `scripts/` directory to safely dump and restore data.

**To Backup:**
```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

**To Restore:**
```bash
chmod +x scripts/restore.sh
./scripts/restore.sh ./backups/db_backup_TIMESTAMP.dump
```
