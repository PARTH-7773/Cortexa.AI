import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "./features/auth/hooks/useAuth";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectUser,
  setInitialized,
  setLoading,
  setUser,
} from "./features/auth/authSlice";
import Logo from "./assets/Orbiting Circuit C Emblem.png";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import OldAgents from "./pages/AI-UI-Pages/Agents";
import NotFound from "./pages/NotFound";
import Protectedroute from "@/components/ProtectedRoute";

const protectedRoute = [
  "/",
  "/home",
  "/agents",
  "/agents/new",
  "/agents/old",
  "/integration",
  "/agent/new",
];

function CortexaLoadingScreen() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0e1015] px-4 text-white">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative grid size-16 place-items-center rounded-2xl border border-white/15 bg-black/80 p-2.5 shadow-xl">
          <img
            src={Logo}
            alt="Cortexa"
            className="animate-pulse h-full w-full object-contain"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          <span className="text-sm font-medium tracking-wide text-zinc-300">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { getMe } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(selectUser);
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    const isProtected = protectedRoute.includes(location.pathname);

    // Skip /me on public routes like /login or /404
    if (!isProtected) {
      if (!initialized) {
        dispatch(setInitialized());
      }
      return;
    }

    // Already verified in this session
    if (initialized && user) return;

    let isMounted = true;

    async function fetchUser() {
      dispatch(setLoading(true));
      try {
        const res = await getMe();
        if (!isMounted) return;
        dispatch(setUser(res?.user ?? null));
      } catch (error) {
        if (!isMounted) return;
        dispatch(setUser(null));
      } finally {
        if (!isMounted) return;
        dispatch(setLoading(false));
        dispatch(setInitialized());
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, initialized, user, getMe, dispatch]);

  // Show Cortexa Loading... UI while checking session on protected routes
  if (protectedRoute.includes(location.pathname) && (!initialized || loading)) {
    return <CortexaLoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Protectedroute />}>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/old" element={<OldAgents />} />
        <Route path="/integration" element={<OldAgents />} />
        <Route path="/agent/new" element={<OldAgents />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
