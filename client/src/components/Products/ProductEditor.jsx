import ProductImages from "./ProductImages";
import { Spin } from "react-cssfx-loading/lib";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ProductEditor({ categories, data = null, handler }) {
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
    <form
      autoComplete="off"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-[4vw]"
    >
      <h1 className="text-2xl my-6">
        {data ? `Chỉnh sửa sản phẩm: ${data._id}` : "Tạo sản phẩm mới"}
      </h1>

      <div className="flex gap-10 flex-col md:flex-row">
        <div className="flex-1 flex flex-col items-stretch">
          <div className="flex flex-col items-stretch">
            <p>Tên</p>
            <input
              className="input-outline"
              type="text"
              placeholder={data?.name || ""}
              {...register("name", {
                required: {
                  value: true,
                  message: "Hãy điền tên sản phẩm",
                },
                value: data?.name || "",
              })}
            />
            <div className="input-error">
              {errors.name && errors.name.message}
            </div>
          </div>

          <div className="flex flex-col items-stretch">
            <p>Mô tả</p>
            <textarea
              className="input-outline resize-none h-24"
              placeholder={data?.description || ""}
              {...register("description", {
                required: {
                  value: true,
                  message: "Hãy điền mô tả sản phẩm",
                },
                value: data?.description || "",
              })}
            />
            <div className="input-error">
              {errors.description && errors.description.message}
            </div>
          </div>

          <div className="flex flex-col items-stretch">
            <p>Giá tiền</p>
            <input
              type="number"
              className="input-outline resize-none"
              placeholder={data?.price || ""}
              step={1000}
              {...register("price", {
                required: {
                  value: true,
                  message: "Hãy điền giá tiền sản phẩm",
                },
                validate: (value) =>
                  Number(value) > 0 || "Giá tiền không hợp lệ",
                value: data?.price || "",
              })}
            />
            <div className="input-error">
              {errors.price && errors.price.message}
            </div>
          </div>

          <div className="flex flex-col items-stretch">
            <p>Giảm giá</p>
            <input
              type="number"
              className="input-outline resize-none"
              placeholder={data?.discount || ""}
              step={1000}
              {...register("discount", {
                required: {
                  value: true,
                  message: "Hãy điền số tiền giảm giá của sản phẩm",
                },
                validate: (value) =>
                  (Number(value) > 0 &&
                    Number(value) < Number(watch("price"))) ||
                  "Số tiền giảm giá không hợp lệ",
                value: data?.discount || "",
              })}
            />
            <div className="input-error">
              {errors.discount && errors.discount.message}
            </div>
          </div>

          <div className="flex flex-col items-stretch">
            <p>Số hàng tồn kho</p>
            <input
              type="number"
              className="input-outline resize-none"
              placeholder={data?.stock || ""}
              {...register("stock", {
                required: {
                  value: true,
                  message: "Hãy điền số sản phẩm còn tồn kho",
                },
                validate: (value) =>
                  Number(value) > 0 || "Số hàng tồn kho không hợp lệ",
                value: data?.stock || "",
              })}
            />
            <div className="input-error">
              {errors.stock && errors.stock.message}
            </div>
          </div>

          <div className="flex flex-col items-stretch">
            <p>Danh mục</p>

            <select
              className="p-2 outline-none border border-gray-300"
              {...register("category", {
                value: data?.category || categories[0]._id,
                required: true,
              })}
            >
              {categories.map((category) => (
                <option key={category._id} className="p-2" value={category._id}>
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
          <span>{data ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}</span>
        </button>
      </div>
    </form>
  );
}
