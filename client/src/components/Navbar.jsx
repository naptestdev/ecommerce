import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthModal from "./Auth/AuthModal";
import ClickAwayListener from "react-click-away-listener";
import { useLocation } from "react-router-dom";
import { useStore } from "../store";

export default function Navbar() {
  const [view, setView] = useState("signIn");
  const [isOpened, setIsOpened] = useState(false);

  const [dropdownActive, setDropdownActive] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    setIsSidebarActive(false);
    setDropdownActive(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <div className="bg-primary text-gray-200 flex items-center gap-4 h-16 px-[4vw] z-40">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-end gap-2">
            <i className="fas fa-shopping-bag text-3xl"></i>
            <p className="text-2xl">eCommerce</p>
          </Link>
        </div>
        <div className="flex-1 hidden md:flex justify-center">
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
        <div className="flex-1 hidden md:flex justify-end">
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

        <div className="flex-1 flex md:hidden justify-end">
          <button onClick={() => setIsSidebarActive(true)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <div
        onClick={() => setIsSidebarActive(false)}
        className={`fixed top-0 left-0 w-full h-full bg-[#00000080] z-[999] transition-all duration-500 ${
          isSidebarActive ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      <div
        className={`fixed top-0 h-screen left-0 z-[1000] bg-white p-6 flex flex-col items-stretch gap-3 transition-all duration-500 ${
          isSidebarActive
            ? "visible translate-x-0"
            : "invisible -translate-x-full"
        }`}
      >
        <div>
          <Link to="/" className="flex items-end gap-2 text-primary">
            <i className="fas fa-shopping-bag text-3xl"></i>
            <p className="text-2xl">eCommerce</p>
          </Link>
        </div>
        <form
          onSubmit={handleSearchFormSubmit}
          className="w-full max-w-xl h-10 relative"
        >
          <input
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            className="outline-none w-full h-full pl-4 pr-9 text-black border focus:border-gray-500 transition"
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

        <div className="flex flex-col items-stretch gap-2">
          {currentUser === null ? (
            <>
              <div>
                <button
                  onClick={() => {
                    setView("signIn");
                    setIsOpened(true);
                    setIsSidebarActive(false);
                  }}
                >
                  <i className="fas fa-sign-in-alt text-xl"></i>
                  <span> Sign In</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setView("signUp");
                    setIsOpened(true);
                    setIsSidebarActive(false);
                  }}
                >
                  <i className="fas fa-user-plus text-xl"></i>
                  <span> Sign Up</span>
                </button>
              </div>
            </>
          ) : typeof currentUser === "undefined" ? (
            <></>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <img
                  className="w-7 h-7 rounded-full"
                  src={`https://avatars.dicebear.com/api/initials/${currentUser.username}.svg`}
                  alt=""
                />
                <p>{currentUser.username}</p>
              </div>

              <div>
                <Link to="/profile">
                  <i className="fas fa-user text-2xl"></i>
                  <span className="whitespace-nowrap"> Profile</span>
                </Link>
              </div>

              <div>
                <Link to="/orders">
                  <i className="fas fa-clipboard-list text-2xl"></i>
                  <span className="whitespace-nowrap"> Orders</span>
                </Link>
              </div>

              <div>
                <button onClick={handleSignOut}>
                  <i className="fas fa-sign-out-alt text-xl"></i>
                  <span className="whitespace-nowrap"> Sign Out</span>
                </button>
              </div>
              <div>
                <Link to="/cart">
                  <i className="fas fa-shopping-cart text-xl"></i>
                  <span> Cart</span>
                </Link>
              </div>
            </>
          )}
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
