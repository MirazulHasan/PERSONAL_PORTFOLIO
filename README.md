<div align="center">

<a href="https://mirazulhasan.vercel.app/" target="_blank">
    <img src="https://scontent.fdac207-1.fna.fbcdn.net/v/t39.30808-6/657190489_3483840618458573_6232082997291758341_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeGNlVmVG96uyoTAr7gUiZEbAgRjpcNlFnUCBGOlw2UWdbp5lOIFBY9uUDcxNSVsiD_09yH--Vgmjo8MUYuS4NZ6&_nc_ohc=yzCJypHxAh8Q7kNvwEn2aXM&_nc_oc=AdohKmPeY1NYx00rKG8ydH1DkeXylfAGImfVPqA2tu6Ekg4WQ39xJ7f4q7S58avOAx0&_nc_zt=23&_nc_ht=scontent.fdac207-1.fna&_nc_gid=rZaeaWeNm9GZH-F243t5kw&_nc_ss=7a32e&oh=00_Afx1lZ7uf4xrSwB2OjMCGGpBR7avu_oG-IJDuVO3HcZtSA&oe=69CE1EDA" alt="Portfolio Preview" style="width: 100%; cursor: pointer;">
</a>

# Md. Mirazul Hasan — Portfolio

**A full-stack developer portfolio built with Next.js, Prisma, NextAuth, and TypeScript.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mirazulhasan.vercel.app-black?style=for-the-badge&logo=vercel)](https://mirazulhasan.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Light / Dark Theme** | FOUC-safe toggle using `localStorage` |
| 🌊 **Animated Background** | Bouncing colour puddles via `requestAnimationFrame` |
| 👤 **Profile Management** | Name, bio, title, social links, avatar upload with crop & resize |
| 🎓 **Education** | Degrees, fields, CGPA/GPA/Division (float support), Ongoing status |
| 💼 **Experience** | Roles, timelines, and a "Currently Working" toggle |
| 🚀 **Projects** | Featured projects with tags, GitHub & live links |
| 🧠 **Skills** | Categorised with visual proficiency bars |
| 📜 **Certificates** | Credentials with verifiable URLs |
| ✍️ **Blog Posts** | Articles with markdown-ready storage |
| 🔒 **Admin Panel** | Fully protected by NextAuth session |
| 📄 **CV Management** | Full CV system built into the admin panel |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Styling | Vanilla CSS + CSS Variables |
| Animations | `requestAnimationFrame` |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🗂 Project Structure

```
my-portfolio/
├── prisma/               # Database schema & migrations
├── src/
│   ├── app/
│   │   ├── admin/        # Protected admin panel
│   │   ├── api/          # REST API routes
│   │   └── page.tsx      # Public portfolio homepage
│   ├── components/       # Shared React components
│   └── lib/              # Prisma client & utilities
├── .env.example          # Environment variable template
└── next.config.ts        # Next.js configuration
```

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/my-portfolio.git
cd my-portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the values in .env.local

# 4. Push the database schema
npx prisma db push

# 5. (Optional) Explore your data with Prisma Studio
npx prisma studio

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment (Vercel — Recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/my-portfolio.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
2. Add these **Environment Variables** in the Vercel dashboard:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your production DB connection string (e.g. Neon / Railway PostgreSQL) |
| `NEXTAUTH_SECRET` | A secure random string — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployment URL, e.g. `https://your-portfolio.vercel.app` |

3. Click **Deploy** ✅

> **Note:** The default `dev.db` is a local SQLite file and is intentionally excluded from Git.
> For production, provision a **PostgreSQL** database ([Neon](https://neon.tech) is free) and update `DATABASE_URL`.

### 3. Switching SQLite → PostgreSQL for Production

In `prisma/schema.prisma`, update the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:

```bash
npx prisma db push
# or for managed migrations:
npx prisma migrate deploy
```

---

## 🔐 Environment Variables Reference

```env
DATABASE_URL=file:./dev.db          # SQLite for local dev
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## 📄 License

[MIT](LICENSE) — free to use, adapt, and build upon for your own portfolio.

---

<div align="center">
  Made with ❤️ by <a href="https://mirazulhasan.vercel.app">Md. Mirazul Hasan</a>
</div>
