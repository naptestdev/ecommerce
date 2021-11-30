import { Link, useNavigate } from "react-router-dom";

import AuthModal from "./Auth/AuthModal";
import { useState } from "react";
import { useStore } from "../store";

export default function Navbar() {
  const [view, setView] = useState("signIn");
  const [isOpened, setIsOpened] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  const navigate = useNavigate();

  const [searchInputValue, setSearchInputValue] = useState("");
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();

    if (searchInputValue.trim()) {
      setSearchInputValue("");
      navigate(`/search?q=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  return (
    <>
      <div className="sticky top-0 bg-primary text-gray-200 flex items-center gap-4 h-16 px-[4vw] z-40">
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
                <div className="flex items-center gap-1 cursor-pointer">
                  <img
                    className="w-7 h-7 rounded-full"
                    src={`https://avatars.dicebear.com/api/initials/${currentUser.username}.svg`}
                    alt=""
                  />
                  <p>{currentUser.username}</p>
                </div>
                <Link to="cart">
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
