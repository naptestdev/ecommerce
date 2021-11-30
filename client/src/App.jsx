import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import Search from "./pages/Search";
import axios from "./services/axios";
import { useEffect } from "react";
import { useStore } from "./store";

export default function App() {
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .post("auth/verify-token")
        .then((res) => {
          if (res.status === 200) {
            setCurrentUser(res.data.user);
            localStorage.setItem("token", res.data.token);
          } else {
            setCurrentUser(null);
          }
        })
        .catch((err) => {
          setCurrentUser(null);

          console.log(err.response?.data);
        });
    } else {
      setCurrentUser(null);
    }
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </>
  );
}
