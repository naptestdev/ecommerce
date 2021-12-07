import ReactLoading from "react-loading";
import StarChoosing from "../StarChoosing";
import { createReview } from "../../services/api/reviews";
import { useState } from "react";

export default function ReviewsModal({ product, isOpened, setIsOpened }) {
  const [starCount, setStarCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (starCount && inputValue.trim()) {
      setIsLoading(true);

      createReview(product._id, starCount, inputValue).then(() =>
        setIsOpened(false)
      );
    }
  };

  if (!isOpened) return <></>;

  return (
    <div
      onClick={() => setIsOpened(false)}
      className="fixed top-0 left-0 z-50 w-screen h-screen bg-[#00000080] flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-5 w-full max-w-md flex flex-col items-stretch gap-3"
      >
        <h1 className="text-xl">Write a review</h1>

        <div className="text-2xl">
          <StarChoosing value={starCount} onChange={setStarCount} />
        </div>

        <textarea
          className="resize-none border outline-none border-gray-400 focus:border-gray-600 transition p-3 h-40"
          placeholder="Your comment..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></textarea>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="outline-none w-44 flex justify-center py-2 bg-black text-white transition hover:bg-gray-700"
          >
            {isLoading ? (
              <ReactLoading
                type="spin"
                color="#FFFFFF"
                height={25}
                width={25}
              />
            ) : (
              <>Submit your review</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
