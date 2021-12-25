import ProductCard from "../components/ProductCard";
import Spin from "react-cssfx-loading/lib/Spin";
import { searchProduct } from "../services/api/product";
import { useLocation } from "react-router-dom";
import { useQueryParams } from "../hooks/useQueryParams";
import useSWR from "swr";

export default function Search() {
  const location = useLocation();
  const query = useQueryParams();

  const q = query.get("q");
  const category = query.get("category");
  const minPrice = query.get("minPrice");
  const maxPrice = query.get("maxPrice");
  const minRatings = query.get("minRatings");

  const { data, error } = useSWR(
    location.pathname + location.search,

    () => searchProduct(q, category, minPrice, maxPrice, minRatings)
  );

  return (
    <>
      {!data || error ? (
        <div className="min-h-screen flex justify-center items-center">
          <Spin color="#2874F0" height="30px" width="30px" />
        </div>
      ) : (
        <div className="px-[4vw] min-h-screen">
          <h1 className="text-3xl my-4">Search result for "{q}"</h1>

          {data.length === 0 ? (
            <p>No result found</p>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gridAutoRows: "1fr",
              }}
            >
              {data.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
