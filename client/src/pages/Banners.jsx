import BannerList from "../components/Banners/BannerList";
import Layout from "../components/Layout";
import Spin from "react-cssfx-loading/lib/Spin";
import { getBanners } from "../services/banners";
import useSWR from "swr";

export default function Banners() {
  const { data, error } = useSWR("banners", () => getBanners());

  return (
    <Layout>
      {error ? (
        <div className="flex-grow flex flex-col justify-center items-center gap-3">
          <img className="w-36 h-36 object-cover" src="/error.png" alt="" />
          <p className="text-2xl">Có lỗi xảy ra</p>
        </div>
      ) : !data ? (
        <div className="flex-grow flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <BannerList data={data} />
      )}
    </Layout>
  );
}
