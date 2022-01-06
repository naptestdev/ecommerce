import SideBar from "./SideBar";
import { avatarAPI } from "../shared/constant";
import { useStore } from "../store";

export default function Layout({ children }) {
  const currentUser = useStore((state) => state.currentUser);
  return (
    <div className="flex">
      <SideBar />

      <div className="flex-grow flex flex-col items-stretch">
        <div className="flex justify-end items-center h-14 shadow bg-white">
          <div className="flex items-center gap-1 px-6">
            <img
              className="w-8 h-8 rounded-full"
              src={avatarAPI(currentUser.username)}
              alt=""
            />

            <p>{currentUser.username}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
