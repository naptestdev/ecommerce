import Carousel from "../components/Home/Carousel";
import Categories from "../components/Home/Categories";
import Footer from "../components/Footer";
import Suggested from "../components/Home/Suggested";

export default function Home() {
  return (
    <div>
      <Carousel />
      <Categories />
      <Suggested />
      <Footer />
    </div>
  );
}
