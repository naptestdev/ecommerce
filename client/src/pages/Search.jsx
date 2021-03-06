import ProductCard from "../components/ProductCard";
import Spin from "react-cssfx-loading/lib/Spin";
import StarChoosing from "../components/StarChoosing";
import { getCategories } from "../services/homepage";
import { searchProduct } from "../services/product";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../hooks/useQueryParams";
import useSWR from "swr";
import { useState } from "react";

export default function Search() {
  const location = useLocation();
  const query = useQueryParams();

  const q = query.get("q");
  const category = query.get("category");
  const minPrice = query.get("minPrice");
  const maxPrice = query.get("maxPrice");
  const minRatings = query.get("minRatings");

  const navigate = useNavigate();

  const [categoryValue, setCategoryValue] = useState(category || "");
  const [minPriceValue, setMinPriceValue] = useState(Number(minPrice) || "");
  const [maxPriceValue, setMaxPriceValue] = useState(Number(maxPrice) || "");
  const [minRatingsValue, setMinRatingsValue] = useState(
    Number(minRatings) || 0
  );

  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const { data: categories, error: categoriesError } = useSWR(
    `home-categories`,
    () => getCategories()
  );

  const { data, error } = useSWR(
    location.pathname + location.search,

    () => searchProduct(q, category, minPrice, maxPrice, minRatings),
    {
      revalidateOnFocus: false,
    }
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const searchObj = Object.entries({
      q: q,
      category: categoryValue,
      minPrice: minPriceValue,
      maxPrice: maxPriceValue,
      minRatings: minRatingsValue,
    })
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    navigate({
      pathname: "/search",
      search: `?${Object.entries(searchObj)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")}`,
    });
  };

  return (
    <>
      {!data || !categories || error || categoriesError ? (
        <div className="min-h-screen flex justify-center items-center">
          <Spin color="#2874F0" height="30px" width="30px" />
        </div>
      ) : (
        <div className="px-[4vw] min-h-screen">
          <div className="flex justify-between my-4 flex-wrap">
            <h1 className="text-3xl">K???t qu??? t??m ki???m{q ? ` cho ${q}` : ""}</h1>

            <button
              onClick={() => setIsFilterOpened((prev) => !prev)}
              className="border border-gray-300 hover:border-gray-400 px-3 transition"
            >
              <i className="fas fa-list"></i>
              <span> B??? l???c</span>
            </button>
          </div>

          {isFilterOpened && (
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-wrap gap-5 my-5"
            >
              <div>
                <h1 className="font-semibold">Danh m???c</h1>
                <select
                  value={categoryValue}
                  onChange={(e) => setCategoryValue(e.target.value)}
                  className="outline-none p-2 border h-10"
                >
                  <option value="">T???t c???</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h1 className="font-semibold">Gi?? th???p nh???t</h1>
                <input
                  value={minPriceValue}
                  onChange={(e) => setMinPriceValue(Number(e.target.value))}
                  className="outline-none p-2 border h-10"
                  type="number"
                />
              </div>

              <div>
                <h1 className="font-semibold">Gi?? cao nh???t</h1>
                <input
                  value={maxPriceValue}
                  onChange={(e) => setMaxPriceValue(Number(e.target.value))}
                  className="outline-none p-2 border h-10"
                  type="number"
                />
              </div>

              <div>
                <h1 className="font-semibold">????nh gi?? th???p nh???t</h1>
                <StarChoosing
                  value={minRatingsValue}
                  onChange={setMinRatingsValue}
                  className="text-2xl"
                />
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  className="bg-primary text-white px-3 py-1 hover:brightness-110 transition"
                >
                  T??m
                </button>
              </div>
            </form>
          )}

          {data.length === 0 ? (
            <p>Kh??ng t??m ???????c k???t qu??? n??o</p>
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
