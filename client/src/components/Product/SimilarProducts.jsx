import ProductCard from "../ProductCard";
import { getSimilarProducts } from "../../services/api/product";
import useSWR from "swr";

export default function SimilarProducts({ productId }) {
  const { data, error } = useSWR(`similar-products-${productId}`, () =>
    getSimilarProducts(productId)
  );

  return (
    <div className="bg-white my-8 p-4">
      <h1 className="text-3xl mb-3">Similar products</h1>
      <div
        className="grid gap-4 grid-cols-card"
        style={{
          gridAutoRows: "1fr",
        }}
      >
        {!data || error ? (
          <>
            {[...new Array(10)].map((_, index) => (
              <div
                key={index}
                className="relative h-0"
                style={{ paddingBottom: "130%" }}
              >
                <div className="absolute w-full h-full rounded bg-gray-300 animate-pulse"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {data.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
