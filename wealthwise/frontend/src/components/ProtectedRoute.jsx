import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const adminRole = localStorage.getItem("adminRole");

  // Admin routes — check admin token only
  if (adminOnly) {
    if (!adminToken || adminRole !== "ADMIN") {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  // Investor routes — check investor token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}