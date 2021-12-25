import ProductCard from "../components/ProductCard";
import Spin from "react-cssfx-loading/lib/Spin";
import { getCategory } from "../services/api/product";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export default function Category() {
  const { id } = useParams();

  const { data, error } = useSWR(
    location.pathname,

    () => getCategory(id)
  );

  return (
    <>
      {!data || error ? (
        <div className="flex-grow flex justify-center items-center">
          <Spin color="#2874F0" height="30px" width="30px" />
        </div>
      ) : (
        <div className="px-[4vw] min-h-screen">
          <h1 className="text-3xl my-4">Category {id}</h1>

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
