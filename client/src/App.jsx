import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Route, Routes, useLocation } from "react-router-dom";

import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Order from "./pages/Order";
import Orders from "./pages/Orders";
import PrivateRoute from "./components/PrivateRoute";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import { getCart } from "./services/cart";
import { useEffect } from "react";
import { useStore } from "./store";

export default function App() {
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const verifyUser = useStore((state) => state.verifyUser);
  const setCart = useStore((state) => state.setCart);

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      verifyUser();
    } else {
      setCurrentUser(null);
    }

    (async () => {
      const response = await getCart();
      setCart(response);
    })();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="search" element={<Search />} />
        <Route
          path="cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="order/:id"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
