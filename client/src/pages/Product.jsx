import { Link, useParams } from "react-router-dom";

import ReactLoading from "react-loading";
import Slider from "react-slick";
import StarRatings from "../components/StarRatings";
import { getProductDetail } from "../services/api/product";
import { useQuery } from "react-query";

export default function Product() {
  const { id } = useParams();
  const {
    isLoading,
    isError,
    data: product,
  } = useQuery(`product-${id}`, () => getProductDetail(id));

  if (isLoading || isError)
    return (
      <div className="flex-grow flex justify-center items-center bg-[#F5F5F5]">
        <ReactLoading type="spin" color="#2874F0" width={40} height={40} />
      </div>
    );

  return (
    <div className="bg-gray-100 flex-grow flex flex-col items-stretch px-[8vw]">
      <div className="flex gap-2 items-center text-sm my-4 flex-wrap">
        <Link
          className="hover:text-primary transition whitespace-nowrap"
          to="/"
        >
          Home
        </Link>
        <i className="fa fa-chevron-right text-xs"></i>
        <Link
          className="hover:text-primary transition whitespace-nowrap"
          to={`/search?category=${product.categoryId}`}
        >
          {product.category}
        </Link>
        <i className="fa fa-chevron-right text-xs"></i>
        <span className="hover:text-primary transition cursor-pointer whitespace-nowrap">
          {product.name}
        </span>
      </div>

      <div className="flex bg-white p-4">
        <div className="w-[35%]">
          <Slider
            infinite
            speed={500}
            autoplay
            autoplaySpeed={4000}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
          >
            {product.image.map((image) => (
              <img key={image} src={image} alt="" />
            ))}
          </Slider>
        </div>
        <div className="w-[65%] pl-6 flex flex-col items-stretch gap-3">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1">
              <p className="text-lg text-orange">{product.ratings}</p>
              <p>
                <StarRatings value={product.ratings} max={5} />
              </p>
            </div>

            <div className="h-full w-[2px] bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <p className="text-lg">10</p>
              <p className="text-gray-500">Ratings</p>
            </div>

            <div className="h-full w-[2px] bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <p className="text-lg">20</p>
              <p className="text-gray-500">Sold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
