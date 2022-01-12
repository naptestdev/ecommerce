import ProductEditor from "../components/Products/ProductEditor";
import { createProduct } from "../services/api/products";
import { useNavigate } from "react-router-dom";

export default function NewProduct({ categories }) {
  const navigate = useNavigate();

  const handler = async (data) => {
    await createProduct(data);
    navigate("/products");
  };
  return (
    <div>
      <ProductEditor categories={categories} handler={handler} />
    </div>
  );
}
