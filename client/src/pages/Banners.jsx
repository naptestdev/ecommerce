import BannersDND from "../components/Banners/BannerDND";
import Layout from "../components/Layout";
import { getBanners } from "../services/api/banners";
import useSWR from "swr";

export default function Banners() {
  const { data } = useSWR("banners", () => getBanners());

  return (
    <Layout>{!data ? <div>Loading</div> : <BannersDND data={data} />}</Layout>
  );
}
