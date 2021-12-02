import Carousel from "../components/Home/Carousel";
import Categories from "../components/Home/Categories";
import Suggested from "../components/Home/Suggested";

export default function Home() {
  return (
    <div className="min-h-screen mb-16">
      <Carousel />
      <Categories />
      <Suggested />
    </div>
  );
}
