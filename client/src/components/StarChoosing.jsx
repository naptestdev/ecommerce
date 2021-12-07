import { useState } from "react";
export default function StarChoosing({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="inline" onMouseLeave={() => setHover(0)}>
      {[...new Array(max)].map((_, index) => (
        <span
          onClick={() => onChange(index + 1)}
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
