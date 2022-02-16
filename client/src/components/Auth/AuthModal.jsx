import Alert from "../Alert";
import ForgotPassword from "./ForgotPassword";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useState } from "react";

export default function AuthModal({ isOpened, setIsOpened, view, setView }) {
  const [alertText, setAlertText] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  if (!isOpened) return <></>;
  return (
    <>
      <div
        onClick={() => setIsOpened(false)}
        className={`fixed top-0 left-0 w-screen h-screen bg-[#00000080] flex justify-center items-center transition z-[100]`}
      >
        <div className="md:h-[480px] flex" onClick={(e) => e.stopPropagation()}>
          <div className="w-64 h-full bg-primary text-gray-200 hidden md:flex flex-col justify-between items-center px-6 py-10">
            <div>
              <p className="text-xl">
                {view === "signIn"
                  ? "Đăng nhập vào tài khoản của bạn để bắt đầu mua hàng"
                  : view === "signUp"
                  ? "Hãy đăng ký tài khoản của bạn"
                  : "Chúng tôi sẽ gửi email để giúp bạn khôi phục mật khẩu"}
              </p>
            </div>
            <img
              className="w-36 h-w-36"
              src="/shopping-illustration.png"
              alt=""
            />
          </div>
          <div className="w-screen max-w-xs md:w-[370px] md:max-w-none h-full bg-white">
            {view === "signIn" ? (
              <SignIn setView={setView} setIsOpened={setIsOpened} />
            ) : view === "signUp" ? (
              <SignUp
                setView={setView}
                setAlertText={setAlertText}
                setIsAlertOpened={setIsAlertOpened}
              />
            ) : (
              <ForgotPassword
                setView={setView}
                setAlertText={setAlertText}
                setIsAlertOpened={setIsAlertOpened}
              />
            )}
          </div>
        </div>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={alertText}
        duration={6000}
      />
    </>
  );
}
