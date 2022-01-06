import BannersDND from "../components/Banners/BannerDND";
import Layout from "../components/Layout";
import { getBanners } from "../services/api/banners";
import useSWR from "swr";

export default function Banners() {
  const { data } = useSWR("banners", () => getBanners());

  if (!data) return <div>Loading</div>;

  return (
    <Layout>
      <BannersDND data={data} />
    </Layout>
  );
}
