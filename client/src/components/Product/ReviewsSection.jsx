import ReviewsModal from "./ReviewsModal";
import StarRatings from "../StarRatings";
import { getReviews } from "../../services/api/reviews";
import useSWR from "swr";
import { useState } from "react";
import { useStore } from "../../store";

export default function ReviewsSection({ productId }) {
  const { data, error, mutate } = useSWR(`reviews-${productId}`, () =>
    getReviews(productId)
  );

  const [reviewModelOpened, setReviewModelOpened] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  if (error || !data) return <></>;
  return (
    <>
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
          {data.some((item) => item?.user?._id === currentUser._id)
            ? "Edit"
            : "Write"}{" "}
          your review
        </p>
      </div>
      <div>
        {data.map((item) => (
          <div key={item.user?._id} className="flex gap-3 my-3 py-3 border-t">
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
        productId={productId}
        isOpened={reviewModelOpened}
        setIsOpened={setReviewModelOpened}
        refetch={mutate}
        defaultInputValue={data.find((item) => item?.user?._id)?.comment || ""}
        defaultStarCount={data.find((item) => item?.user?._id)?.ratings || 0}
      />
    </>
  );
}
