import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import TasksPage from './pages/TasksPage';
import PlannerPage from './pages/PlannerPage';
import TimerPage from './pages/TimerPage';
import CalendarPage from './pages/CalendarPage';
import GoalsPage from './pages/GoalsPage';
import ExamsPage from './pages/ExamsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import NotesPage from './pages/NotesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ExamPrepPage from './pages/ExamPrepPage';

function App() {
  return (
    <StudyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="timer" element={<TimerPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="exam-prep" element={<ExamPrepPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StudyProvider>
  );
}

export default App;
