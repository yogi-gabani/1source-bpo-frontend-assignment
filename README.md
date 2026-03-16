# Support Dashboard

A React demo app for a support/call-center style UI: live transcript, state management, optimistic escalation, high-frequency updates, multi-tenant account switching, and real-time sentiment charts. Built with **Vite**, **React 19**, **TypeScript**, **Zustand**, **TanStack Query**, **React Router**, **Tailwind v4**, and **Recharts**.

---

## Tech Stack

- **Build**: Vite + TypeScript
- **UI**: React 19 + Tailwind CSS v4 (`@tailwindcss/vite`)
- **State**: Zustand
- **Data / mutations**: TanStack React Query
- **Routing**: React Router
- **Mock API**: json-server (escalation endpoint)
- **Charts**: Recharts

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the mock API (optional, for escalation demo)

```bash
npm run dev:server
```

Runs json-server on `http://localhost:3000` with a `calls` collection.

### 3. Run the app

```bash
npm run dev
```

Open the URL from Vite (e.g. `http://localhost:5173`). The root path `/` redirects to the Live Transcript section.

---

## App Structure

- **Layout** – Shared header, navigation, and light/dark theme toggle.
- **Routes** – Each section has its own route and page component under `src/routes/`.
- **Stores** – `callStore` (active call, transcripts, connection status), `accountStore` (accounts and current tenant).
- **Components** – Transcript viewer (WebSocket/mock), escalation button (optimistic update), high-frequency dashboard (batched updates), account switcher + company KPIs, sentiment charts (Recharts).

### Routes

| Path     | Section              |
|----------|----------------------|
| `/`      | Redirects to `/q1`   |
| `/q1`    | Live Transcript      |
| `/q2-q3` | State store & Escalation |
| `/q4`    | High-Frequency Data   |
| `/q5`    | Account Switcher      |
| `/q6`    | Sentiment Charts      |

---

## Notes

- **Mock data** is used for transcripts, escalation API, company metrics, and sentiment so the app runs without a real backend. In production you’d wire these to live WebSockets and APIs.
- **Theme** – Light/dark mode is toggled in the header and persisted in `localStorage`.
