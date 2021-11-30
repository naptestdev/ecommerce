import Slider from "react-slick";
import { getCarousel } from "../../services/api/homepage";
import { useQuery } from "react-query";
import useSWR from "swr";

function PrevArrow({ onClick }) {
  return (
    <button
      className="absolute border-none outline-none left-0 w-10 h-14 bg-[#0000005b] top-1/2 -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <i className="fas fa-chevron-left text-white text-3xl"></i>
    </button>
  );
}
function NextArrow({ onClick }) {
  return (
    <button
      className="absolute border-none outline-none right-0 w-10 h-14 bg-[#0000005b] top-1/2 -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <i className="fas fa-chevron-right text-white text-3xl"></i>
    </button>
  );
}

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
              key={item.url}
              className="w-full h-[30vw] max-h-[260px] object-cover"
              src={item.url}
              alt=""
            />
          ))}
        </Slider>
      )}
    </div>
  );
}
