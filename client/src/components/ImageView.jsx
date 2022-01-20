export default function ImageView({ isOpened, setIsOpened, src }) {
  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 w-screen h-screen bg-[#00000080] flex justify-center items-center transition-all z-[9999] duration-500 ${
        isOpened ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {src && (
        <img
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full w-auto h-auto"
          src={src}
          alt=""
        />
      )}
    </div>
  );
}
