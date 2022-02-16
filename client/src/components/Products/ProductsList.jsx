import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteProductById, getProducts } from "../../services/products";

import ExportDropdown from "../ExportDropdown";
import Spin from "react-cssfx-loading/lib/Spin";
import { resizeImage } from "../../shared/constant";
import useSWR from "swr";

export default function ProductsList({ categories }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;

  const navigate = useNavigate();

  const { data, error, mutate } = useSWR(`products-page-${page}`, () =>
    getProducts(page)
  );

  if (error)
    return (
      <div className="flex-grow flex flex-col justify-center items-center gap-3">
        <img className="w-36 h-36 object-cover" src="/error.png" alt="" />
        <p className="text-2xl">Có lỗi đã xảy ra</p>
      </div>
    );

  return (
    <div className="mx-[4vw]">
      <div className="flex justify-between my-5">
        <h1 className="text-2xl">Danh sách sản phẩm</h1>

        <div className="flex items-center gap-3">
          <Link
            to="/products/new"
            className="bg-primary text-white py-1 px-3 rounded hover:brightness-[115%] transition duration-300"
          >
            Tạo sản phẩm mới
          </Link>

          <ExportDropdown type="products" />
        </div>
      </div>

      {!data ? (
        <div className="min-h-[80vh] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <>
          <div className="max-w-[92vw] lg:max-w-[calc(100vw-350px)] overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá tiền</th>
                  <th>Danh mục</th>
                  <th>Thời gian tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {data.data.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        className="w-8 h-8 object-cover"
                        src={resizeImage(product.images[0], 32, 32)}
                        alt=""
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <p className="max-w-[200px] md:max-w-[400px] overflow-hidden whitespace-nowrap text-ellipsis">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td>{product.price.toLocaleString()}₫</td>
                    <td>
                      {
                        categories.find(
                          (category) => category._id === product.category
                        ).name
                      }
                    </td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="text-primary"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() =>
                            deleteProductById(product._id).finally(mutate)
                          }
                          className="text-red-500"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end my-5 gap-3 items-center pr-6">
            <p>Trang số</p>

            {data.page > 1 ? (
              <Link to={`/products?page=${data.page - 1}`}>
                <i className="fas fa-chevron-left"></i>
              </Link>
            ) : (
              <button disabled className="text-gray-500">
                <i className="fas fa-chevron-left"></i>
              </button>
            )}

            <p>
              <input
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const page = Number(e.target.value);
                    if (!isNaN(page) && page >= 1 && page <= data.totalPage) {
                      navigate(`/products?page=${page}`);
                    }
                  }
                }}
                style={{ width: String(data.totalPage).length * 10 }}
                className="outline-none bg-transparent inline"
                defaultValue={data.page}
                placeholder={data.page}
              />{" "}
              / {data.totalPage}
            </p>

            {data.page < data.totalPage ? (
              <Link to={`/products?page=${data.page + 1}`}>
                <i className="fas fa-chevron-right"></i>
              </Link>
            ) : (
              <button disabled className="text-gray-500">
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
