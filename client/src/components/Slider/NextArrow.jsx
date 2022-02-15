export default function NextArrow({ onClick }) {
  return (
    <button
      className="absolute border-none outline-none right-0 w-6 h-10 md:w-8 md:h-14 bg-[#0000005b] top-1/2 -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <i className="fas fa-chevron-right text-white text-xl md:text-3xl"></i>
    </button>
  );
}
