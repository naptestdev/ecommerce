import StarRatings from "./StarRatings";
import { resizeImage } from "../services/image";

export default function ProductCard({ image, name, price, ratings }) {
  return (
    <div className="relative shadow border border-transparent hover:translate-y-[-2px] hover:border-primary transition duration-300 cursor-pointer">
      <div
        className="w-full h-0 relative overflow-hidden"
        style={{ paddingBottom: "100%" }}
      >
        <img
          className="absolute top-0 left-0 w-full h-full"
          src={resizeImage(image, 300, 300)}
          alt=""
        />
      </div>
      <div className="p-2 flex flex-col justify-between">
        <p className="whitespace-nowrap overflow-ellipsis overflow-hidden">
          {name}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-primary text-xl">${price}</p>
          <p>
            <StarRatings value={ratings} max={5} />
          </p>
        </div>
      </div>
    </div>
  );
}
