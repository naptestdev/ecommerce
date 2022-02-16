import { Navigate, useLocation } from "react-router-dom";

import Spin from "react-cssfx-loading/lib/Spin";
import axios from "../shared/axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStore } from "../store";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handleFormSubmit = (data) => {
    if (loading) return;

    const { username, password } = data;

    setLoading(true);

    axios
      .post("auth/sign-in", {
        username,
        password,
      })
      .then((res) => {
        console.log(res.data);

        setCurrentUser(res.data.user);
        localStorage.setItem("admin-token", res.data.token);

        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response.data;

        console.log(errorMessage);

        if (errorMessage.errorSection === "username") {
          setError("username", { message: errorMessage.message });
        } else if (errorMessage.errorSection === "password") {
          setError("password", { message: errorMessage.message });
        }

        setLoading(false);
      });
  };

  if (currentUser) return <Navigate to={searchParams.get("redirect") || "/"} />;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-cyan-600 to-blue-600">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col justify-start items-stretch gap-1 px-5 py-10 w-full max-w-[350px] h-max bg-white"
      >
        <h1 className="text-center text-2xl mb-4">
          Đăng nhập vào trang quản trị
        </h1>
        <div>
          <input
            className="input-outline w-full"
            type="text"
            placeholder="Tên đăng nhập"
            {...register("username", {
              required: {
                value: true,
                message: "Hãy nhập tên đăng nhập của bạn",
              },
            })}
          />
          <p className="input-error">
            {errors.username && errors.username.message}
          </p>
        </div>
        <div>
          <input
            className="input-outline w-full"
            type="password"
            placeholder="Mật khẩu"
            {...register("password", {
              required: {
                value: true,
                message: "Hãy nhập mật khẩu của bạn",
              },
            })}
          />
          <p className="input-error">
            {errors.password && errors.password.message}
          </p>
        </div>
        <button className="w-full h-12 flex justify-center items-center bg-primary text-white hover:bg-secondary transition">
          {loading ? (
            <Spin color="#FFFFFF" height="30px" width="30px" />
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
    </div>
  );
}
