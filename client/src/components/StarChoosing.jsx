import { useState } from "react";
export default function StarChoosing({ value, onChange, max = 5, ...others }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="inline" onMouseLeave={() => setHover(0)} {...others}>
      {[...new Array(max)].map((_, index) => (
        <span
          key={index}
          onClick={() => {
            value === index + 1 ? onChange(0) : onChange(index + 1);
          }}
          onMouseEnter={() => setHover(index + 1)}
          style={{ cursor: "pointer" }}
          className={
            hover
              ? index < hover
                ? "text-orange"
                : "text-gray-500"
              : index < value
              ? "text-orange"
              : "text-gray-500"
          }
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}
