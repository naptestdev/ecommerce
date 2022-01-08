import { Link, useLocation } from "react-router-dom";

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

export default function SideBar() {
  const location = useLocation();

  return (
    <div className="border-r border-[#EEE] bg-[#191A1F] text-white min-h-screen w-[256px] p-5">
      <div className="flex items-center gap-2">
        <img className="w-8 h-8" src="/logo.png" alt="" />
        <h1 className="text-[#1D90FF] text-2xl">Admin</h1>
      </div>

      <div className="flex flex-col items-stretch mt-6">
        {items.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className={`flex items-center gap-2 p-2 hover:brightness-[80%] transition ${
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
  );
}
