## QuickServe – Food Ordering Web App

QuickServe is a React-based food ordering app with a modern UI, browsing and filtering, cart/checkout flow, authentication endpoints, and an optional AI-powered assistant that can suggest items based on context (weather/events) via a small Express API.

### Live
- Frontend (Vercel): set up in your Vercel project after importing this repo.
- Optional GitHub Pages: supported via `gh-pages` script (see Deploy section).

---

## Features
- Add to cart, cart sidebar and full cart page
- Product browsing, categories, filtering, pagination
- Product detail page with quantity controls
- Checkout page flow
- Authentication & JWT (login/register) with persona saved to token and localStorage
- User management API (Node/Express, MongoDB)
- Role-based navigation surface driven by persona
- QuickChat page using an AI assistant (OpenAI) with optional weather/event context
- Notifications, Orders, My Orders, Received Orders, Customer Queries, Manage Users
- Responsive layout, header/footer, and themed assets

---

## Tech Stack
- React 17, React Router v6, Redux Toolkit
- UI: Bootstrap, MUI, Slick Carousel, Remix Icons
- State: `@reduxjs/toolkit`, `react-redux`
- Build: Create React App (react-scripts 5)
- API: Node/Express in `src/api.js` (optional for AI suggestions)

---

## Project Structure
- `src/pages/` – route pages like `Home`, `AllFoods`, `FoodDetails`, `Cart`, `Checkout`, `Login`, `Register`, `QuickChat`, etc.
- Additional pages used by roles: `Orders`, `MyOrders`, `ReceivedOrders`, `Notifications`, `ManageUsers`, `CustomerQueries`, `OrderRouteMap`
- `src/components/` – layout (`Header`, `Footer`), UI widgets (cards, categories, slider, cart overlay)
- `src/store/` – Redux store and slices for shopping cart
- `src/routes/Routers.js` – React Router v6 route definitions
- `src/assets/` – images and fake product data
- `src/api.js` – optional Express server for QuickChat AI endpoint
- `public/` – CRA public assets and `index.html`

---

## Roles & Access (Personas)
Users choose a persona at Register/Login. Persona is stored in JWT and used by the header to show relevant navigation and pages.

- Customer
  - Header links: My Orders, Notifications
  - Core: browse foods, cart/checkout, order history
- Restaurant
  - Header links: Orders
  - Core: view/manage incoming orders
- Delivery Personnel
  - Header links: Received Orders
  - Core: view assigned orders; `OrderRouteMap` available for routing
- System Administrator
  - Header links: Manage Users
  - Core: user listing, update, delete
- Customer Support
  - Header links: Customer Queries
  - Core: view/respond to customer messages

Implementation references:
- Persona captured in Register/Login: `src/pages/Register.jsx`, `src/pages/Login.jsx`
- Token returns persona; profile endpoint surfaces persona: `src/server.js` (`/api/login`, `/api/user-info`)
- Header checks persona to render items: `src/components/Header/Header.jsx`

---

## Requirements
- Node.js 22.x (Vercel requires 22.x; set locally with `.nvmrc`)

---

## Environment Variables
Create a `.env` in the project root for local development (not committed). Example:

```
# Frontend
REACT_APP_API_BASE=http://localhost:3002

# AI/API server (src/api.js)
PORT=3002
OPENAI_API_KEY=your-openai-api-key
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
SERP_API_KEY=your-serpapi-key
```

Notes:
- Never expose server secrets in the frontend build. On Vercel, configure `REACT_APP_API_BASE` for the frontend project, and all server secrets in the API project (separate deployment).

---

## Install & Run (Local)
1) Install deps
```
npm install
```

2) Start the optional AI/API server (if you want QuickChat to respond):
```
npm run api:dev
# or
npm run api
```

3) Start the frontend
```
npm start
```

The frontend dev server runs on http://localhost:3000 and proxies `/api/*` to `http://localhost:3002` via `package.json` `proxy`, or uses `REACT_APP_API_BASE` if set.

---

## Scripts
- `npm start` – start CRA dev server
- `npm run build` – production build to `build/`
- `npm run api` – start the AI/API server (`src/api.js`)
- `npm run api:dev` – start the AI/API server with nodemon
- `npm run deploy` – deploy to GitHub Pages (builds then publishes `build/`)

---

## Deployment

### Vercel (recommended)
Already configured for SPA routing via `vercel.json`:
```
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
Steps:
1) Push to GitHub and import the repo in Vercel (New Project → GitHub).
2) Settings → Build & Output
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Node.js Version: 22.x (we set `"engines": { "node": "22.x" }`)
3) Environment Variables (Frontend project)
   - `REACT_APP_API_BASE`: your API URL (e.g. `https://your-api.example.com`)
4) Deploy. Use the Production domain provided by Vercel.

Deploying the API on Vercel: either convert `src/api.js` to Vercel serverless functions or deploy it as a separate Node service (Render/Railway/Fly). Set all secrets (`OPENAI_API_KEY`, etc.) only in the API project’s environment variables.

Troubleshooting Vercel blank page:
- Ensure `package.json` does not have a `homepage` pointing to GitHub Pages.
- Ensure `vercel.json` includes `{ "handle": "filesystem" }` before the SPA rewrite so JS/CSS assets are served.
- Hard refresh and check the browser console/network for 404s.

### GitHub Pages (optional)
1) Add `homepage` to `package.json` (example):
```
"homepage": "https://<username>.github.io/<repo>"
```
2) Deploy:
```
npm run deploy
```
It publishes `build/` to the `gh-pages` branch. SPA fallback is handled by copying `index.html` → `404.html` during `postbuild`.

---

## QuickChat AI Endpoint
`src/api.js` exposes `POST /api/getSuggestions` that accepts `{ query: string }` and can enrich the prompt with weather or events context. It uses:
- OpenAI Chat Completions (`OPENAI_API_KEY`)
- OpenWeatherMap (`OPENWEATHERMAP_API_KEY`)
- SerpAPI (optional, `SERP_API_KEY`)

The frontend page `src/pages/QuickChat.js` posts to `${REACT_APP_API_BASE}/api/getSuggestions`.

---

## Common Issues & Fixes
- White page on Vercel: remove `homepage` from `package.json`; confirm `vercel.json` routes; hard refresh.
- Mixed content/CORS: ensure API is HTTPS in production; set `REACT_APP_API_BASE` to the public API URL.
- CRA build errors (ajv/schema-utils): Use Node 22 on Vercel; legacy peer deps are enabled via `.npmrc`.
- Dev server binding error (HOST): if CRA complains about HOST, unset it before `npm start` (e.g. `unset HOST`).

---

## License
This repository is for personal/educational use. Add a license if you plan to distribute.

---

## Acknowledgements
- React, Redux Toolkit, Bootstrap, MUI, Slick Carousel
- OpenAI, OpenWeatherMap, SerpAPI
