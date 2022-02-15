import { Link } from "react-router-dom";
import Spin from "react-cssfx-loading/lib/Spin";
import { getAllOrders } from "../services/order";
import { resizeImage } from "../shared/constant";
import { statuses } from "../shared/constant";
import useSWR from "swr";
import { useState } from "react";

export default function Orders() {
  const { data, error } = useSWR(`orders`, () => getAllOrders());

  const [section, setSection] = useState(-1);

  if (!data)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin />
      </div>
    );

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen px-4">
      <div className="w-full max-w-[1000px]">
        <div className="flex bg-white mt-8 mb-4 justify-around shadow max-w-full flex-wrap">
          <button
            onClick={() => setSection(-1)}
            className={`px-6 py-3 flex justify-center items-center relative after:absolute after:top-[46px] after:left-0 after:w-full after:h-[2px] after:bg-transparent transition after:transition ${
              section === -1 ? "text-primary after:!bg-primary" : ""
            }`}
          >
            All
          </button>
          {statuses.map((status, index) => (
            <button
              onClick={() => setSection(index)}
              className={`px-6 py-3 flex justify-center items-center relative after:absolute after:top-[46px] after:left-0 after:w-full after:h-[2px] after:bg-transparent transition after:transition ${
                index === section ? "text-primary after:!bg-primary" : ""
              }`}
            >
              {status.name}
            </button>
          ))}
        </div>

        <div className="max-w-full overflow-x-auto">
          {data.length === 0 ||
          (section !== -1 &&
            data.filter((item) => item.status === section).length === 0) ? (
            <div className="w-full h-60 bg-white flex flex-col items-center justify-center">
              <img className="w-32 h-32" src="/empty-cart.png" alt="" />
              <p>No order found</p>
            </div>
          ) : (
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
                {data
                  .filter((item) =>
                    section === -1 ? true : item.status === section
                  )
                  .map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.products.slice(0, 3).map((product) => (
                          <img
                            key={product._id}
                            className="w-[35px] h-[35px] object-cover inline mr-1"
                            src={resizeImage(product.product.images[0], 35, 35)}
                            alt=""
                          />
                        ))}
                      </td>

                      <td>${item.amount}</td>

                      <td>{new Date(item.createdAt).toLocaleString()}</td>

                      <td>
                        <span
                          className="px-2 py-1 rounded-full"
                          style={{
                            color: statuses[item.status].color,
                            background: `${statuses[item.status].color}1A`,
                          }}
                        >
                          {statuses[item.status].name}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/order/${item._id}`}
                          className="text-primary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
