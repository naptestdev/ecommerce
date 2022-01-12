import Alert from "../components/Alert";
import ProductEditor from "../components/Products/ProductEditor";
import { getProductById } from "../services/api/products";
import { updateProduct } from "../services/api/products";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";

export default function EditProduct({ categories }) {
  const { id } = useParams();

  const { data, error } = useSWR(`product-${id}`, () => getProductById(id));

  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const handler = async (data) => {
    await updateProduct(id, data);

    setIsAlertOpened(true);
  };

  if (error) return <div>Error</div>;

  if (!data) return <div>Loading</div>;

  return (
    <>
      <ProductEditor handler={handler} categories={categories} data={data} />
      <Alert
        text="Product edited successfully"
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
      />
    </>
  );
}
