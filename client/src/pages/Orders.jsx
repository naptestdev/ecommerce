import { Link, useLocation } from "react-router-dom";

import Layout from "../components/Layout";
import Spin from "react-cssfx-loading/lib/Spin";
import { getOrders } from "../services/api/orders";
import { resizeImage } from "../services/image";
import { statuses } from "../shared/constant";
import useSWR from "swr";

export default function Orders() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const page = Number(queryParams.get("page")) || 1;

  const { data, error } = useSWR(`orders-page-${page}`, () => getOrders(page));

  return (
    <Layout>
      {error ? (
        <div className="flex-grow flex flex-col justify-center items-center gap-3">
          <img className="w-36 h-36 object-cover" src="/error.png" alt="" />
          <p className="text-2xl">Something went wrong</p>
        </div>
      ) : (
        <div className="mx-[4vw]">
          <h1 className="text-2xl my-5">Orders List</h1>

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
                      <th>Products</th>
                      <th>Amount</th>
                      <th>Ordered At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.data.map((order) => (
                      <tr key={order._id}>
                        <td>
                          {order.products.slice(0, 3).map((product) => (
                            <img
                              key={product._id}
                              className="w-[35px] h-[35px] object-cover inline mr-1"
                              src={resizeImage(
                                product.product.images[0],
                                35,
                                35
                              )}
                              alt=""
                            />
                          ))}
                        </td>

                        <td>${order.amount}</td>

                        <td>{new Date(order.createdAt).toLocaleString()}</td>

                        <td>
                          <span
                            className="px-2 py-1 rounded-full"
                            style={{
                              color: statuses[order.status].color,
                              background: `${statuses[order.status].color}1A`,
                            }}
                          >
                            {statuses[order.status].name}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
