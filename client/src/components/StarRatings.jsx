export default function StarRatings({ value, max }) {
  return (
    <>
      {[...new Array(max)].map((_, index) => (
        <span
          key={index}
          className={`${index < value ? "text-orange" : "text-gray-400"}`}
        >
          &#9733;
        </span>
      ))}
    </>
  );
}
