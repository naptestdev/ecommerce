import axios from "../services/axios";

export default function ExportDropdown({ type }) {
  const handleExport = async (isExcel) => {
    const baseUrl = (await axios.get("export/base-url")).data;

    window.open(
      `${baseUrl}/${type}?token=${localStorage.getItem("admin-token")}${
        isExcel ? "&excel=1" : ""
      }`
    );
  };

  return (
    <div className="relative group">
      <button className="bg-primary text-white py-1 px-3 rounded hover:brightness-[115%] transition duration-300">
        Export
      </button>

      <div
        tabIndex={0}
        className="absolute top-full right-0 flex flex-col items-stretch w-max shadow-md rounded-md overflow-hidden transition-all duration-300 opacity-0 invisible group-focus-within:visible group-focus-within:opacity-100"
      >
        <button
          onClick={() => handleExport(false)}
          className="text-left bg-white py-2 px-2 hover:brightness-90 transition duration-300"
        >
          Download CSV
        </button>
        <button
          onClick={() => handleExport(true)}
          className="text-left bg-white py-2 px-2 hover:brightness-90 transition duration-300"
        >
          Download XLSX (Excel)
        </button>
      </div>
    </div>
  );
}
