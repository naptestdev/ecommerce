import Spin from "react-cssfx-loading/lib/Spin";
import { updateUsername } from "../../services/api/profile";
import { useState } from "react";
import { useStore } from "../../store";

export default function Info() {
  const currentUser = useStore((state) => state.currentUser);
  const verifyUser = useStore((state) => state.verifyUser);

  const [inputValue, setInputValue] = useState(currentUser.username);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!loading && validateInput(inputValue)) {
      setLoading(true);

      updateUsername(inputValue.trim()).finally(() => {
        setLoading(false);
        verifyUser();
      });
    }
  };

  const validateInput = (value) =>
    value !== currentUser.username && value.trim() !== "";

  return (
    <form onSubmit={handleFormSubmit}>
      <h2 className="text-2xl mb-2">Info</h2>
      <div className="flex items-center">
        <div className="w-[150px] text-gray-500 flex-shrink-0">Email</div>
        <div className="flex-grow">
          <p>{currentUser.email}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-[150px] text-gray-500 flex-shrink-0">Username</div>
        <div className="flex-grow">
          <input
            className="outline-none border px-3 py-1 focus:border-gray-500 transition w-full mt-2"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex w-full justify-end">
        <button
          disabled={loading || !validateInput(inputValue)}
          className={`btn ${loading ? "!px-10" : ""}`}
        >
          {loading ? (
            <Spin color="#ffffff" height="25px" width="25px" />
          ) : (
            <>Update Info</>
          )}
        </button>
      </div>
    </form>
  );
}
