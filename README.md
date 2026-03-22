# Pulse — Frontend

React + Vite frontend for the Pulse real-time analytics dashboard. Connects to the Pulse API over REST and Socket.io to render live metrics, time-series charts, and a streaming event feed.

## Stack

- React 18
- Vite
- React Router 6
- Recharts
- Socket.io client
- Axios

## Setup

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000` and proxies `/api` and `/socket.io` to `http://localhost:5001` (the backend).

## Environment

For local dev nothing is needed — the Vite proxy handles it. For production builds you can set:

```
VITE_API_URL=https://your-api.com
VITE_SOCKET_URL=https://your-api.com
```

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx
│   ├── layout/
│   └── ui/
├── config/        — constants, endpoints, chart theme
├── context/       — auth context
├── hooks/         — useApi, useSocket, useDebounce, useToggle
├── pages/         — Dashboard, Analytics, Settings, Login
└── services/      — auth.service, analytics.service
```

## Demo login

```
admin@pulse.io / admin123
```
