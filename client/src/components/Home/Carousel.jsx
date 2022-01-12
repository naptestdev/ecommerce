import NextArrow from "../Slider/NextArrow";
import PrevArrow from "../Slider/PrevArrow";
import Slider from "react-slick";
import { getCarousel } from "../../services/api/homepage";
import useSWR from "swr";

export default function Carousel() {
  const { data, error } = useSWR("home-carousel", getCarousel);

  return (
    <div className="w-screen px-[4vw] my-4 relative">
      {!data || error ? (
        <div className="w-full h-[30vw] max-h-[260px] bg-gray-300 animate-pulse"></div>
      ) : (
        <Slider
          infinite
          speed={500}
          autoplay
          autoplaySpeed={2000}
          slidesToShow={1}
          slidesToScroll={1}
          prevArrow={<PrevArrow />}
          nextArrow={<NextArrow />}
        >
          {data.map((item) => (
            <img
              key={item}
              className="w-full h-[30vw] max-h-[260px] object-cover"
              src={item}
              alt=""
            />
          ))}
        </Slider>
      )}
    </div>
  );
}
