---
description: Panduan deploy aplikasi Next.js ke Easypanel menggunakan MySQL
---

# Panduan Deploy ke Easypanel

Easypanel mempermudah deployment menggunakan Docker di bawah tenda. Berikut langkah-langkahnya:

## 1. Buat Project Baru
Masuk ke dashboard Easypanel dan klik tombol **"Create Project"**. Beri nama project Anda (misalnya: `ichibot-store`).

## 2. Tambahkan Service Database (MySQL)
1. Klik **"Add Service"** > **"Database"** > **"MySQL"**.
2. Beri nama service database (misalnya: `mysql-db`).
3. Easypanel akan menyiapkan kredensial secara otomatis.
4. Catat bagian **Environment Variables** (terutama `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`).

## 3. Tambahkan Web App (Next.js)
1. Klik **"Add Service"** > **"App"**.
2. Masukkan URL repository Git Anda di bawah tab **"Source"**.
3. Easypanel secara otomatis akan mendeteksi aplikasi Next.js menggunakan **Nixpacks**.

## 4. Konfigurasi Environment Variables
Klik pada service Web App tadi, buka tab **"Environment"**, dan masukkan variabel berikut:

| Key | Value | Keterangan |
|---|---|---|
| `DATABASE_URL` | `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@mysql-db:3306/${MYSQL_DATABASE}` | Gunakan nama service database sebagai host |
| `NEXT_PUBLIC_WC_URL` | `https://site-anda.com` | URL WooCommerce Anda |
| `WC_CONSUMER_KEY` | `ck_...` | Sesuai kredensial WC |
| `WC_CONSUMER_SECRET` | `cs_...` | Sesuai kredensial WC |
| `SESSION_SECRET` | `sesuatu-yang-panjang-dan-unik` | Minimal 32 karakter |
| `ADMIN_PASSWORD` | `password-admin-anda` | Password untuk dashboard |

## 5. Deployment Setting
Buka tab **"Build"** pada service Web App:
1. Pastikan **Build Pack** diatur ke **Dockerfile** (Easypanel akan otomatis mendeteksi file `Dockerfile` yang baru saja saya buat).
2. Sistem akan otomatis menjalankan:
   - Instalasi `openssl` (untuk Prisma).
   - `npm install`
   - `npx prisma generate`
   - `npm run build`

## 6. Jalankan Deployment
Klik tombol **"Deploy"** di bagian atas service Web App. Easypanel akan melakukan build image dan menjalankan container.

## 7. Setup Domain (SSL Otomatis)
Buka tab **"Domains"** di service Web App dan masukkan domain Anda. Easypanel akan mengurus sertifikat SSL (Let's Encrypt) secara otomatis.
