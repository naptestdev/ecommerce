import { Link } from "react-router-dom";
import StarRatings from "./StarRatings";
import { resizeImage } from "../services/image";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="relative shadow border border-transparent hover:translate-y-[-2px] hover:border-primary transition duration-300 cursor-pointer">
        <div
          className="w-full h-0 relative overflow-hidden"
          style={{ paddingBottom: "100%" }}
        >
          <img
            className="absolute top-0 left-0 w-full h-full object-contain"
            src={resizeImage(product.images[0], 300, 300)}
            alt=""
          />
        </div>
        <div className="p-2 flex flex-col justify-between">
          <p className="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {product.name}
          </p>
          <div className="flex justify-between items-center mt-4">
            <p className="text-primary text-xl">
              ${Math.round((product.price - product.discount) * 10) / 10}
            </p>
            <p>
              <StarRatings value={product.ratings} max={5} />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
