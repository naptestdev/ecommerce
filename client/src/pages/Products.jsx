import Layout from "../components/Layout";
import ProductsList from "../components/Products/ProductsList";
import Spin from "react-cssfx-loading/lib/Spin";
import { getCategories } from "../services/products";
import useSWR from "swr";

export default function Products({ component: Component }) {
  const { data, error } = useSWR("categories", () => getCategories());

  if (error) return <div>Error</div>;

  return (
    <Layout>
      {!data ? (
        <div className="flex flex-grow justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Component categories={data} />
      )}
    </Layout>
  );
}
