import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  // Jika tidak ada token atau user, arahkan ke login
  if (!token || !user) {
    return <Navigate to="/pages/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
