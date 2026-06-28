<div align="center">

<br/>

```
 ██████╗ ██████╗ ██████╗ ███████╗    ████████╗███████╗███████╗████████╗███████╗██████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝    ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██║     ██║   ██║██║  ██║█████╗         ██║   █████╗  ███████╗   ██║   █████╗  ██████╔╝
██║     ██║   ██║██║  ██║██╔══╝         ██║   ██╔══╝  ╚════██║   ██║   ██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝██████╔╝███████╗       ██║   ███████╗███████║   ██║   ███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝       ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

**The real-time technical interview platform.**  
Monaco editor · WebRTC video · Live code execution · Codeforces problem library · Stream chat.

<br/>

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-code--tester--teal.vercel.app-22c55e?style=for-the-badge)](https://code-tester-teal.vercel.app)
&nbsp;
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Stream](https://img.shields.io/badge/Stream-Video_+_Chat-005FFF?style=for-the-badge)](https://getstream.io)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

<br/>

</div>

---

## ◈ Why I Built This

Every interviewing tool I've touched falls into one of two traps — a glorified textarea with no context, or a bloated enterprise SaaS I'd never actually own.

I wanted one browser tab where a real technical interview can happen end-to-end. A VSCode-grade editor. A live video call. Code that actually runs. A real problem to solve. Chat in the same screen. And the ability to see the session history afterwards.

Code\_Tester is that tab. It's built by me, runs on my stack, and is exactly as complex as it needs to be — no more.

---

## ◈ What It Does

### Session Workspace

When you open a session, you get a three-panel split layout:

```
┌──────────────────────┬────────────────────────────┬──────────────────────────┐
│   PROBLEM PANEL      │   MONACO CODE EDITOR       │  STREAM VIDEO + CHAT     │
│                      │                            │                          │
│  • Problem name      │  Language selector:        │  ┌────────┐  ┌────────┐  │
│  • Difficulty badge  │    C++ / Java /            │  │  you   │  │  them  │  │
│  • CF rating tags    │    Python / JavaScript     │  └────────┘  └────────┘  │
│  • Description       │                            │                          │
│  • Input format      │  [▶ Run Code]  [⚙]         │  [🎤] [📷] [💬] [🔗]    │
│  • Output format     │                            │  ─────────────────────   │
│  • Constraints       │  Syntax highlighting       │  real-time chat          │
│  • Sample I/O        │  Autocomplete              │  messages appear here    │
│                      │  vs-dark theme             │                          │
│  [End Session] ←host │                            │                          │
├──────────────────────┴────────────────────────────┤                          │
│   OUTPUT PANEL  —  stdout · stderr · exit code    │                          │
└───────────────────────────────────────────────────┴──────────────────────────┘
```

- **Host** creates a session, picks a problem & difficulty (easy / medium / hard)
- A unique `callId` is generated; a **Stream Video call** and **Stream Chat channel** are created simultaneously
- Any authenticated user with the link can **join** — they're auto-added to the session and chat channel
- Code runs against **Judge0 CE** (proxied through Express) — C++ 13.2, Java 17, Python 3.11, Node 18
- The host can **End Session** — this hard-deletes both the video call and the chat channel, and marks the session `completed` in MongoDB

### Solo Practice

Every problem in the library is also available for solo practice at `/problems/:contestId/:index`. The layout is a resizable two-pane split: problem statement on the left, Monaco + console on the right. Two buttons: **Run Code** (runs against sample input) and **Submit** (launches confetti on pass).

### Problem Library

`/problems` is a full browsable problem set:

- Live-fetched from the **Codeforces API** and cached server-side for 15 minutes
- Falls back to a curated local list of ~80 problems if the API is unreachable
- Filterable by full-text search, tag, and difficulty tier (Easy ≤ 1200 · Medium 1300–1900 · Hard ≥ 2000)
- Paginated at 50 problems per page
- Clicking any problem opens the solo practice workspace

### Dashboard

After login, the dashboard shows:

- **Live Rooms** — active sessions polled every 5 seconds, filtered to within the last 2 hours
- **Past Sessions** — completed sessions where you were host or participant
- **Stats** — active rooms, completed sessions, unique problems attempted, success rate
- Animated count-up numbers triggered by scroll via `IntersectionObserver`

---

## ◈ Tech Stack

### Frontend

| | Package | Version | Purpose |
|---|---|---|---|
| ⚛ | `react` + `react-dom` | 19.1 | UI framework |
| ⚡ | `vite` | 7.1 | Build tool & dev server |
| 🎨 | `tailwindcss` | 4.1 | Utility-first styling |
| 🗺 | `react-router-dom` | 7.9 | Client-side routing |
| 📡 | `@tanstack/react-query` | 5.1 | Server state, caching, refetch |
| 🌐 | `axios` | 1.15 | HTTP client (custom instance w/ base URL) |
| ✏️ | `@monaco-editor/react` | 4.7 | VSCode-grade embedded editor |
| 🔥 | `firebase` | 12.6 | Auth client SDK (Email/Password + Google OAuth) |
| 📹 | `@stream-io/video-react-sdk` | latest | WebRTC video call + participant views |
| 💬 | `stream-chat` | via SDK | Real-time chat channel |
| 🔷 | `lucide-react` | 1.8 | Icon system |
| 🎭 | `react-icons` | 5.6 | Social icons (footer) |

### Backend

| | Package | Version | Purpose |
|---|---|---|---|
| 🟢 | `express` | 5.1 | HTTP server (ESM) |
| 🍃 | `mongoose` | 8.19 | MongoDB ODM |
| 🔐 | `firebase-admin` | 13.6 | Firebase token verification (middleware) |
| ⚙️ | `inngest` | 4.2 | Event-driven background jobs |
| 📹 | `@stream-io/node-sdk` | 0.7 | Stream Video server SDK |
| 💬 | `stream-chat` | 9.41 | Stream Chat server SDK |
| 🛡 | `express-rate-limit` | 8.5 | 100 req / 15 min / IP global limiter |
| 🌍 | `cors` | 2.8 | Allowlist CORS (FRONTEND_URL + localhost) |
| 🔑 | `dotenv` | 17.2 | Environment variable loading |
| 🔄 | `nodemon` | 3.1 | Dev hot-reload |

---

## ◈ Project Blueprint

```
Code-Tester/
│
├── package.json                        ← Root: build (installs + builds both) & start scripts
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js                   ← Express app entry: CORS allowlist, rate limiter,
│       │                                 route mounting, Inngest serve, DB connect on start
│       │
│       ├── firebase/
│       │   └── firebaseAdmin.js        ← Firebase Admin SDK init from env vars
│       │
│       ├── lib/
│       │   ├── env.js                  ← Single export of all process.env values
│       │   ├── DB.js                   ← mongoose.connect() with error exit
│       │   ├── stream.js               ← StreamChat instance (chat) + StreamClient (video)
│       │   │                             upsertUser / DeleteUser helpers
│       │   └── inngest.js              ← Inngest client + 2 functions:
│       │                                   sync_user_data  (user.created  → DB + Stream)
│       │                                   delete_user     (user.deleted  → DB + Stream)
│       │
│       ├── middleware/
│       │   └── auth.js                 ← verifyFirebaseToken: decodes Bearer token,
│       │                                 attaches req.user + req.user._id from DB
│       │
│       ├── models/
│       │   ├── user.model.js           ← { name, email, profileImage, firebaseUID } + timestamps
│       │   └── session.js              ← { problem, difficulty(easy|medium|hard),
│       │                                   host(ref:User), participants([ref:User]),
│       │                                   status(active|completed), callId } + timestamps
│       │
│       ├── controllers/
│       │   ├── chatController.js       ← getStreamToken: issues Stream Chat JWT for user
│       │   └── sessionController.js    ← createSession, getActiveSessions, getRecentSessions,
│       │                                 getSessionById, joinSession, endSession
│       │
│       └── routes/
│           ├── user.js                 ← POST /api/user/save  GET /api/user/profile
│           ├── chatRoutes.js           ← GET  /api/chat/token
│           ├── sessionRoutes.js        ← CRUD + join/end on /api/session
│           └── problems.js             ← GET  /api/problems (Codeforces proxy + cache)
│                                         GET  /api/problems/:contestId/:index
│                                         POST /api/problems/execute  (Judge0 proxy)
│
└── frontend/
    ├── index.html                      ← App shell, title "Code Tester"
    ├── vite.config.js                  ← Vite + React plugin + Tailwind plugin
    │                                     COOP/COEP set to unsafe-none (Stream SDK compat)
    ├── vercel.json                     ← SPA rewrite: /* → /index.html
    └── src/
        ├── main.jsx                    ← ReactDOM.createRoot → <StrictMode><App/>
        ├── index.css                   ← @import tailwindcss + .reveal / .visible animations
        ├── App.jsx                     ← QueryClientProvider + BrowserRouter + 7 routes:
        │                                 /  /login  /register  /dashboard
        │                                 /problems  /problems/:contestId/:index  /session/:id
        │
        ├── firebase/
        │   └── config.js               ← initializeApp + getAuth + GoogleAuthProvider
        │
        ├── pages/
        │   ├── Homepage.jsx            ← Landing: Navbar Hero Features HowItWorks
        │   │                             Stats Practice Testimonials CTABanner Footer
        │   ├── Dashboard.jsx           ← Auth-gated: DashboardHeader + DashboardSections
        │   ├── ProblemPage.jsx         ← Problem browser: search + tag + difficulty filter
        │   │                             TanStack Query pagination (50/page)
        │   ├── ProblemDetail.jsx       ← Solo workspace: resizable problem/editor split
        │   │                             Run Code + Submit via Judge0 proxy
        │   └── SessionPage.jsx         ← Full interview: problem + Monaco + output +
        │                                 Stream video/chat — auto-join, host-end logic
        │
        └── componets/
            ├── Auth/
            │   ├── Login.jsx           ← Email/password + Google OAuth, forgot password flow
            │   └── Register.jsx        ← Email/password + Google OAuth, auto-redirect if authed
            ├── CodeEditorPanel.jsx     ← Monaco Editor wrapper: language select, Run button,
            │                             vs-dark theme, no minimap, smooth cursor
            ├── OutputPanel.jsx         ← Dual-mode: session output (Piston shape) OR
            │                             practice console (idle|running|submitting|success|error)
            ├── ProblemPanel.jsx        ← Renders CF rating/tags OR session difficulty,
            │                             host "End Session" button
            ├── VideoCallUI.jsx         ← Stream Video: local + remote participant views,
            │                             mic/cam toggles, inline chat drawer, copy-link button
            ├── dashboard/
            │   ├── DashboardHeader.jsx ← Navbar w/ scroll effect + Welcome section + user avatar
            │   ├── DashboardSections.jsx ← Live sessions (5s poll) + Past sessions + Stats
            │   └── DashboardCards.jsx  ← StatCard (count-up) LiveSessionCard PastSessionCard
            ├── sections/               ← Hero Features HowItWorks Practice Testimonials CTABanner
            ├── layout/
            │   ├── Navbar.jsx          ← Fixed, backdrop-blur, scroll-aware border
            │   └── Footer.jsx          ← Brand + Platform + Company + Social links (GitHub/LinkedIn/Email)
            ├── ui/
            │   ├── Toast.jsx           ← Fixed bottom-right slide-in notification
            │   ├── Confetti.jsx        ← Canvas-free DOM confetti on submission pass
            │   └── CodeMock.jsx        ← Static syntax-highlighted "Two Sum" preview in Hero
            ├── hooks/
            │   ├── useReveal.js        ← IntersectionObserver scroll-reveal for .reveal elements
            │   └── useCountUp.js       ← Animated number count-up on scroll entry
            ├── data/
            │   ├── problems.js         ← ~80 curated Codeforces fallback problems (Easy/Medium/Hard)
            │   └── mockDashboard.js    ← Static mock data for dashboard UI scaffolding
            └── lib/
                └── axios.js            ← Axios instance: baseURL = VITE_backend_URL, withCredentials
```

---

## ◈ API Routes

| Method | Route | Auth | What it does |
|---|---|---|---|
| `POST` | `/api/user/save` | 🔒 Firebase | Upsert user in MongoDB + sync to Stream Chat |
| `GET` | `/api/user/profile` | 🔒 Firebase | Return combined Firebase + DB profile |
| `GET` | `/api/chat/token` | 🔒 Firebase | Issue Stream Chat JWT for the requesting user |
| `POST` | `/api/session` | 🔒 Firebase | Create session doc + Stream video call + Stream chat channel |
| `GET` | `/api/session/active` | 🔒 Firebase | Last 20 active sessions |
| `GET` | `/api/session/recent` | 🔒 Firebase | Completed sessions where user is host or participant |
| `GET` | `/api/session/:id` | 🔒 Firebase | Single session — 403 if not host/participant |
| `POST` | `/api/session/:id/join` | 🔒 Firebase | Add user to participants + Stream chat channel |
| `POST` | `/api/session/:id/end` | 🔒 Firebase | Host-only — hard-delete call + channel, mark completed |
| `GET` | `/api/problems` | 🌐 Public | Codeforces problem list (search / tag / difficulty / page / limit) |
| `GET` | `/api/problems/:contestId/:index` | 🌐 Public | Single problem detail with generated statement |
| `POST` | `/api/problems/execute` | 🌐 Public | Proxy code execution to Judge0, map response for frontend |
| `GET` | `/health` | 🌐 Public | `{ msg: "API is running" }` |
| `POST` | `/api/inngest` | Inngest | Background job handler (`sync_user_data`, `delete_user`) |

---

## ◈ How to Run Locally

### What you need before starting

- Node.js `v18+` and npm
- A **MongoDB Atlas** cluster (free tier works fine)
- A **Firebase** project with Email/Password and Google sign-in enabled
- A **Firebase Admin SDK** service account JSON (from Project Settings → Service Accounts)
- A **[Stream](https://getstream.io)** account with a Chat + Video app (free tier available)
- Judge0 CE — either use `https://ce.judge0.com` (public, rate-limited) or self-host

---

### 1 — Clone

```bash
git clone https://github.com/anirudhnegi2007/Code-Tester.git
cd Code-Tester
```

---

### 2 — Backend environment

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/code-tester

FRONTEND_URL=http://localhost:5173

# From your Firebase service account JSON
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# From Stream dashboard → App → API Keys
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Judge0 CE (public or self-hosted)
JUDGE0_URL=https://ce.judge0.com
```

---

### 3 — Frontend environment

Create `frontend/.env`:

```env
VITE_backend_URL=http://localhost:3000
```

---

### 4 — Install and run

**Install everything at once (from repo root):**

```bash
npm run build
# This runs: npm install --prefix backend
#            npm install --prefix frontend
#            npm run build  --prefix frontend
```

**Dev mode (hot reload, two terminals):**

```bash
# Terminal 1 — backend (nodemon)
cd backend && npm run dev

# Terminal 2 — frontend (Vite)
cd frontend && npm run dev
```

Frontend at `http://localhost:5173` · Backend at `http://localhost:3000`

**Production mode (from root):**

```bash
npm start
# Runs: node src/server.js inside /backend
```

---

## ◈ Deployment

### Frontend → Vercel

`frontend/vercel.json` already contains the SPA rewrite rule so React Router works on refresh:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Steps:
1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** → `frontend`
3. **Build Command** → `npm run build`
4. **Output Directory** → `dist`
5. Add environment variable: `VITE_backend_URL=https://your-backend.com`
6. Deploy

### Backend → Railway / Render / Fly.io

Deploy the `backend/` directory as a standalone Node.js service. Set all `.env` keys in the platform dashboard. Make sure `FRONTEND_URL` matches your Vercel deployment URL exactly so the CORS allowlist passes.

For **Render**: set start command to `npm start` (which runs `node src/server.js`).

For **Inngest**: register your deployed backend URL in the [Inngest dashboard](https://app.inngest.com) so background jobs fire correctly in production.

---

## ◈ Background Jobs — Inngest

Two event-driven functions handle user lifecycle automatically, so the DB and Stream Chat always stay in sync with Firebase Auth:

```
Event: user.created
  └─ sync_user_data
       ├─ step: connect-db
       ├─ step: create-user-db     → User.create({ firebaseUID, name, email, profileImage })
       └─ step: create-stream-user → chatClient.upsertUser(...)

Event: user.deleted
  └─ delete_user
       ├─ step: connect-db
       ├─ step: delete-db-user     → User.findOneAndDelete({ firebaseUID })
       └─ step: delete-stream-user → chatClient.deleteUser(userId)
```

To test locally, run the [Inngest Dev Server](https://www.inngest.com/docs/getting-started/local-development):

```bash
npx inngest-cli@latest dev
```

---

## ◈ Code Execution — Judge0

Code submitted in any session or problem goes through a backend proxy at `POST /api/problems/execute`. The backend calls Judge0 CE directly — the frontend never touches Judge0.

| Language | Judge0 ID | Runtime |
|---|---|---|
| C++ | `105` | GCC 13.2.0 |
| Java | `91` | OpenJDK 17.0.1 |
| Python | `92` | Python 3.11.2 |
| JavaScript | `93` | Node.js 18.15.0 |

The proxy maps Judge0's response shape into a standard `{ run: { stdout, stderr, code, output } }` object that both `OutputPanel` and `ProblemDetail` consume.

---

## ◈ Auth Flow

```
User signs in (Firebase client SDK)
   │
   ├─ Email/Password  →  signInWithEmailAndPassword
   └─ Google          →  signInWithPopup(GoogleAuthProvider)
           │
           ▼
    user.getIdToken()  →  Bearer token
           │
           ▼
    POST /api/user/save   (Authorization: Bearer <token>)
           │
           ▼
    backend: verifyFirebaseToken middleware
         → admin.auth().verifyIdToken(token)
         → attaches req.user  (Firebase claims)
         → attaches req.user._id  (MongoDB ObjectId, if found)
           │
           ▼
    User upserted in MongoDB + Stream Chat
```

All protected routes use the same `verifyFirebaseToken` middleware. The frontend sends the Firebase ID token on every request via `Authorization: Bearer`.

---

## ◈ Created By

<div align="center">

```
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   Anirudh Negi                                    ║
  ║   @anirudhnegi2007                                ║
  ║                                                   ║
  ║   Built because no existing tool felt like mine.  ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
```

[![GitHub](https://img.shields.io/badge/GitHub-anirudhnegi2007-181717?style=for-the-badge&logo=github)](https://github.com/anirudhnegi2007)
&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anirudh_Negi-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/anirudh-negi-b63b26307/)
&nbsp;
[![Email](https://img.shields.io/badge/Email-anirudhnegi2007@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:anirudhnegi2007@gmail.com)

</div>

---

<div align="center">

*Code together. Talk together. Evaluate together.*

</div>
