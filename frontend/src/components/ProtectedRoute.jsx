// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { selectAuthInitialized, selectIsAuthenticated } from "@/features/auth/authSlice";

// function Protectedroute({ children }) {
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const initialized = useSelector(selectAuthInitialized);
//   const location = useLocation();

//   if (!initialized) {
//     return <div className="p-10 text-center">Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return { children }
// }

// export default Protectedroute;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from "@/features/auth/authSlice";

function Protectedroute({children}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialized = useSelector(selectAuthInitialized);

  if (!initialized) return <div className="p-10 text-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to={"/login"} replace />;
  return {children};
}

export default Protectedroute;
