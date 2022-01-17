import { Link, useLocation } from "react-router-dom";

import { useEffect } from "react";

const items = [
  {
    name: "Home",
    icon: "fas fa-home",
    link: "/",
  },
  {
    name: "Users",
    icon: "fas fa-users",
    link: "/users",
  },
  {
    name: "Products",
    icon: "fas fa-archive",
    link: "/products",
  },
  {
    name: "Orders",
    icon: "fas fa-shopping-cart",
    link: "/orders",
  },
  {
    name: "Banners",
    icon: "fas fa-image",
    link: "/banners",
  },
];

export default function SideBar({ isSidebarOpened, setIsSidebarOpened }) {
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpened(false);
  }, [location.pathname]);

  return (
    <>
      <div
        className={`bg-[#191A1F] text-white h-screen w-[256px] p-6 lg:!sticky top-0 overflow-x-hidden overflow-y-auto flex-shrink-0 fixed z-[1000] transition-all duration-500 right-full lg:!right-auto lg:!translate-x-0 ${
          isSidebarOpened ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <img className="w-8 h-8" src="/logo.png" alt="" />
          <h1 className="text-[#1D90FF] text-2xl">Admin</h1>
        </Link>

        <div className="flex flex-col items-stretch mt-6 gap-4">
          {items.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`flex items-center gap-2 hover:brightness-[80%] transition ${
                location.pathname === item.link ? "text-primary" : ""
              }`}
            >
              <span className="w-6">
                <i className={`text-xl ${item.icon}`}></i>
              </span>

              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div
        onClick={() => setIsSidebarOpened(false)}
        className={`fixed top-0 left-0 w-full h-full bg-[#00000080] z-[999] transition-all duration-500 lg:invisible ${
          isSidebarOpened ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>
    </>
  );
}
