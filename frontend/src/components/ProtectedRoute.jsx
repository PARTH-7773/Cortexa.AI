import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";
import CortexaLoader from "./CortexaLoader";

export default function Protectedroute({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const initialized = useSelector(selectAuthInitialized);

  if (initialized || loading) {
    return (
      <CortexaLoader
        label="Verifying session"
        sublabel="Checking your credentials..."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
