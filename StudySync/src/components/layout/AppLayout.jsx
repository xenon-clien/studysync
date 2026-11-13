import { Outlet, useLocation } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const TITLES = {
  '/app': ['Dashboard', "Here's your study overview"],
  '/app/subjects': ['Subjects', 'Organize what you\'re learning'],
  '/app/tasks': ['Tasks', 'Everything you need to get done'],
  '/app/planner': ['Daily Planner', 'Block out today, hour by hour'],
  '/app/timer': ['Pomodoro Timer', 'Focus in short, deliberate bursts'],
  '/app/calendar': ['Calendar', 'Deadlines and sessions at a glance'],
  '/app/goals': ['Goals', 'Track the bigger picture'],
  '/app/exams': ['Exams', 'Stay ahead of test day'],
  '/app/exam-prep': ['Exam Prep Hub', 'University notes, PYQs & ETT patterns'],
  '/app/assignments': ['Assignments', 'Track submissions and due dates'],
  '/app/notes': ['Notes', 'Capture what matters'],
  '/app/analytics': ['Analytics', 'See your progress in numbers'],
  '/app/settings': ['Settings', 'Tune your StudySync experience'],
};

export default function AppLayout() {
  const { sidebarOpen } = useStudy();
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || ['StudySync', ''];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area" style={{ marginLeft: sidebarOpen ? 'var(--sidebar-w)' : 0, transition: 'margin .25s ease' }}>
        <Navbar title={title} subtitle={subtitle} />
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
