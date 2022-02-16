import Spin from "react-cssfx-loading/lib/Spin";
import { forgotPassword } from "../../services/profile";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ForgotPassword({
  setView,
  setAlertText,
  setIsAlertOpened,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (values) => {
    setLoading(true);

    forgotPassword(values.email)
      .then((res) => {
        console.log(res);
        setAlertText("Email khôi phục đã được gửi đi");
        setIsAlertOpened(true);
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          setError("email", { message: err.response.data.message });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col justify-start items-stretch gap-1 px-5 py-10 w-full h-full"
    >
      <h1 className="text-center text-2xl mb-4">Quên mật khẩu</h1>
      <div>
        <input
          className="input-outline w-full"
          type="email"
          placeholder="Email"
          {...register("email", {
            pattern: {
              value:
                /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm,
              message: "Hãy nhập email đúng",
            },
            required: {
              value: true,
              message: "Hãy nhập email của bạn",
            },
          })}
        />
        <p className="input-error">{errors.email && errors.email.message}</p>
      </div>
      <button className="w-full h-12 flex justify-center items-center bg-primary text-white hover:bg-secondary transition">
        {loading ? (
          <Spin color="#FFFFFF" height="30px" width="30px" />
        ) : (
          "Đặt lại mật khẩu"
        )}
      </button>

      <span className="underline-anchor mt-4" onClick={() => setView("signIn")}>
        Quay lại đăng nhập
      </span>
    </form>
  );
}
