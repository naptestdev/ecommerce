import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Alert from "../components/Alert";
import NextArrow from "../components/Slider/NextArrow";
import PrevArrow from "../components/Slider/PrevArrow";
import ReviewsSection from "../components/Product/ReviewsSection";
import SimilarProducts from "../components/Product/SimilarProducts";
import Slider from "react-slick";
import Spin from "react-cssfx-loading/lib/Spin";
import StarRatings from "../components/StarRatings";
import { getProductDetail } from "../services/product";
import useSWR from "swr";
import { useState } from "react";
import { useStore } from "../store";

export default function Product() {
  const { id } = useParams();
  const location = useLocation();
  const {
    data: product,
    error,
    mutate,
  } = useSWR(location.pathname, () => getProductDetail(id));
  const addCartItem = useStore((state) => state.addCartItem);

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [addCartLoading, setAddCartLoading] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  if (!product || error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-bg">
        <Spin color="#2874F0" width="40px" height="40px" />
      </div>
    );

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col items-stretch px-[6vw]">
        <div className="flex gap-2 items-center text-sm my-4 flex-wrap">
          <Link
            className="hover:text-primary transition whitespace-nowrap"
            to="/"
          >
            Trang chủ
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

        <div className="flex items-start bg-white md:p-4 flex-col md:flex-row">
          <div className="md:w-[35%] w-full">
            <Slider
              infinite
              speed={500}
              autoplay
              autoplaySpeed={4000}
              slidesToShow={1}
              slidesToScroll={1}
              prevArrow={<PrevArrow />}
              nextArrow={<NextArrow />}
            >
              {product.images.map((image) => (
                <img key={image} src={image} alt="" />
              ))}
            </Slider>
          </div>
          <div className="md:w-[65%] pl-6 flex flex-col items-stretch gap-3 py-4 md:py-0">
            <h1 className="text-2xl font-medium">{product.name}</h1>
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex items-center gap-1">
                <p
                  className={`text-lg ${
                    product.ratings > 0 ? "text-orange" : ""
                  }`}
                >
                  {product.ratings}
                </p>
                <p>
                  <StarRatings value={product.ratings} max={5} />
                </p>
              </div>

              <div className="h-6 w-[2px] bg-gray-300"></div>

              <div className="flex items-center gap-1">
                <p className="text-lg">{product.ratingsCount}</p>
                <p className="text-gray-500">Đánh giá</p>
              </div>

              <div className="h-6 w-[2px] bg-gray-300"></div>

              <div className="flex items-center gap-1">
                <p className="text-lg">0</p>
                <p className="text-gray-500">Đã bán</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!!product.originalPrice && (
                <p className="text-2xl line-through text-gray-400">
                  {product.originalPrice?.toLocaleString()}₫
                </p>
              )}
              <h1 className="text-5xl my-3 text-primary">
                {product.price?.toLocaleString()}₫
              </h1>
            </div>

            <div className="flex items-center">
              <div className="w-24">Số lượng</div>
              <div className="flex items-stretch">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8"
                >
                  -
                </button>

                <input
                  className="h-8 w-10 outline-none text-center border border-gray-300"
                  type="text"
                  value={quantity}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    if (isNaN(num)) return;

                    if (num < 1) return setQuantity(1);

                    if (num > product.stock) return setQuantity(product.stock);

                    setQuantity(num);
                  }}
                />
                <button
                  onClick={() =>
                    quantity + 1 <= product.stock && setQuantity(quantity + 1)
                  }
                  className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8"
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-gray-500">
              Còn {product.stock} sản phẩm trong kho.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                disabled={addCartLoading}
                onClick={() => {
                  if (!currentUser) {
                    setAlertText("Hãy đăng nhập để mua hàng");
                    setIsAlertOpened(true);
                  } else {
                    setAddCartLoading(true);
                    addCartItem(product._id, quantity)
                      .then(() => {
                        setAlertText(
                          `Đã thêm ${quantity} sản phẩm vào giỏ hàng`
                        );
                        setIsAlertOpened(true);
                      })
                      .catch((err) => {
                        console.log(err);

                        setAlertText("Có lỗi khi thêm vào giỏ hàng");
                        setIsAlertOpened(true);
                      })
                      .finally(() => setAddCartLoading(false));
                  }
                }}
                className="px-4 py-3 bg-[#e2edff] text-primary flex items-center gap-2 hover:bg-[#d5e5ff] transition disabled:brightness-90 disabled:!cursor-default"
              >
                {addCartLoading ? (
                  <Spin width="20px" height="20px" />
                ) : (
                  <i className="fas fa-cart-plus"></i>
                )}
                <span>Thêm vào giỏ hàng</span>
              </button>
              <button
                onClick={() => {
                  if (!currentUser) {
                    setAlertText("Hãy đăng nhập để mua hàng");
                    setIsAlertOpened(true);
                  } else {
                    setAddCartLoading(true);
                    addCartItem(product._id, quantity)
                      .then(() => {
                        navigate("/cart");
                      })
                      .catch((err) => {
                        console.log(err);

                        setAlertText("Có lỗi khi thêm vào giỏ hàng");
                        setIsAlertOpened(true);
                      })
                      .finally(() => setAddCartLoading(false));
                  }
                }}
                disabled={addCartLoading}
                className="px-4 py-3 bg-primary text-white flex items-center gap-2 hover:bg-secondary transition disabled:brightness-90 disabled:!cursor-default"
              >
                {addCartLoading ? (
                  <Spin width="20px" height="20px" color="#ffffff" />
                ) : (
                  <i className="fas fa-money-check-alt"></i>
                )}
                <span>Mua ngay</span>
              </button>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="bg-white mt-8 p-4">
            <h1 className="text-3xl mb-3">Thông tin sản phẩm</h1>
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>
        )}

        <ReviewsSection product={product} refetchProduct={mutate} />

        <SimilarProducts productId={product._id} />
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={alertText}
      />
    </>
  );
}
