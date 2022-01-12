import Spin from "react-cssfx-loading/lib/Spin";
import { updateAddress } from "../../services/api/profile";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStore } from "../../store";

export default function Address({ setAlertText, setIsAlertOpened }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  const fields = {
    fullName: { name: "Full Name" },
    phoneNumber: { name: "Phone Number", number: true },
    city: { name: "City" },
    district: { name: "District" },
    exactAddress: { name: "Exact Address" },
  };

  const handleFormSubmit = (data) => {
    if (!loading) {
      setLoading(true);

      updateAddress(data)
        .then(() => {
          setAlertText("Address updated successfully!");
          setIsAlertOpened(true);
        })
        .catch((err) => {
          console.log(err);

          setAlertText("Failed to update address");
          setIsAlertOpened(true);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className="text-2xl mt-3">Address</h2>

      {Object.entries(fields).map(([key, value]) => (
        <div className="flex items-center" key={key}>
          <div className="w-[150px] text-gray-500 flex-shrink-0">
            {value.name}
          </div>
          <div className="flex-grow">
            <input
              {...register(key, {
                required: true,
                valueAsNumber: value.number,
                value: currentUser?.address?.[key] || "",
              })}
              className={`outline-none border px-3 py-1 focus:border-gray-500 transition w-full my-1 ${
                errors[key] ? "border-red-300 focus:border-red-400" : ""
              }`}
              type="text"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          disabled={loading || Object.keys(errors).length > 0}
          className={`btn ${loading ? "!px-6" : ""}`}
        >
          {loading ? (
            <Spin color="#ffffff" width="25px" height="25px" />
          ) : (
            <>Update address</>
          )}
        </button>
      </div>
    </form>
  );
}
