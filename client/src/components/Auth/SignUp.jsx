import ReactLoading from "react-loading";
import axios from "../../services/axios";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignUp({ setView }) {
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

    setLoading(true);

    axios
      .post("auth/sign-up", {
        email,
        password,
        username,
      })
      .then((res) => {
        console.log(res.data);
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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col justify-start items-stretch gap-1 px-5 py-10 w-full h-full"
    >
      <h1 className="text-center text-2xl mb-4">Sign Up</h1>
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
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
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
              message: "Your password is required",
            },
            minLength: {
              value: 6,
              message: "Password must be more than 6 characters",
            },
            maxLength: {
              value: 18,
              message: "Password mustn't be more than 18 characters",
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
              value === watch("password") || "Password must match",
          })}
        />
        <p className="input-error">
          {errors.confirmPassword && errors.confirmPassword.message}
        </p>
      </div>
      <button className="w-full h-12 flex justify-center items-center bg-primary text-white hover:bg-secondary transition">
        {loading ? (
          <ReactLoading type="spin" color="#FFFFFF" height={30} width={30} />
        ) : (
          "Sign Up"
        )}
      </button>

      <span className="underline-anchor mt-3" onClick={() => setView("signIn")}>
        Already have an account? Sign In
      </span>
    </form>
  );
}
