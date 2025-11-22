# Lekya Logistics Platform

Full-stack delivery management system covering dispatch, live tracking, and cash reconciliation.

## Overview

- **Admin Console** — Next.js 14, Tailwind, NextAuth
- **Driver App** — Expo / React Native Android client
- **Data Layer** — File-based demo persisting orders, drivers, cash sessions (replace with WordPress + MySQL + Firebase in production)
- **Integrations** — Firebase Realtime DB placeholders, WhatsApp + SMS stubs

## Quickstart (Web Dashboard)

```bash
npm install
npm run dev
```

Default credentials:

| Role | Username | Password |
|------|----------|----------|
| Logistics Manager | `manager` | `manager123` |
| Finance Controller | `finance` | `finance123` |

Set environment variables (`.env`) to override defaults and provide Firebase keys.

### Scripts

- `npm run dev` — local dev server at `http://localhost:3000`
- `npm run build` — production build (required before Vercel deployment)
- `npm run start` — start production build
- `npm run lint` — Next.js lint check
- `npm run type-check` — strict TypeScript check

## Driver App (Expo)

```bash
cd driver-app
npm install
npm run android
```

Set `EXPO_PUBLIC_API_URL` to the deployed dashboard URL (defaults to `http://localhost:3000`).

Features:
- Sync assigned orders (`/api/drivers/:id/tasks`)
- Live GPS heartbeat (`/api/drivers/:id/heartbeat`)
- Workflow progression + COD capture
- Barcode scan via device camera

## Architecture Notes

- Replace JSON persistence with WordPress + WPCargo API + MySQL for production.
- Firebase Realtime Database hook ready (`lib/firebase.ts`) for driver telemetry.
- WhatsApp / SMS notifications are stubbed via `lib/actions/notifications.ts`.

## Deployment

1. `npm run build`
2. `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-d3254169`
3. Verify: `curl https://agentic-d3254169.vercel.app`

Driver app deployment (APK/AAB) via Expo EAS as needed.
