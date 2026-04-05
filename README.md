# BenAI Mobile + Backend (Monorepo)

AI-powered campus assistant for Bennett University.

This repo contains:

- Mobile App: React Native (Expo, TypeScript)
- Backend Core Service: Express + Prisma
- Backend AI Service: Express + Gemini API integration

---

## ✨ Features

- AI chat assistant for campus queries
- Faculty directory
- Academic calendar/events
- Campus/facility information
- Authentication (register/login)
- Modern glassmorphism mobile UI

---

## 📁 Project Structure

```text
BenAI-mobile/
├── frontend/                # Expo React Native app
├── backend/
│   ├── core-service/        # Auth + core APIs
│   └── ai-service/          # AI/chat + university data APIs
└── README.md
```

---

## 🧰 Tech Stack

### Frontend
- Expo (React Native)
- TypeScript
- React Navigation
- Expo Blur / Linear Gradient

### Backend
- Node.js + Express
- Prisma ORM
- SQLite (dev) / PostgreSQL (prod-ready)
- Gemini API (AI service)

---

## ✅ Prerequisites

- Node.js 20 LTS (recommended)
- npm
- Android Studio Emulator or physical Android device
- Expo CLI / EAS CLI (for APK builds)

---

## ⚙️ Environment Setup

Create env files before running:

### frontend/.env (example)
```env
EXPO_PUBLIC_CORE_SERVICE_URL=http://localhost:3020
EXPO_PUBLIC_AI_SERVICE_URL=http://localhost:3010
EXPO_PUBLIC_FRONTEND_URL=http://localhost:3000
```

For Android Emulator, localhost is auto-mapped to 10.0.2.2 in app config.
For physical phone, use your laptop LAN IP (example: http://192.168.x.x:3020).

### backend/core-service/.env (example)
```env
PORT=3020
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_here"
```

### backend/ai-service/.env (example)
```env
PORT=3010
GEMINI_API_KEY="your_key_here"
CORE_SERVICE_URL="http://localhost:3020"
```

---

## 🚀 Run Locally

Open 3 terminals from repo root.

### 1) Core service
```bash
cd backend/core-service
npm install
npm run dev
```

### 2) AI service
```bash
cd backend/ai-service
npm install
npm run dev
```

### 3) Mobile app
```bash
cd frontend
npm install
npx expo start -c
```

Then press:
- a for Android emulator
- or scan QR for device testing

---

## 🔐 Authentication Notes

Mobile app uses backend auth endpoints:

- POST /api/auth/register
- POST /api/auth/login

If login fails with 404, verify:
1. Core service is running on correct port
2. EXPO_PUBLIC_CORE_SERVICE_URL is correct

---

## 📦 Build APK (EAS)

From frontend/:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

After build completes, EAS provides an APK download link.

---

## 🌐 Deployment (Recommended)

Deploy both backend services separately (Railway/Render/Fly):

- backend/core-service
- backend/ai-service

Then set deployed HTTPS URLs in frontend env/EAS config.

---

## 🧪 Quality Checks

From frontend/:
```bash
npx tsc --noEmit
```

From backend services:
```bash
npm run build
```

---

## 📝 Git Ignore

This repo is configured to ignore:

- node_modules
- Expo build/generated files
- native build folders (android, ios)
- local env secrets (.env, .env.*)

---

## 👤 Author

Rahul
