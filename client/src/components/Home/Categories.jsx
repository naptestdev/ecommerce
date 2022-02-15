import { Link } from "react-router-dom";
import { getCategories } from "../../services/homepage";
import { resizeImage } from "../../shared/constant";
import useSWR from "swr";

export default function Categories() {
  const { data: categories, error } = useSWR("home-categories", getCategories);

  return (
    <div className="mx-[4vw]">
      <h1 className="text-2xl mb-3">Danh mục</h1>
      <div className="grid gap-4 grid-cols-sm md:grid-cols-md">
        {!categories || error ? (
          <>
            {[...new Array(11)].map((_, index) => (
              <div
                key={index}
                className="relative h-0"
                style={{ paddingBottom: "100%" }}
              >
                <div className="absolute w-full h-full rounded bg-gray-300 animate-pulse"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {categories.map((item) => (
              <Link
                to={`/search?category=${item._id}`}
                key={item._id}
                className="relative h-0"
                style={{ paddingBottom: "100%" }}
              >
                <div className="absolute w-full h-full rounded shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between items-center px-2 py-4">
                  <img
                    className="w-3/5 h-3/5 object-contain"
                    src={resizeImage(item.image, 150, 150)}
                    alt=""
                  />
                  <p className="text-center text-xs md:text-sm min-h-[40px]">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
