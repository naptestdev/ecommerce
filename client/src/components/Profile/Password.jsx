export default function Password() {
  return (
    <div>
      <h2 className="text-2xl mt-3">Password</h2>

      <div className="flex items-center">
        <div className="w-[150px] text-gray-500 flex-shrink-0">
          Previous password
        </div>
        <div className="flex-grow">
          <input
            className="outline-none border px-3 py-1 focus:border-gray-500 transition w-full my-1"
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-[150px] text-gray-500 flex-shrink-0">
          New password
        </div>
        <div className="flex-grow">
          <input
            className="outline-none border px-3 py-1 focus:border-gray-500 transition w-full my-1"
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-[150px] text-gray-500 flex-shrink-0">Confirm</div>
        <div className="flex-grow">
          <input
            className="outline-none border px-3 py-1 focus:border-gray-500 transition w-full my-1"
            type="text"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="outline-none border-none py-2 px-3 bg-primary hover:bg-secondary transition text-white my-3 rounded">
          Change password
        </button>
      </div>
    </div>
  );
}
