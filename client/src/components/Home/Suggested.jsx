import ProductCard from "../ProductCard";
import { getSuggested } from "../../services/api/homepage";
import useSWR from "swr";

export default function Suggested() {
  const { data: suggested, error } = useSWR("home-suggested", getSuggested);

  return (
    <div className="mx-[4vw]">
      <h1 className="text-2xl my-3">Suggested for you</h1>
      <div
        className="grid gap-4 grid-cols-md md:grid-cols-lg"
        style={{
          gridAutoRows: "1fr",
        }}
      >
        {!suggested || error ? (
          <>
            {[...new Array(30)].map((_, index) => (
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
            {suggested.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
