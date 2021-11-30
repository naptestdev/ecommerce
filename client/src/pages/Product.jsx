import { Link, useLocation, useParams } from "react-router-dom";

import ReactLoading from "react-loading";
import Slider from "react-slick";
import StarRatings from "../components/StarRatings";
import { getProductDetail } from "../services/api/product";
import { useQuery } from "react-query";

export default function Product() {
  const { id } = useParams();
  const location = useLocation();
  const {
    isLoading,
    isError,
    data: product,
  } = useQuery(location.pathname, () => getProductDetail(id));

  if (isLoading || isError)
    return (
      <div className="flex-grow flex justify-center items-center bg-[#F5F5F5]">
        <ReactLoading type="spin" color="#2874F0" width={40} height={40} />
      </div>
    );

  return (
    <div className="bg-gray-100 flex-grow flex flex-col items-stretch px-[6vw]">
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
          to={`/search?category=${product.category._id}`}
        >
          {product.category.name}
        </Link>
        <i className="fa fa-chevron-right text-xs"></i>
        <span className="hover:text-primary transition cursor-pointer whitespace-nowrap">
          {product.name}
        </span>
      </div>

      <div className="flex items-start bg-white p-4">
        <div className="w-[35%]">
          <Slider
            infinite
            speed={500}
            autoplay
            autoplaySpeed={4000}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {product.image.map((image) => (
              <img key={image} src={image} alt="" />
            ))}
          </Slider>
        </div>
        <div className="w-[65%] pl-6 flex flex-col items-stretch gap-3">
          <h1 className="text-2xl font-medium">{product.name}</h1>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1">
              <p className="text-lg text-orange">{product.ratings}</p>
              <p>
                <StarRatings value={product.ratings} max={5} />
              </p>
            </div>

            <div className="h-6 w-[2px] bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <p className="text-lg">10</p>
              <p className="text-gray-500">Ratings</p>
            </div>

            <div className="h-6 w-[2px] bg-gray-300"></div>

            <div className="flex items-center gap-1">
              <p className="text-lg">20</p>
              <p className="text-gray-500">Sold</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-2xl line-through text-gray-400">
              ${product.price}
            </p>
            <h1 className="text-5xl my-3 text-primary">
              ${Math.round((product.price - product.discount) * 10) / 10}
            </h1>
          </div>

          <div className="flex items-center">
            <p className="w-24">Colors</p>

            <div className="flex items-stretch gap-2">
              {product.color.map((color) => (
                <button
                  key={color}
                  className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-24">Quantity</div>
            <div className="flex items-stretch">
              <button className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8">
                -
              </button>

              <input
                className="h-8 w-10 outline-none text-center border border-gray-300"
                type="text"
                value={1}
                readOnly
              />
              <button className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8">
                +
              </button>
            </div>
          </div>

          <p className="text-gray-500">
            {product.stock} item{product.stock === 0 ? "" : "s"} left in stock
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-3 bg-[#e2edff] text-primary flex items-center gap-2 hover:bg-[#d5e5ff] transition">
              <i className="fas fa-cart-plus"></i>
              <span>Add to cart</span>
            </button>
            <button className="px-4 py-3 bg-primary text-white flex items-center gap-2 hover:bg-secondary transition">
              <i className="fas fa-money-check-alt"></i>
              <span>Buy now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white mt-8 px-4 py-5">
        <h1 className="text-3xl mb-6">Product description</h1>
        <p>{product.description}</p>
      </div>
    </div>
  );
}
