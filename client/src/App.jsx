import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Route, Routes, useLocation } from "react-router-dom";

import Cart from "./pages/Cart";
import Category from "./pages/Category";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import axios from "./services/axios";
import { getCart } from "./services/api/cart";
import { useEffect } from "react";
import { useStore } from "./store";

export default function App() {
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const setCart = useStore((state) => state.setCart);

  const location = useLocation();

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

    (async () => {
      const response = await getCart();
      setCart(response);
    })();
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="search" element={<Search />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
      </Routes>

      <Footer />
    </>
  );
}
