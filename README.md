# SecureDock RBAC System

## Secure Docker-Based Application Deployment System with Role-Based Access Control

A production-style full-stack DevOps project demonstrating:

- Secure Authentication & Authorization
- Role-Based Access Control (RBAC)
- Docker-Based Multi-Container Architecture
- CI Pipeline Automation using GitHub Actions
- Secure REST API Architecture
- Automated Docker Image Build & Docker Hub Push
- Container Orchestration using Docker Compose

---

# 🚀 Features

## 🔐 Authentication & Authorization

- JWT-based Authentication
- Secure Login & Registration
- Password Hashing using bcrypt
- Protected Backend Routes
- Client-side Route Guards
- Token Expiry Handling
- Persistent Login Sessions
- Role-Based Access Control (RBAC)

### Roles Supported

#### 👤 User

- Register/Login
- Create Tasks
- Update Task Progress
- Delete Own Tasks
- View Own Tasks

#### 👑 Admin

- View All Users
- Delete Any User
- View All Tasks
- Delete Any Task
- View System Statistics

---

# 🛡️ Security Features

- JWT Authentication
- bcrypt Password Hashing
- Helmet Security Headers
- Express Rate Limiting
- Secure Environment Variables
- Docker Non-Root User Execution
- CORS Protection
- Protected API Routes
- Role Verification Middleware
- Secure Token-Based Authorization

---

# 🐳 Docker & DevOps Features

- Dockerized Frontend
- Dockerized Backend
- Docker Compose Orchestration
- Multi-Container Setup
- Health Check API
- CI/CD Pipeline using GitHub Actions
- Automated Docker Image Build
- Automated Docker Hub Push
- Build Validation Pipeline
- Production-Style Deployment Workflow

---

# ⚡ GitHub Actions CI/CD Pipeline

The CI/CD pipeline automatically runs on every push to:

- `main`
- `develop`

## Pipeline Stages

### ✅ Backend Check

- Install Dependencies
- Security Audit using `npm audit`

### ✅ Frontend Build

- Install Dependencies
- Production Build using Vite
- Artifact Upload

### ✅ Docker Build

- Build Backend Docker Image
- Build Frontend Docker Image

### ✅ Docker Push

- Push Images to Docker Hub
- Triggered only on `main` branch

---

# 🧰 Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| Frontend         | React 18, Vite, Axios                  |
| Backend          | Node.js, Express.js                    |
| Database         | MongoDB Atlas                          |
| Authentication   | JWT                                    |
| Security         | bcrypt, Helmet, Rate Limiting          |
| DevOps           | Docker, Docker Compose, GitHub Actions |
| Deployment       | Docker Hub                             |
| State Management | React Context API                      |

---

# 📁 Project Structure

```text
SecureDock/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── task.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   └── user.routes.js
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

JWT_EXPIRES_IN=7d

PORT=5000

CLIENT_ORIGIN=http://localhost:5173
```

---

# 🔧 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/gurleen-kaur5/SecureDock.git

cd SecureDock
```

---

# 🐳 Run Using Docker (Recommended)

## Build & Start Containers

```bash
docker-compose up --build
```

## Stop Containers

```bash
docker-compose down
```

---

# 💻 Run Locally Without Docker

## Backend

```bash
cd backend

npm install

npm run dev
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🌐 Application URLs

| Service      | URL                              |
| ------------ | -------------------------------- |
| Frontend     | http://localhost:5173            |
| Backend API  | http://localhost:5000/api        |
| Health Check | http://localhost:5000/api/health |

---

# 📌 API Endpoints

# 🔐 Authentication Routes

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register User |
| POST   | `/api/auth/login`    | Login User    |
| GET    | `/api/auth/me`       | Current User  |

---

# 📝 Task Routes

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/tasks`     | Get User Tasks       |
| POST   | `/api/tasks`     | Create Task          |
| PUT    | `/api/tasks/:id` | Update Task Progress |
| DELETE | `/api/tasks/:id` | Delete Task          |

---

# 👑 Admin Routes

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/admin/stats`     | System Statistics |
| GET    | `/api/admin/users`     | Get All Users     |
| DELETE | `/api/admin/users/:id` | Delete User       |
| GET    | `/api/admin/tasks`     | Get All Tasks     |
| DELETE | `/api/admin/tasks/:id` | Delete Any Task   |

---

# 🐳 Docker Commands Used

## Build Docker Images

```bash
docker build -t securedock-backend ./backend

docker build -t securedock-frontend ./frontend
```

## Run Containers

```bash
docker run -p 5000:5000 securedock-backend

docker run -p 5173:5173 securedock-frontend
```

## View Running Containers

```bash
docker ps
```

## Stop Containers

```bash
docker stop <container_id>
```

## Remove Containers

```bash
docker rm <container_id>
```

## Remove Images

```bash
docker rmi <image_id>
```

---

# 🔄 GitHub Actions Workflow

Workflow File Location:

```text
.github/workflows/ci-cd.yml
```

## GitHub Secrets Required

Go to:

```text
Repository → Settings → Secrets and Variables → Actions
```

Add:

| Secret Name        | Value                   |
| ------------------ | ----------------------- |
| DOCKERHUB_USERNAME | Your DockerHub Username |
| DOCKERHUB_TOKEN    | DockerHub Access Token  |

---

# 📦 Docker Hub Integration

Docker images are automatically pushed to Docker Hub after successful builds.

## Images Generated

```text
gurleennkaur5/securedock-backend

gurleennkaur5/securedock-frontend
```

---

# 🔍 Health Check Endpoint

```http
GET /api/health
```

Response:

```json
{
  "status": "OK",
  "message": "SecureDock API running"
}
```

---

# 🧠 RBAC Flow

```text
Request
   ↓
JWT Verification
   ↓
Role Validation
   ↓
Protected Controller
   ↓
MongoDB
```

---

# 📸 Demo Flow

## User Flow

- Register as User
- Login
- Create Tasks
- Update Task Progress
- Delete Tasks

## Admin Flow

- Register/Login as Admin
- View Users
- View All Tasks
- Delete Users
- Delete Tasks
- Monitor System Stats

---

# 📈 DevOps Concepts Implemented

- CI/CD Pipeline
- Containerization
- Docker Networking
- Image Tagging
- Automated Deployment
- Build Automation
- Environment Variable Management
- Secure Secret Management
- Multi-Container Architecture

---

# 🎯 Future Enhancements

- Kubernetes Deployment
- Nginx Reverse Proxy
- HTTPS with SSL
- Refresh Tokens
- Redis Caching
- Role Permission Matrix
- Monitoring using Prometheus & Grafana
- Jenkins Integration
- AWS/GCP Deployment

---

# 👩‍💻 Author

## Gurleen Kaur

3rd Year CSE Undergraduate  
DevOps | Full Stack | Security Enthusiast

GitHub:  
https://github.com/gurleen-kaur5

---

# ⭐ If You Like This Project

Give this repository a ⭐ on GitHub.

---
