import Spin from "react-cssfx-loading/lib/Spin";
import axios from "../../services/axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStore } from "../../store";

export default function SignIn({ setView, setIsOpened }) {
  const [loading, setLoading] = useState(false);

  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handleFormSubmit = (data) => {
    const { email, password } = data;

    setLoading(true);

    axios
      .post("auth/sign-in", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);

        setCurrentUser(res.data.user);
        localStorage.setItem("token", res.data.token);

        setIsOpened(false);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response.data;

        console.log(errorMessage);

        if (errorMessage.errorSection === "email") {
          setError("email", { message: errorMessage.message });
        } else if (errorMessage.errorSection === "password") {
          setError("password", { message: errorMessage.message });
        }

        setLoading(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col justify-start items-stretch gap-1 px-5 py-10 w-full h-full"
    >
      <h1 className="text-center text-2xl mb-4">Sign In</h1>
      <div>
        <input
          className="input-outline w-full"
          type="email"
          placeholder="Email"
          {...register("email", {
            pattern: {
              value:
                /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm,
              message: "Please enter a valid email",
            },
            required: {
              value: true,
              message: "Email is required",
            },
          })}
        />
        <p className="input-error">{errors.email && errors.email.message}</p>
      </div>
      <div>
        <input
          className="input-outline w-full"
          type="password"
          placeholder="Password"
          {...register("password", {
            required: {
              value: true,
              message: "Your password is required",
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
          "Sign In"
        )}
      </button>

      <span className="underline-anchor mt-3" onClick={() => setView("signUp")}>
        Haven't got an account? Sign Up
      </span>
    </form>
  );
}
