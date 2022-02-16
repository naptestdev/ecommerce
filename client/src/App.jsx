import { Route, Routes } from "react-router-dom";

import Banners from "./pages/Banners";
import BarWave from "react-cssfx-loading/lib/BarWave";
import EditProduct from "./pages/EditProduct";
import Home from "./pages/Home";
import NewProduct from "./pages/NewProduct";
import Order from "./pages/Order";
import Orders from "./pages/Orders";
import PrivateRoute from "./components/PrivateRoute";
import Products from "./pages/Products";
import ProductsList from "./components/Products/ProductsList";
import SignIn from "./pages/SignIn";
import Users from "./pages/Users";
import axios from "./shared/axios";
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

  if (typeof currentUser === "undefined")
    return (
      <div className="min-h-screen flex justify-center items-center">
        <BarWave />
      </div>
    );

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
      <Route
        path="banners"
        element={
          <PrivateRoute>
            <Banners />
          </PrivateRoute>
        }
      />
      <Route
        path="users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route path="orders">
        <Route index element={<Orders />} />
        <Route path=":id" element={<Order />} />
      </Route>
      <Route path="products">
        <Route
          index
          element={
            <PrivateRoute>
              <Products component={ProductsList} />
            </PrivateRoute>
          }
        />

        <Route
          path="new"
          element={
            <PrivateRoute>
              <Products component={NewProduct} />
            </PrivateRoute>
          }
        />

        <Route
          path=":id"
          element={
            <PrivateRoute>
              <Products component={EditProduct} />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
