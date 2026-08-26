import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// wraps any page that should only be reachable by a logged in host
// sends anyone without a session straight to the login page
export default function ProtectedRoute({ children }) {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
