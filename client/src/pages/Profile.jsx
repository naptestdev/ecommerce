import Address from "../components/Profile/Address";
import Alert from "../components/Alert";
import Info from "../components/Profile/Info";
import Password from "../components/Profile/Password";
import Spin from "react-cssfx-loading/lib/Spin";
import { useState } from "react";
import { useStore } from "../store";

export default function Profile() {
  const currentUser = useStore((state) => state.currentUser);
  const [alertText, setAlertText] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  if (!currentUser)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div>
          <Spin width="40px" height="40px" color="#2874F0" />
        </div>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-bg flex justify-center">
        <div className="bg-white w-full max-w-[900px] md:my-10 px-8 py-14 flex gap-5 flex-col-reverse md:flex-row">
          <div className="md:flex-grow md:max-w-[400px] md:mx-16">
            <h1 className="text-4xl mb-3">My profile</h1>

            <Info
              setAlertText={setAlertText}
              setIsAlertOpened={setIsAlertOpened}
            />
            <Address
              setAlertText={setAlertText}
              setIsAlertOpened={setIsAlertOpened}
            />
            <Password
              setAlertText={setAlertText}
              setIsAlertOpened={setIsAlertOpened}
            />
          </div>
          <div className="px-16 py-4 flex flex-col items-center justify-start gap-6 flex-shrink-0">
            <img
              className="w-36 h-w-36 rounded-full"
              src={`https://avatars.dicebear.com/api/initials/${currentUser?.username}.svg`}
              alt=""
            />
          </div>
        </div>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={alertText}
      />
    </>
  );
}
