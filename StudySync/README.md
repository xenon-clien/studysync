# StudySync — Smart Study Planner

A complete, frontend-only study planner built with **React 19 + Vite**. Subjects, tasks, a daily planner, a Pomodoro timer, a calendar, goals, exams, assignments, notes, analytics, streaks, and dark mode — all persisted to `localStorage` with no backend required.

## Tech Stack
- **React 19** + **Vite** — build tool / dev server
- **React Router DOM** — routing, protected routes
- **Context API** — global state (`StudyContext`)
- **Recharts** — bar / line / pie charts for analytics
- **react-calendar** — monthly calendar view
- **react-icons** (Lucide set) — iconography
- **date-fns** — date math (countdowns, day differences)
- **localStorage** — full data persistence, no backend

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

### Build for production
```bash
npm run build
npm run preview
```

## Demo Login
This is a fully mocked, frontend-only auth flow — there is no real backend or password check.

- On the **Login** page, click **"Use Demo Credentials"** then **Sign In**, or
- Go to **Register** and create any account with a name + email.

Your session and all app data persist in your browser's `localStorage`, keyed under `studysync_*`.

## Features

### Authentication (Mock)
Login, Register, and Forgot Password pages with client-side validation, show/hide password, Remember Me, and a fake "reset link sent" confirmation.

### Dashboard
Subjects/tasks/completed/pending counters, today's focus time, a weekly focus area chart, current streak card, today's tasks (with one-click complete), today's plan, and per-subject goal progress.

### Subject Management
Add / edit / delete / search subjects with a name, color, and study-hour goal. Each subject card shows logged vs. goal hours.

### Task Management
Create / edit / delete tasks with subject, priority (High/Medium/Low), deadline, and estimated hours. Filter by All / Pending / Completed / High Priority, search by name, and filter by subject.

### Daily Planner
Pick any date and build an hour-by-hour timetable (add / edit / delete blocks with time, title, subject, and duration).

### Pomodoro Timer
A circular dial timer (25 min focus / 5 min break) with Start / Pause / Reset controls. Completed focus sessions automatically log to today's stats and extend your streak.

### Calendar View
Monthly calendar (react-calendar) with dot markers for task deadlines, exam dates, and assignment due dates. Click any day to see its events listed.

### Goal Management
Add goals like "Complete React in 30 Days" with a target date and a progress slider (0–100%). Shows days remaining per goal.

### Progress Analytics
Subject-wise study hours (bar chart), weekly progress (line chart), task completion (pie chart), and per-subject goal progress bars.

### Notes Section
Add / edit / delete / search free-text notes tagged by subject, viewable in a read modal.

### Exam Tracker
Upcoming vs. completed tabs, live day-countdown per exam, and a preparation-status pill (Not Started / In Progress / Completed).

### Assignment Tracker
Title, subject, due date, priority, and status, with one-click complete toggling and All / Pending / Completed filtering.

### Study Streak System
Current and longest streak shown in the sidebar, navbar, and dashboard. Completing a Pomodoro focus session increments the streak once per calendar day; missing a day resets it to 1 on the next session.

### Dark Mode
Full light/dark theme toggle (Settings → Appearance, or the navbar icon), preference saved to `localStorage`.

### Notifications
A notification center in the navbar (task/exam/streak reminders) plus an optional real **browser Notification API** permission request in Settings.

### Search & Filters
Search is available on Subjects, Tasks, and Notes; filters are available on Tasks (status/priority/subject), Exams (upcoming/completed), and Assignments (status).

### Responsive Design
Layout adapts from desktop down to mobile — sidebar collapses, grids stack to a single column, and the calendar/timer remain usable on narrow viewports.

## Project Structure
```
src/
  components/
    layout/        -> Sidebar, Navbar, AppLayout, ProtectedRoute
    ui/             -> Modal, StatCard, Pill, ProgressBar, DotProgress, CheckBox, Tabs, etc.
  context/
    StudyContext.jsx -> All global state + CRUD actions, backed by localStorage
  pages/
    auth/            -> LoginPage, RegisterPage, ForgotPasswordPage
    LandingPage, Dashboard, SubjectsPage, TasksPage, PlannerPage,
    TimerPage, CalendarPage, GoalsPage, ExamsPage, AssignmentsPage,
    NotesPage, AnalyticsPage, SettingsPage
  utils/
    storage.js       -> localStorage get/set/remove helpers + uid()
    seedData.js       -> First-run seed data for every entity
  App.jsx             -> Routes
  main.jsx            -> Entry point
  index.css           -> Design tokens (paper/ink/amber/sage/coral palette) & global styles
```

## Data Persistence
Everything lives in `localStorage` under the `studysync_` prefix: user/session, theme, subjects, tasks, schedule, goals, notes, exams, assignments, Pomodoro stats, and streak. Clearing your browser storage resets the app to its seeded first-run state.
