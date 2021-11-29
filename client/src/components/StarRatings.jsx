export default function StarRatings({ value, max }) {
  return (
    <>
      {[...new Array(max)].map((_, index) => (
        <span
          key={index}
          className={`${index < value ? "text-[#ffa500]" : "text-gray-400"}`}
        >
          &#9733;
        </span>
      ))}
    </>
  );
}
