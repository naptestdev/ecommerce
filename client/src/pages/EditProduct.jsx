import Alert from "../components/Alert";
import ProductEditor from "../components/Products/ProductEditor";
import Spin from "react-cssfx-loading/lib/Spin";
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

  if (error)
    return (
      <div className="flex-grow flex flex-col justify-center items-center gap-3">
        <img className="w-36 h-36 object-cover" src="/error.png" alt="" />
        <p className="text-2xl">Something went wrong</p>
      </div>
    );

  if (!data)
    return (
      <div className="flex-grow flex justify-center items-center">
        <Spin />
      </div>
    );

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
