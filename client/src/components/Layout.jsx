import SideBar from "./SideBar";
import { avatarAPI } from "../shared/constant";
import { useState } from "react";
import { useStore } from "../store";

export default function Layout({ children }) {
  const currentUser = useStore((state) => state.currentUser);

  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  return (
    <div className="flex">
      <SideBar
        isSidebarOpened={isSidebarOpened}
        setIsSidebarOpened={setIsSidebarOpened}
      />

      <div className="flex-grow flex flex-col items-stretch">
        <div className="flex justify-between items-center h-14 shadow bg-white px-6">
          <div>
            <button
              onClick={() => setIsSidebarOpened(true)}
              className="block lg:hidden"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <div className="flex items-center gap-1">
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
