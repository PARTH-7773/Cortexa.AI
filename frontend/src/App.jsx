import { useCallback, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectUser,
  setInitialized,
  setLoading,
  setUser,
} from "@/features/auth/authSlice";
import Protectedroute from "@/components/ProtectedRoute";
import CortexaLoader from "@/components/CortexaLoader";
import Agents from "@/pages/Agents";
import OldAgents from "@/pages/AI-UI-Pages/Agents";
import Integrations from "@/pages/Integrations";
import CreateAgent from "@/pages/CreateAgent";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import NewHome from "./pages/NewHome";
import {
  clearAgents,
  setAgentError,
  setAgentLoading,
  setAgents,
} from "./features/agent/agentSlice";
import useAgent from "./features/agent/hooks/useAgent";

const protectedRoute = [
  "/",
  "/home",
  "/agents",
  "/agents/new",
  "/agents/old",
  "/agent/new",
  "/integration",
];

function App() {
  const { getMe } = useAuth();
  const { getAllAgent } = useAgent();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(selectUser);
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    const isProtected = protectedRoute.includes(location.pathname);

    // Skip /me API call on public routes like /login or 404
    if (!isProtected) {
      if (!initialized) {
        dispatch(setInitialized());
      }
      return;
    }

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

  const fetchAllAgent = useCallback(async () => {
    try {
      dispatch(setAgentLoading(true));
      const result = await getAllAgent();
      const list = result?.agent ?? result?.agents ?? result ?? [];
      dispatch(setAgents(list));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message ||
        "Failed to load agents";
      dispatch(setAgentError(message));
    } finally {
      dispatch(setAgentLoading(false));
    }
  }, [dispatch, getAllAgent]);

  useEffect(() => {
    if (!user) {
      dispatch(clearAgents());
      return;
    }

    fetchAllAgent();
  }, [user, fetchAllAgent, dispatch]);

  if (protectedRoute.includes(location.pathname) && (!initialized || loading)) {
    return (
      <CortexaLoader
        label="Verifying session"
        sublabel="Securing your Cortexa workspace"
      />
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Studio Routes */}
      <Route element={<Protectedroute />}>
        <Route path="/" element={<NewHome />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/old" element={<OldAgents />} />
        <Route path="/agent/new" element={<CreateAgent />} />
        <Route path="/agents/new" element={<CreateAgent />} />
        <Route path="/integration" element={<Integrations />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
