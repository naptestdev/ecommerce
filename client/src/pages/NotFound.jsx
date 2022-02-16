import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-6">
      <img src="/error.png" alt="" />
      <Link to="/" className="text-primary text-lg">
        Trở về trang chủ
      </Link>
    </div>
  );
}
