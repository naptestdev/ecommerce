import Carousel from "../components/Home/Carousel";
import Categories from "../components/Home/Categories";
import Suggested from "../components/Home/Suggested";

export default function Home() {
  return (
    <div className="flex-grow">
      <Carousel />
      <Categories />
      <Suggested />
    </div>
  );
}
