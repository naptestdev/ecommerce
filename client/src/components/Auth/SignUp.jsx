import Spin from "react-cssfx-loading/lib/Spin";
import axios from "../../shared/axios";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignUp({ setView, setAlertText, setIsAlertOpened }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const handleFormSubmit = (data) => {
    const { email, password, username } = data;

    if (loading) return;

    setLoading(true);

    axios
      .post("auth/sign-up", {
        email,
        password,
        username,
      })
      .then((res) => {
        console.log(res.data);
        setIsAlertOpened(true);
        setAlertText("Tài khoản đã được tạo. Hãy xác nhận email của bạn!");
        setView("signIn");
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response.data;

        console.log(errorMessage);

        if (errorMessage.errorSection === "email") {
          setError("email", {
            message: errorMessage.message,
          });
        }

        setLoading(false);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col justify-start items-stretch gap-1 px-5 py-10 w-full h-full"
      >
        <h1 className="text-center text-2xl mb-4">Đăng ký</h1>
        <div>
          <input
            className="input-outline w-full"
            type="email"
            placeholder="Email"
            {...register("email", {
              pattern: {
                value:
                  /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm,
                message: "Hãy nhập một email đúng",
              },
              required: {
                value: true,
                message: "Hãy nhập email của bạn",
              },
            })}
          />
          <p className="input-error">{errors.email && errors.email.message}</p>
        </div>
        <div>
          <input
            className="input-outline w-full"
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Hãy nhập tên đăng nhập của bạn",
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
            placeholder="Password"
            {...register("password", {
              required: {
                value: true,
                message: "Hãy nhập mật khẩu",
              },
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 kí tự",
              },
              maxLength: {
                value: 18,
                message: "Mật khẩu phải có không quá 18 kí tự",
              },
            })}
          />
          <p className="input-error">
            {errors.password && errors.password.message}
          </p>
        </div>
        <div>
          <input
            className="input-outline w-full"
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("password") || "Xác nhận mật khẩu phải đúng",
            })}
          />
          <p className="input-error">
            {errors.confirmPassword && errors.confirmPassword.message}
          </p>
        </div>
        <button className="w-full h-12 flex justify-center items-center bg-primary text-white hover:bg-secondary transition">
          {loading ? (
            <Spin color="#FFFFFF" height="30px" width="30px" />
          ) : (
            "Đăng ký"
          )}
        </button>

        <span
          className="underline-anchor mt-3"
          onClick={() => setView("signIn")}
        >
          Đã có tài khoản? Đăng nhập
        </span>
      </form>
    </>
  );
}
