import ProductEditor from "../components/Products/ProductEditor";
import { getProductById } from "../services/api/products";
import { updateProduct } from "../services/api/products";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export default function EditProduct({ categories }) {
  const { id } = useParams();

  const { data, error } = useSWR(`product-${id}`, () => getProductById(id));

  if (error) return <div>Error</div>;

  if (!data) return <div>Loading</div>;

  return (
    <ProductEditor
      handler={(data) => {
        updateProduct(id, data);
      }}
      categories={categories}
      data={data}
    />
  );
}
