# StudySync – AI-Powered Smart Study & Exam Preparation Platform 🎓📚

StudySync is a full-stack MERN (MongoDB, Express, React, Node.js) academic management and exam preparation ecosystem tailored for university students (B.Tech CSE, BCA, MCA, B.Sc CS, and Teacher Education / ETT).

---

## 🌟 Key Features

### 1. 📖 Comprehensive Exam Prep Hub (Sem 1 to Sem 8 + ETT)
- **All 6 Units Covered**: Complete syllabus breakdown (Unit 1 to Unit 6) across 23 core engineering & education courses.
- **Visual Vector Diagrams**: Interactive, crisp SVG architectural diagrams for each unit (Neural Networks, Gradient Descent, Normalization ladders, B+ Trees, Paging/TLB, Compiler pipelines, OSI/TCP stacks, AVL balance rotations, and more).
- **Zero-to-Exam Crash Summaries**: Intuitive real-life analogies, simplified step-by-step intuition, and must-remember exam formulas.
- **Previous Year Questions (PYQs)**: Categorized by marks (Section A: 1M, Section B: 2M, Section C: 5M, and Section D: 10M) with complete model answers.
- **One-Click Note Saving**: Seamlessly saves any unit summary or exam pack directly into personal study notes.

### 2. 📅 Study Planning & Schedule Management
- **Daily Time-Blocked Planner**: Hourly scheduling with active task tracking.
- **Pomodoro Focus Timer**: Integrated timer with break modes and productivity statistics.
- **Streak & Habit Tracking**: Tracks consecutive study days and motivational analytics.

### 3. 🎯 Task, Assignment & Goal Tracker
- **Smart Assignment Tracker**: Due dates, subject tags, submission status, and priority badges.
- **Academic Goal Planner**: Milestones, progress bars, and completion deadlines.
- **Subject Dashboard**: Track attendance, syllabus progress, and credit requirements.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS tokens, Lucide Icons, Custom HD SVG Vector Engine (`VisualDiagram`).
- **Backend**: Node.js, Express 5, RESTful architecture, Modular MVC controllers and services.
- **Database**: MongoDB with Mongoose ODM (Data modeling, schema validations, and auto-seeding).
- **Authentication**: JWT (JSON Web Tokens) with secure HTTP-only cookies and bcrypt password hashing.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or MongoDB Atlas connection URI)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xenon-clien/studysync.git
   cd studysync
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Start the backend server (runs on port 3001)
   npm run dev  # or: node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd ../StudySync
   npm install
   # Start the frontend dev server (runs on port 5173)
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Account
- **Email**: `demo@studysync.app`
- **Password**: `demo1234`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
