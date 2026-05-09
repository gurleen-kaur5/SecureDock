<<<<<<< HEAD

# SecureDock RBAC System

**Secure Docker-Based Application Deployment System with Role-Based Access Control**

A production-style full-stack web application demonstrating secure authentication, role-based authorization, containerized deployment with Docker, and automated CI/CD via GitHub Actions.

---

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 18 + Vite, React Router v6, Axios      |
| Backend  | Node.js, Express.js, JWT, bcrypt             |
| Database | MongoDB Atlas + Mongoose                     |
| Security | Helmet, CORS, Rate Limiting, RBAC Middleware |
| DevOps   | Docker, Docker Compose, GitHub Actions       |

---

## Features

### Authentication

- User registration with role selection (user / admin)
- JWT-based login with secure token storage
- Protected routes (client + server side)
- Token expiry handling with auto-redirect

### Authorization (RBAC)

- **User role**: Create tasks, view own tasks, delete own tasks
- **Admin role**: View all users, delete users, view all tasks, delete any task, system stats
- Middleware-enforced role checks on every protected endpoint

### Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens signed with env-configured secret
- HTTP security headers via Helmet
- Rate limiting (100 req / 15 min per IP)
- CORS restricted to configured origin
- Non-root Docker user execution
- No secrets in source code — all via `.env`

---

## Project Structure

```
SecureDock/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js     # register, login, getMe
│   │   ├── task.controller.js     # CRUD for own tasks
│   │   └── admin.controller.js    # admin-only operations
│   ├── middleware/
│   │   └── auth.middleware.js     # protect + adminOnly
│   ├── models/
│   │   ├── user.model.js          # User schema
│   │   └── task.model.js          # Task schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── task.routes.js
│   │   └── admin.routes.js
│   ├── server.js                  # Express app entry
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + interceptors
│   │   ├── App.jsx                # Routing + route guards
│   │   ├── index.css              # Design system
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions pipeline
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- MongoDB Atlas account (free tier works)

### 1. Clone & Configure

```bash
git clone https://github.com/yourname/securedock.git
cd SecureDock

# Copy environment template
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/securedock
JWT_SECRET=your_64_char_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Run with Docker (Recommended)

```bash
docker-compose up --build
```

| Service      | URL                              |
| ------------ | -------------------------------- |
| Frontend     | http://localhost:5173            |
| Backend API  | http://localhost:5000/api        |
| Health Check | http://localhost:5000/api/health |

### 3. Run Locally (Development)

```bash
# Backend
cd backend
cp ../.env.example .env   # edit with your values
npm install
npm run dev               # runs on :5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev               # runs on :5173
```

---

## API Reference

### Auth Endpoints

| Method | Route                | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| POST   | `/api/auth/register` | ✗    | Register new user  |
| POST   | `/api/auth/login`    | ✗    | Login, returns JWT |
| GET    | `/api/auth/me`       | ✓    | Get current user   |

### Task Endpoints (User)

| Method | Route            | Auth | Description     |
| ------ | ---------------- | ---- | --------------- |
| GET    | `/api/tasks`     | ✓    | Get own tasks   |
| POST   | `/api/tasks`     | ✓    | Create new task |
| DELETE | `/api/tasks/:id` | ✓    | Delete own task |

### Admin Endpoints

| Method | Route                  | Auth  | Description               |
| ------ | ---------------------- | ----- | ------------------------- |
| GET    | `/api/admin/stats`     | Admin | System statistics         |
| GET    | `/api/admin/users`     | Admin | List all users            |
| DELETE | `/api/admin/users/:id` | Admin | Delete user + their tasks |
| GET    | `/api/admin/tasks`     | Admin | List all tasks            |
| DELETE | `/api/admin/tasks/:id` | Admin | Delete any task           |

---

## GitHub Actions CI/CD

The pipeline runs on every push to `main` / `develop`:

1. **Backend Check** — `npm audit` security scan
2. **Frontend Build** — Vite production build + artifact upload
3. **Docker Build** — Build both images (validates Dockerfiles)
4. **Docker Push** _(main branch only)_ — Push to Docker Hub

### GitHub Secrets Required

In your GitHub repo → Settings → Secrets:

| Secret               | Value                    |
| -------------------- | ------------------------ |
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN`    | Docker Hub access token  |

---

## RBAC Architecture

```
Request → Express Router
              ↓
         protect()          ← validates JWT, attaches req.user
              ↓
         adminOnly()        ← checks req.user.role === 'admin'
              ↓
         Controller         ← business logic
              ↓
         MongoDB            ← data layer
```

- Roles: `user` (default) | `admin`
- Roles stored in MongoDB, embedded in JWT payload
- Every sensitive route is double-protected: JWT auth + role check

---

## Docker Architecture

```
┌─────────────────────────────────┐
│         docker-compose          │
│                                 │
│  ┌─────────────┐  ┌──────────┐ │
│  │  frontend   │  │ backend  │ │
│  │  :5173      │  │  :5000   │ │
│  │  (serve)    │  │  (node)  │ │
│  └─────────────┘  └────┬─────┘ │
│                         │       │
└─────────────────────────┼───────┘
                          │
                   MongoDB Atlas
                   (external cloud)
```

---

## Demo Walkthrough (Viva)

1. **Register** as a `user` → redirected to User Dashboard
2. **Create tasks** with different statuses (pending, in-progress, completed)
3. **Logout**, then **register** as an `admin`
4. **Admin Dashboard** → Overview (stats), Users (list + delete), Tasks (all tasks + delete)
5. Show **401** by calling `/api/admin/stats` without a token in browser
6. Show **403** by calling admin route with a user token

---

## Environment Variables

| Variable         | Required | Default                 | Description               |
| ---------------- | -------- | ----------------------- | ------------------------- |
| `MONGO_URI`      | ✓        | —                       | MongoDB connection string |
| `JWT_SECRET`     | ✓        | —                       | Secret for signing JWTs   |
| `JWT_EXPIRES_IN` | ✗        | `7d`                    | Token expiry duration     |
| `PORT`           | ✗        | `5000`                  | Backend server port       |
| `CLIENT_ORIGIN`  | ✗        | `http://localhost:5173` | Allowed CORS origin       |

---

# _Built for university DevOps coursework — demonstrating Docker containerization, JWT RBAC, and GitHub Actions CI/CD._

# SecureDock
