import { Route, Routes } from "react-router-dom";

import Banners from "./pages/Banners";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import axios from "./services/axios";
import { useEffect } from "react";
import { useStore } from "./store";

export default function App() {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    if (localStorage.getItem("admin-token")) {
      axios
        .post("auth/verify-token")
        .then((res) => {
          if (res.status === 200) {
            setCurrentUser(res.data.user);
            localStorage.setItem("admin-token", res.data.token);
          } else {
            setCurrentUser(null);
          }
        })
        .catch(() => {
          setCurrentUser(null);
        });
    } else {
      setCurrentUser(null);
    }
  }, []);

  if (typeof currentUser === "undefined") return <div>Loading</div>;

  return (
    <Routes>
      <Route
        index
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="banners" element={<Banners />} />
    </Routes>
  );
}
