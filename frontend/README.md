# BenAI Mobile (Expo)

Modern React Native app for the existing BenAI project (kept fully separate from the original `BenAI` folder).

## Included

- Glassmorphism UI (`expo-blur` + gradients)
- Auth flow (login/register UI)
- AI Chat (Gemini-backed through existing AI service)
- Faculty Directory
- Academic Calendar
- Campus Map/Facilities
- Profile/Session page

## Uses Existing BenAI Services

- Core Service: `EXPO_PUBLIC_CORE_SERVICE_URL`
- AI Service: `EXPO_PUBLIC_AI_SERVICE_URL`
- Frontend Service (register/login APIs): `EXPO_PUBLIC_FRONTEND_URL`

Create `.env` in this folder:

```env
EXPO_PUBLIC_CORE_SERVICE_URL=http://localhost:3020
EXPO_PUBLIC_AI_SERVICE_URL=http://localhost:3010
EXPO_PUBLIC_FRONTEND_URL=http://localhost:3000
```

For a physical phone, replace `localhost` with your computer's LAN IP.

## Run

```bash
npm install
npm run start
```

Then open with Expo Go / iOS simulator / Android emulator.
