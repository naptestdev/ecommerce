import { Link, useLocation } from "react-router-dom";
import { deleteProductById, getProducts } from "../../services/api/products";

import { resizeImage } from "../../../../../user/client/src/services/image";
import useSWR from "swr";

export default function ProductsList({ categories }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;

  const { data, error, mutate } = useSWR(`products-page-${page}`, () =>
    getProducts(page)
  );

  if (error) return <div>Error</div>;

  return (
    <>
      <div className="flex justify-center mx-[4vw]">
        <div className="w-full">
          <div className="flex justify-between my-5">
            <h1 className="text-2xl">Products List</h1>

            <Link
              to="/products/new"
              className="bg-primary text-white py-2 px-3 rounded hover:brightness-[115%] transition duration-300"
            >
              New Product
            </Link>
          </div>

          {!data ? (
            <div>Loading</div>
          ) : (
            <div>
              <table className="table">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Creation Date</th>
                  <th>Actions</th>
                </tr>
                {data.data.map((product) => (
                  <tr>
                    <td>
                      <img
                        className="w-8 h-8 object-cover"
                        src={resizeImage(product.images[0], 32, 32, "fill")}
                        alt=""
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <p>{product.name}</p>
                      </div>
                    </td>
                    <td>
                      $
                      {Math.round((product.price - product.discount) * 10) / 10}
                    </td>
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
              </table>

              <div className="flex justify-end my-5 gap-3 items-center pr-6">
                <p>Pages</p>

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
                  {data.page} / {data.totalPage}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
