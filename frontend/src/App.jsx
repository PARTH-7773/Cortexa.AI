import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect } from "react";
import useAuth from "./features/auth/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setInitialized, setUser } from "./features/auth/authSlice";
import Protectedroute from "./components/Protectedroute";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import OldAgents from "./pages/AI-UI-Pages/Agents";
import Integrations from "./pages/Integrations";
import CreateAgent from "./pages/CreateAgent";
import NewHome from "./pages/NewHome";
import NotFound from "./pages/NotFound";

const protectedRoute = [
  "/home",
  "/agents/new",
  "/agents/old",
  "/integration",
  "/",
];

function App() {
  const { getMe } = useAuth();

  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        // console.log(res);
        dispatch(setUser(res.user));
        // navigate('/')
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setInitialized());
      }
    }
    const pathName = window.location.pathname;
    if (protectedRoute.includes(pathName)) {
      fetchUser();
    }
  }, []);

  const user = useSelector(selectUser);
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={"/"} /> : <Login />}
        />
        <Route path="/" element={user ? <NewHome /> : <Login />} />
        <Route path="/agents" element={user ? <Agents /> : <Login />} />
        <Route path="/agents/old" element={user ? <OldAgents /> : <Login />} />
        <Route
          path="/integration"
          element={user ? <Integrations /> : <Login />}
        />
        <Route path="/agent/new" element={user ? <CreateAgent /> : <Login />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={"/"} replace /> : <Login />}
        />
        <Route element={<Protectedroute />}>
          <Route path="/" element={<Home />} />
          {/* more private pages go here 
        </Route> 
      </Routes> */}
    </>
  );
}

export default App;
