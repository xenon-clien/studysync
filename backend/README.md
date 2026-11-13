# StudySync — Full-Stack MERN Backend & Integration Guide

Production-ready Node.js + Express + MongoDB backend powering the StudySync React + Vite frontend.

## Folder Structure

```
backend/
├── config/           # Database connection configuration (db.js)
├── constants/        # Role, status, priority, HTTP status constants
├── controllers/      # Thin Express controllers
├── logs/             # Production HTTP access logs
├── middleware/       # Auth (JWT & RBAC), errorHandler, sanitize, validators
├── models/           # Mongoose schemas with timestamps, indexes, JSON transforms
├── repositories/     # Generic database repository abstraction
├── routes/           # Express REST routers with ObjectId validation
├── services/         # Auth & email business logic
├── uploads/          # Upload storage directory
├── utils/            # handlerFactory, AppError, seedDemo, createEntityRouter, schemaTransform
├── validators/       # Joi request validation schemas
├── .env              # Active local environment configuration
├── .env.example      # Environment variable template
├── app.js            # Express middleware & route mounting
└── server.js         # Server entry point & DB/demo initialization
```

## Installation Guide

1. Ensure **MongoDB** is running locally (`mongodb://localhost:27017/studysync`) or configure a MongoDB Atlas URI in `backend/.env`.
2. Install dependencies & start the backend:
   ```bash
   cd backend
   npm install
   node server.js
   ```
3. Install dependencies & start the frontend in a separate terminal:
   ```bash
   cd StudySync
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173`.
   - Click **Use Demo Credentials** (`demo@studysync.app` / `demo1234`) on `/login`, or register a new account.

## Environment Variables (`backend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Express server port | `3001` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/studysync` |
| `JWT_SECRET` | Secret for signing access JWTs | `super_secret_jwt_key_that_should_be_changed` |
| `JWT_EXPIRE` | Access JWT lifetime | `30d` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh JWTs | `super_secret_refresh_jwt_key_that_should_be_changed` |
| `JWT_REFRESH_EXPIRE` | Refresh token lifetime | `7d` |
| `COOKIE_EXPIRE` | Cookie expiry in days | `30` |
| `CLIENT_URL` | Allowed CORS frontend origin | `http://localhost:5173` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Optional SMTP settings for Nodemailer | empty (logs reset link in dev) |

## API Documentation

Base URL: `http://localhost:3001`

### Health Check
- `GET /` — API metadata & DB status
- `GET /api/health` — Server health check

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register user (`{ name, email, password }`)
- `POST /api/auth/login` — Login (`{ email, password }`)
- `POST /api/auth/refresh` — Exchange refresh token for new access token
- `GET|POST /api/auth/logout` — Clear auth cookies & refresh session
- `GET /api/auth/me` — Get current authenticated user (Protected)
- `PUT /api/auth/profile` (`PUT /api/auth/me`) — Update profile `{ name, email }` (Protected)
- `PUT /api/auth/updatepassword` — Update password `{ currentPassword, newPassword }` (Protected)
- `POST /api/auth/forgotpassword` — Request password reset token `{ email }`
- `PUT /api/auth/resetpassword/:resettoken` — Reset password `{ password }`
- `GET /api/auth/users` — List users (Protected, Admin role only)

### Protected Resource Endpoints
Every resource supports `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `PATCH /:id`, `DELETE /:id`, plus query filtering (`?search=...&sort=...&page=1&limit=100&fields=...`):
- `/api/subjects` (aliases: `/api/subject`, `/subjects`, `/subject`)
- `/api/tasks` (aliases: `/api/task`, `/tasks`, `/task`)
- `/api/schedules` (aliases: `/api/schedule`, `/schedules`, `/schedule`)
- `/api/goals` (aliases: `/api/goal`, `/goals`, `/goal`)
- `/api/notes` (aliases: `/api/note`, `/notes`, `/note`)
- `/api/exams` (aliases: `/api/exam`, `/exams`, `/exam`)
- `/api/assignments` (aliases: `/api/assignment`, `/assignments`, `/assignment`)
- `/api/pomodorostats` (aliases: `/api/pomodoro`, `/pomodorostats`, `/pomodoro`)
- `/api/streaks` (aliases: `/api/streak`, `/streaks`, `/streak`)
- `/api/examprep` (aliases: `/api/exam-prep`, `/examprep`):
  - `GET /api/examprep/meta` — Available universities, courses, exam types, and subjects
  - `GET /api/examprep?course=...&university=...&examType=...&search=...` — Search/filter notes, PYQs & answers, and ETT/exam blueprints (with adaptive fallback for custom universities/colleges)
  - `POST /api/examprep` — Create custom University & Course exam pack
  - `POST /api/examprep/:id/pyq` & `POST /api/examprep/:id/note` — Add PYQ+answer or unit note
  - `GET|PUT /api/examprep/progress` — Save preferred course/university/examType and revised/bookmarked PYQs
