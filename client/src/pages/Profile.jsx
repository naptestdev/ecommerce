import Address from "../components/Profile/Address";
import Info from "../components/Profile/Info";
import Password from "../components/Profile/Password";
import Spin from "react-cssfx-loading/lib/Spin";
import { useStore } from "../store";

export default function Profile() {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div>
          <Spin width="40px" height="40px" color="#2874F0" />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="bg-white w-full max-w-[900px] my-10 px-8 py-14 flex gap-5">
        <div className="flex-grow max-w-[400px] mx-16">
          <h1 className="text-4xl mb-3">My profile</h1>

          <Info />
          <Address />
          <Password />
        </div>
        <div className="px-16 py-4 flex flex-grow flex-col items-center justify-start gap-6 flex-shrink-0">
          <img
            className="w-36 h-w-36 rounded-full"
            src={`https://avatars.dicebear.com/api/initials/${currentUser.username}.svg`}
            alt=""
          />
          <button>Change picture</button>
        </div>
      </div>
    </div>
  );
}
