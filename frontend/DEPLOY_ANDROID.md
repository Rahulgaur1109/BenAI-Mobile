# BenAI Mobile Android Deployment (APK)

## 1) Prerequisites

- Node.js 20 LTS (recommended)
- Expo account: https://expo.dev/signup
- `backend/core-service` and `backend/ai-service` deployed publicly over HTTPS

## 2) Configure API URLs

Edit [eas.json](eas.json) and replace placeholder URLs:

- `EXPO_PUBLIC_CORE_SERVICE_URL`
- `EXPO_PUBLIC_AI_SERVICE_URL`
- `EXPO_PUBLIC_FRONTEND_URL`

## 3) Login to EAS

```bash
cd "/Users/rahul/Downloads/new hackathon/BenAI-mobile/frontend"
npx eas login
```

## 4) Link project to Expo (first time only)

```bash
npm run eas:setup
```

This will create/link the Expo project and update app config with project id.

## 5) Build installable APK

```bash
npm run build:apk
```

After build completes, open the Expo build URL and download the APK to your phone.

## 6) Install on phone

- Transfer APK to device
- Enable install from unknown sources
- Install and open app

## 7) Production store build (AAB)

```bash
npm run build:aab
```

Use this for Play Store upload.
