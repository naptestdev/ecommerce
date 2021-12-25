import { useStore } from "../../store";

export default function Info() {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div>
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
            value={currentUser.username}
          />
        </div>
      </div>
      <div className="flex w-full justify-end">
        <button className="outline-none border-none py-2 px-3 bg-primary hover:bg-secondary transition text-white my-3 rounded">
          Update Info
        </button>
      </div>
    </div>
  );
}
