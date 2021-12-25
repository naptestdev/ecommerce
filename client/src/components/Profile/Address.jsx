export default function Address() {
  const fields = {
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    city: "City",
    district: "District",
    exactAddress: "Exact Adrress",
  };

  return (
    <div>
      <h2 className="text-2xl mt-3">Address</h2>

      {Object.entries(fields).map(([key, value]) => (
        <div className="flex items-center">
          <div className="w-[150px] text-gray-500 flex-shrink-0">{value}</div>
          <div className="flex-grow">
            <input
              className="outline-none border px-3 py-1 focus:border-gray-500 transition w-full my-1"
              type="text"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button className="outline-none border-none py-2 px-3 bg-primary hover:bg-secondary transition text-white my-3 rounded">
          Update address
        </button>
      </div>
    </div>
  );
}
