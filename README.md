# Messaging App

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A real-time messaging app with Google one-tap authentication, instant message delivery via WebSockets, and full PWA support - installable on desktop and mobile across all platforms.

**Live demo:** [thechatapplication.netlify.app](https://thechatapplication.netlify.app/)

---

## Features

- Google one-tap sign-in via Auth0
- Real-time messaging with WebSockets
- Friend system
- Installable as a PWA on any platform

## Tech Stack

| | |
|---|---|
| Framework | React 19.2 + TypeScript |
| Build tool | Vite 7.2 |
| Styling | Tailwind CSS |
| Auth | Auth0 (Google) |
| Real-time | WebSockets |
| PWA | vite-plugin-pwa |

## Getting Started

### Prerequisites

- Node.js `23.4.0` (use `.nvmrc` with [nvm](https://github.com/nvm-sh/nvm): `nvm use`)

### Install

```bash
npm install
```

### Auth0 Setup

Create a **Single Page Application** in the [Auth0 dashboard](https://manage.auth0.com/) and enable Google as a social connection. You'll need the domain, client ID, and audience from there.

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=        # Backend base URL
VITE_AUTH0_DOMAIN=        # From Auth0 dashboard
VITE_AUTH0_CLIENT_ID=     # From Auth0 dashboard
VITE_AUTH0_AUDIENCE=      # From Auth0 API settings
```

### Run

```bash
npm run dev
```

## Backend

The API is a separate repository: [lukabis/messaging-api](https://github.com/lukabis/messaging-api)

## Design

UI based on the [E-Chat UI Kit](https://www.figma.com/design/24QlD37wvNsEsnz2fn0kSL/Chatting-App-UI-Kit-Design-%7C-E-Chat-%7C-Figma--Community-?node-id=21-122&p=f) (Figma Community).

## License

[MIT](https://opensource.org/licenses/MIT)
