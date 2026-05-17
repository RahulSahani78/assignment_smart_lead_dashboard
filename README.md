# Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the **MERN** stack and strict **TypeScript** end-to-end. Capture, qualify, filter and export leads with a modern, responsive UI — supports role-based access (Admin / Sales), JWT auth, debounced search, server-side pagination, CSV export and dark mode.

> Built as a take-home assignment, but architected like a production app: clean MVC, services layer, centralized error handling, environment validation, Docker, security middleware, and rich UX states (loading / empty / error).

---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — register, login, protected routes, bcrypt password hashing, auth middleware
- 👥 **Role-Based Access Control** — `admin` (see all leads) vs `sales` (see only their own)
- 📊 **Leads CRUD** — create, read, update, delete with full validation
- 🔍 **Advanced Filtering & Search** — combine `status` + `source` + name/email search + sort (latest/oldest)
- 📄 **Server-side Pagination** — 10 records per page (configurable), with full metadata
- ⚡ **Debounced Search** — 400 ms debounce, no spam to backend
- 📥 **CSV Export** — exports current filter set, UTF-8 BOM for Excel compatibility
- 🌗 **Dark Mode** — system preference + manual toggle, no flash on load
- 🎨 **Professional UI/UX** — responsive, reusable components, skeleton loaders, empty states, error states, toast notifications
- 🐳 **Docker** — one-command `docker compose up`

### Engineering
- ✅ **Strict TypeScript** everywhere (frontend + backend). No `any` outside of two narrow, justified spots.
- ✅ **MVC architecture** with a dedicated **services layer** for business logic
- ✅ **Zod** for request validation, with centralized validation middleware
- ✅ **Centralized error handling** — `ApiError` class + global error middleware
- ✅ **Consistent API responses** — `{ success, message, data, meta? }`
- ✅ **Security** — `helmet`, `cors`, `express-rate-limit`, password hashing, no secret leakage
- ✅ **Reusable UI primitives** — `Button`, `Input`, `Select`, `Modal`, `Badge`, etc.

---

## 🛠 Tech Stack

| Layer       | Tech                                                        |
|-------------|-------------------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, TailwindCSS, React Router, Axios, react-hot-toast |
| Backend     | Node.js, Express 4, TypeScript, Mongoose, JWT, bcrypt, Zod, Helmet, express-rate-limit |
| Database    | MongoDB 7                                                   |
| Tooling     | Docker, docker-compose, ts-node-dev                         |

---

## 📁 Project Structure

```
RahulAssign/
├── backend/
│   ├── src/
│   │   ├── config/           # env + db connection
│   │   ├── controllers/      # thin HTTP layer
│   │   ├── middlewares/      # auth, role, validate, error
│   │   ├── models/           # Mongoose schemas (User, Lead)
│   │   ├── routes/           # versioned routes (/api/v1)
│   │   ├── services/         # business logic
│   │   ├── scripts/          # seed
│   │   ├── types/            # shared TS types
│   │   ├── utils/            # ApiError, ApiResponse, jwt, csv, asyncHandler
│   │   ├── validators/       # Zod schemas
│   │   ├── app.ts            # express app setup
│   │   └── server.ts         # bootstrap
│   ├── .env.example
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # axios + endpoints
│   │   ├── components/
│   │   │   ├── ui/           # Button, Input, Select, Modal, Badge
│   │   │   ├── common/       # PageLoader, EmptyState, ErrorState, TableSkeleton
│   │   │   ├── layout/       # Navbar, AppLayout, AuthLayout
│   │   │   └── leads/        # StatsCards, LeadFilters, LeadTable, LeadFormModal, etc.
│   │   ├── context/          # AuthContext, ThemeContext
│   │   ├── hooks/            # useDebounce
│   │   ├── pages/            # Login, Register, Dashboard, LeadDetails, NotFound
│   │   ├── routes/           # ProtectedRoute
│   │   ├── types/            # shared TS types
│   │   ├── utils/            # validators, format
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── API.md                    # full API documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (20 recommended)
- **MongoDB 6+** (or use the Docker Compose Mongo service)

### Option A — Run with Docker (recommended)

```bash
# from project root
docker compose up --build
```

That spins up:
- MongoDB → `mongodb://localhost:27017`
- Backend  → `http://localhost:5000` (API at `/api/v1`)
- Frontend → `http://localhost:8080` (served by Nginx with API proxy)

To seed demo data:
```bash
docker compose exec backend npm run seed
```

### Option B — Run Locally (without Docker)

**1. Backend**
```bash
cd backend
cp .env.example .env       # then edit values
npm install
npm run seed               # optional - creates demo users & leads
npm run dev                # http://localhost:5000
```

**2. Frontend** (new terminal)
```bash
cd frontend
cp .env.example .env       # optional
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000` automatically.

---

## 👤 Demo Accounts (after running `npm run seed`)

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | `admin@smartleads.io` | `admin123` |
| Sales | `sales@smartleads.io` | `sales123` |

---

## 🔌 API Overview

Base URL: `/api/v1`

| Method | Endpoint               | Auth        | Description                                     |
|--------|------------------------|-------------|-------------------------------------------------|
| POST   | `/auth/register`       | —           | Create account (defaults to `sales` role)       |
| POST   | `/auth/login`          | —           | Login, returns JWT + user                       |
| GET    | `/auth/me`             | Bearer      | Get current user profile                        |
| GET    | `/leads`               | Bearer      | List leads (filter/search/sort/paginate)        |
| POST   | `/leads`               | Bearer      | Create lead                                     |
| GET    | `/leads/:id`           | Bearer      | Get single lead                                 |
| PUT    | `/leads/:id`           | Bearer      | Update lead                                     |
| DELETE | `/leads/:id`           | Bearer      | Delete lead                                     |
| GET    | `/leads/stats`         | Bearer      | Counts by status / source                       |
| GET    | `/leads/export`        | Bearer      | CSV export honoring current filters             |
| GET    | `/health`              | —           | Health check                                    |

**Query params for `/leads`:**
`status`, `source`, `search`, `sort` (`latest|oldest`), `page`, `limit` (max 100)

> See [API.md](./API.md) for full request/response examples and error formats.

---

## 🌗 Dark Mode

- Auto-detects `prefers-color-scheme: dark`
- Manual toggle in the navbar
- No flash of light content on initial load (inline script in `index.html`)
- Persisted in `localStorage`

---

## 🔐 Security Notes

- Passwords hashed with **bcrypt** (10 rounds), never returned in API responses
- **JWT** stored in `localStorage` (simple for this assignment; in production prefer HttpOnly cookies)
- **Helmet** for security headers, **CORS** locked to `CLIENT_ORIGIN`
- **Rate limiting** (300 req / 15 min per IP) on `/api`
- All inputs validated with **Zod** before reaching controllers
- Mongo injection is mitigated via Mongoose schema casting + regex escaping in search

---

## 🧪 Validation & Error Handling

- Every endpoint validated by Zod schemas, errors returned as
  `{ success: false, message, errors: [{ path, message }] }`
- All controllers wrapped in `asyncHandler` — no try/catch boilerplate
- A single `errorHandler` middleware normalizes Mongo / JWT / Zod / generic errors

---

## 🐳 Docker Notes

- `backend/Dockerfile` — multi-stage build (TS → JS, slim runtime)
- `frontend/Dockerfile` — multi-stage build → static assets served by Nginx
- `frontend/nginx.conf` — SPA fallback + `/api` proxy to backend service
- `docker-compose.yml` — mongo + backend + frontend with persistent volume

---

## 📦 Submission Checklist

- [x] Strict TypeScript across frontend + backend
- [x] Authentication (register, login, JWT, bcrypt, protected routes)
- [x] Leads CRUD with validation
- [x] Filtering (status, source), search by name/email, sort (latest/oldest) — all composable
- [x] Server-side pagination (limit 10)
- [x] Debounced search (400 ms)
- [x] CSV export with current filters
- [x] Role-Based Access Control (admin / sales)
- [x] Docker setup (one-command bring-up)
- [x] Responsive, polished UI with loading / empty / error states
- [x] Dark mode (bonus)
- [x] `.env.example`, `API.md`, this README

---

## 📜 License

MIT — built for educational/assignment purposes.
