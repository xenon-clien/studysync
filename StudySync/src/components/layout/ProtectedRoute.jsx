import { Navigate } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';

export default function ProtectedRoute({ children }) {
  const { user } = useStudy();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
