export default function NextArrow({ onClick }) {
  return (
    <button
      className="absolute border-none outline-none right-0 w-10 h-14 bg-[#0000005b] top-1/2 -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <i className="fas fa-chevron-right text-white text-3xl"></i>
    </button>
  );
}
