import ProductImages from "./ProductImages";
import { Spin } from "react-cssfx-loading/lib";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ProductEditorMain({ categories, data, handler }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [images, setImages] = useState(data?.images || []);

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (submitData) => {
    if (loading || images.length === 0) return;

    setLoading(true);

    handler({ ...submitData, images }).finally(() => setLoading(false));
  };

  return (
    <div className="flex justify-center mx-[4vw]">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full"
      >
        <h1 className="text-2xl my-6">
          {data ? `Edit Product: ${data._id}` : "New Product"}
        </h1>

        <div className="flex gap-10">
          <div className="flex-1 flex flex-col items-stretch">
            <div className="flex flex-col items-stretch">
              <p>Name</p>
              <input
                className="input-outline"
                type="text"
                placeholder={data?.name || ""}
                {...register("name", {
                  required: {
                    value: true,
                    message: "Please provide a product name",
                  },
                  value: data?.name || "",
                })}
              />
              <div className="input-error">
                {errors.name && errors.name.message}
              </div>
            </div>

            <div className="flex flex-col items-stretch">
              <p>Description</p>
              <textarea
                className="input-outline resize-none h-24"
                placeholder={data?.description || ""}
                {...register("description", {
                  required: {
                    value: true,
                    message: "Product description is required",
                  },
                  value: data?.description || "",
                })}
              />
              <div className="input-error">
                {errors.description && errors.description.message}
              </div>
            </div>

            <div className="flex flex-col items-stretch">
              <p>Price</p>
              <input
                type="number"
                className="input-outline resize-none"
                placeholder={data?.price || ""}
                step={0.1}
                {...register("price", {
                  required: {
                    value: true,
                    message: "Enter the product price",
                  },
                  validate: (value) => Number(value) > 0 || "Invalid price",
                  value: data?.price || "",
                })}
              />
              <div className="input-error">
                {errors.price && errors.price.message}
              </div>
            </div>

            <div className="flex flex-col items-stretch">
              <p>Discount</p>
              <input
                type="number"
                className="input-outline resize-none"
                placeholder={data?.discount || ""}
                step={0.1}
                {...register("discount", {
                  required: {
                    value: true,
                    message: "Enter the discount value",
                  },
                  validate: (value) =>
                    (Number(value) > 0 &&
                      Number(value) < Number(watch("price"))) ||
                    "Invalid discount",
                  value: data?.discount || "",
                })}
              />
              <div className="input-error">
                {errors.discount && errors.discount.message}
              </div>
            </div>

            <div className="flex flex-col items-stretch">
              <p>Stock</p>
              <input
                type="number"
                className="input-outline resize-none"
                placeholder={data?.stock || ""}
                {...register("stock", {
                  required: {
                    value: true,
                    message: "How many items left in stock?",
                  },
                  validate: (value) => Number(value) > 0 || "Invalid price",
                  value: data?.stock || "",
                })}
              />
              <div className="input-error">
                {errors.stock && errors.stock.message}
              </div>
            </div>

            <div className="flex flex-col items-stretch">
              <p>Category</p>

              <select
                className="p-2 outline-none border border-gray-300"
                {...register("category", {
                  value: data?.category || categories[0]._id,
                  required: true,
                })}
              >
                {categories.map((category) => (
                  <option
                    key={category._id}
                    className="p-2"
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <ProductImages images={images} setImages={setImages} />
          </div>
        </div>

        <div className="flex justify-end my-10">
          <button
            disabled={loading}
            className="bg-primary text-white py-2 px-4 hover:brightness-[115%] transition flex items-center gap-2 disabled:!brightness-90 disabled:cursor-auto"
          >
            {loading ? (
              <Spin color="#ffffff" width="20px" height="20px" />
            ) : (
              <i className="fas fa-save"></i>
            )}
            <span>{data ? "Update product" : "Create product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
