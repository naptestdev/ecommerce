import ProductEditor from "../components/Products/ProductEditor";
import { createProduct } from "../services/api/products";

export default function NewProduct({ categories }) {
  const handler = async (data) => {
    await createProduct(data);
  };
  return (
    <div>
      <ProductEditor categories={categories} handler={handler} />
    </div>
  );
}
