import ReviewsModal from "./ReviewsModal";
import StarRatings from "../StarRatings";
import { getReviews } from "../../services/api/reviews";
import useSWR from "swr";
import { useState } from "react";
import { useStore } from "../../store";

export default function ReviewsSection({ product, refetchProduct }) {
  const { data, error, mutate } = useSWR(`reviews-${product._id}`, () =>
    getReviews(product._id)
  );

  const [reviewModelOpened, setReviewModelOpened] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  const [filterReviews, setFilterReviews] = useState(0);

  const handleFilterReviews = (reviews) => {
    if (filterReviews === 0) return reviews;
    if (filterReviews === 6) return reviews.filter((review) => review.comment);
    return reviews.filter((review) => review.ratings === filterReviews);
  };

  return (
    <>
      <div className="bg-white mt-8 p-4 pb-2">
        <h1 className="text-3xl mb-6">Reviews & Ratings</h1>

        <div className="bg-[#f4f8fe] flex px-10 py-6 border border-[#dfeafd] gap-8 flex-col md:flex-row">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl">
              <span className="text-4xl">{product.ratings}</span> on 5
            </h1>
            <div className="text-2xl">
              <StarRatings value={product.ratings} max={5} />
            </div>
          </div>
          <div className="flex items-center justify-start flex-wrap gap-2">
            <button
              onClick={() => setFilterReviews(0)}
              className={`py-1 px-3 bg-white border border-gray-300 cursor-pointer hover:border-gray-500 transition ${
                filterReviews === 0
                  ? "border-blue-400 hover:border-blue-600"
                  : ""
              }`}
            >
              All reviews & ratings
            </button>
            {[...new Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() => setFilterReviews(index + 1)}
                className={`py-1 px-3 bg-white border border-gray-300 cursor-pointer hover:border-gray-500 transition ${
                  filterReviews === index + 1
                    ? "border-blue-400 hover:border-blue-600"
                    : ""
                }`}
              >
                {index + 1}
                {index === 0 ? " star" : " stars"}
              </button>
            ))}
            <button
              onClick={() => setFilterReviews(6)}
              className={`py-1 px-3 bg-white border border-gray-300 cursor-pointer hover:border-gray-500 transition ${
                filterReviews === 6
                  ? "border-blue-400 hover:border-blue-600"
                  : ""
              }`}
            >
              Has review comment
            </button>
          </div>
        </div>
        <div
          onClick={() => setReviewModelOpened(true)}
          className="mt-5 flex items-center gap-3 cursor-pointer"
        >
          <img
            className="w-10 h-10 rounded-full"
            src={`https://avatars.dicebear.com/api/initials/${currentUser.username}.svg`}
            alt=""
          />

          <p className="w-full max-w-lg border-dashed border-b border-gray-600">
            {data?.some((item) => item?.user?._id === currentUser._id)
              ? "Edit"
              : "Write"}{" "}
            your review
          </p>
        </div>
        {!error && data && (
          <>
            <div>
              {handleFilterReviews(data).map((item) => (
                <div
                  key={item.user?._id}
                  className="flex gap-3 my-3 pt-3 border-t"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`https://avatars.dicebear.com/api/initials/${item.user?.username}.svg`}
                    alt=""
                  />

                  <div>
                    <p className="font-semibold">{item.user?.username}</p>

                    <StarRatings value={item.ratings} max={5} />

                    {item.comment && <p className="mt-1">{item.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
            <ReviewsModal
              product={product}
              isOpened={reviewModelOpened}
              setIsOpened={setReviewModelOpened}
              refetch={() => {
                mutate();
                refetchProduct();
              }}
              defaultInputValue={
                data.find((item) => item?.user?._id === currentUser._id)
                  ?.comment || ""
              }
              defaultStarCount={
                data.find((item) => item?.user?._id === currentUser._id)
                  ?.ratings || 0
              }
            />
          </>
        )}
      </div>
    </>
  );
}
