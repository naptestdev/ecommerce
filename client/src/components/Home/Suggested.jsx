import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { getSuggested } from "../../services/homePageAPI";
import { useQuery } from "react-query";

export default function Suggested() {
  const { isLoading, data: suggested } = useQuery(
    "home-suggested",
    getSuggested
  );

  return (
    <div className="mx-[4vw]">
      <h1 className="text-2xl my-3">Suggested for you</h1>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gridAutoRows: "1fr",
        }}
      >
        {isLoading ? (
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
              <Link key={item._id} to={`product/${item._id}`}>
                <ProductCard
                  image={item.image[0]}
                  name={item.name}
                  price={item.price}
                  ratings={item.ratings}
                />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
