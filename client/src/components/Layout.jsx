import SideBar from "./SideBar";
import { avatarAPI } from "../shared/constant";
import { useState } from "react";
import { useStore } from "../store";

export default function Layout({ children }) {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("admin-token");
    setCurrentUser(null);
  };

  return (
    <div className="flex">
      <SideBar
        isSidebarOpened={isSidebarOpened}
        setIsSidebarOpened={setIsSidebarOpened}
      />

      <div className="flex-grow flex flex-col items-stretch min-h-screen">
        <div className="flex justify-between items-center h-14 shadow bg-white px-6">
          <div>
            <button
              onClick={() => setIsSidebarOpened(true)}
              className="block lg:hidden"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <div className="relative group cursor-pointer" tabIndex={0}>
            <div className="flex items-center gap-1">
              <img
                className="w-8 h-8 rounded-full"
                src={avatarAPI(currentUser.username)}
                alt=""
              />

              <p>{currentUser.username}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="absolute top-[115%] right-0 w-max bg-white hover:bg-gray-50 rounded-md border border-gray-200 shadow px-3 py-2 cursor-pointer opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="whitespace-nowrap"> Đăng xuất</span>
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
