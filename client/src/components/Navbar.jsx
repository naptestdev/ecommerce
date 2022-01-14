import { Link, useNavigate } from "react-router-dom";

import AuthModal from "./Auth/AuthModal";
import ClickAwayListener from "react-click-away-listener";
import { useState } from "react";
import { useStore } from "../store";

export default function Navbar() {
  const [view, setView] = useState("signIn");
  const [isOpened, setIsOpened] = useState(false);

  const [dropdownActive, setDropdownActive] = useState(false);

  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const navigate = useNavigate();

  const [searchInputValue, setSearchInputValue] = useState("");
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();

    if (searchInputValue.trim()) {
      setSearchInputValue("");
      navigate(`/search?q=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <>
      <div className="bg-primary text-gray-200 flex items-center gap-4 h-16 px-[4vw] z-40">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-end gap-2">
            <i className="fas fa-shopping-bag text-3xl"></i>
            <p className="text-2xl">eCommerce</p>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <form
            onSubmit={handleSearchFormSubmit}
            className="w-full max-w-xl h-10 relative"
          >
            <input
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="outline-none w-full h-full pl-4 pr-9 text-black focus:shadow-md transition"
              type="text"
              placeholder="Search for products..."
            />
            <button
              type="submit"
              className="outline-none border-none bg-transparent absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
            >
              <i className="fas fa-search text-black text-lg"></i>
            </button>
          </form>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2">
            {currentUser === null ? (
              <>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setView("signIn");
                    setIsOpened(true);
                  }}
                >
                  Sign In
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setView("signUp");
                    setIsOpened(true);
                  }}
                >
                  Sign Up
                </span>
              </>
            ) : typeof currentUser === "undefined" ? (
              <></>
            ) : (
              <>
                <ClickAwayListener onClickAway={() => setDropdownActive(false)}>
                  <div
                    onClick={() => setDropdownActive(!dropdownActive)}
                    className="relative"
                  >
                    <div className="flex items-center gap-1 cursor-pointer">
                      <img
                        className="w-7 h-7 rounded-full"
                        src={`https://avatars.dicebear.com/api/initials/${currentUser.username}.svg`}
                        alt=""
                      />
                      <p>{currentUser.username}</p>
                    </div>

                    <div
                      style={{
                        transformOrigin: "top right",
                        width: "max-content",
                      }}
                      className={`absolute top-[150%] bg-white text-black shadow right-0 py-2 rounded overflow-hidden transition-all ${
                        dropdownActive
                          ? "opacity-100 scale-100 visible"
                          : "opacity-0 invisible scale-0"
                      }`}
                    >
                      <Link
                        to="/profile"
                        className="px-3 py-1 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i className="fas fa-user"></i>
                        <span className="whitespace-nowrap">Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="px-3 py-1 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i className="fas fa-clipboard-list"></i>
                        <span className="whitespace-nowrap">Orders</span>
                      </Link>

                      <div
                        onClick={handleSignOut}
                        className="px-3 py-1 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="whitespace-nowrap">Sign Out</span>
                      </div>
                    </div>
                  </div>
                </ClickAwayListener>
                <Link to="/cart">
                  <i className="fas fa-shopping-cart text-lg"></i>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        view={view}
        setView={setView}
      />
    </>
  );
}
