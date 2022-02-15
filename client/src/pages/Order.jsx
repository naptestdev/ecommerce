import { Link, useParams } from "react-router-dom";
import { addresses, resizeImage } from "../shared/constant";
import { cancelOrder, getOrderById } from "../services/order";

import { Fragment } from "react";
import Spin from "react-cssfx-loading/lib/Spin";
import { statuses } from "../shared/constant";
import useSWR from "swr";
import { useState } from "react";

export default function Order() {
  const { id } = useParams();

  const { data, error, mutate } = useSWR(`order-${id}`, () => getOrderById(id));

  const [isCancelling, setIsCancelling] = useState(false);

  if (error) return <div>Error</div>;

  if (!data)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin />
      </div>
    );

  const handleCancelOrder = () => {
    setIsCancelling(true);

    cancelOrder(id)
      .then(() => {
        mutate();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsCancelling(false);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 px-4">
      <div className="bg-white w-full max-w-[800px] p-4 md:p-8 my-8">
        <div className="flex justify-between text-lg mb-8 flex-col md:flex-row">
          <p>Mã đơn hàng: {data._id}</p>
          <p style={{ color: statuses[data.status].color }}>
            {statuses[data.status].name}
          </p>
        </div>

        <div className="flex justify-center flex-wrap">
          {statuses.map((status, index) => (
            <Fragment key={index}>
              <div
                className={`flex flex-col items-center ${
                  data.status >= index ? "text-[#2AC258]" : "text-gray-600"
                }`}
              >
                <div
                  className={`w-6 md:w-12 h-6 md:h-12 border rounded-full flex justify-center items-center ${
                    data.status >= index ? "border-[#2AC258]" : ""
                  }`}
                >
                  <i className={`text-sm md:text-xl fas fa-${status.icon}`}></i>
                </div>

                <p>{status.name}</p>
              </div>

              {index + 1 < statuses.length && (
                <div
                  className={`w-6 md:w-12 h-1 mt-3 md:mt-6 rounded-full ${
                    data.status > index ? "bg-[#2AC258]" : "bg-gray-600"
                  }`}
                ></div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="border-t mt-8">
          {data.products.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between items-center py-2 border-b"
            >
              <div className="flex gap-4">
                <img
                  className="w-[100px] h-[100px]"
                  src={resizeImage(item.product.images[0], 100, 100)}
                  alt=""
                />

                <div className="py-3">
                  <Link to={`/product/${item.product._id}`}>
                    {item.product.name}
                  </Link>
                  <p className="text-lg">x {item.quantity}</p>
                </div>
              </div>

              <p className="text-xl">{item.product.price}₫</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h1 className="text-2xl">Địa chỉ của bạn</h1>

          {Object.entries(data.address).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <p>{addresses[key]}</p>

              <p>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-12 flex-col-reverse sm:flex-row gap-6 sm:gap-0">
          <div>
            <button
              disabled={data.status !== 0 || isCancelling}
              onClick={handleCancelOrder}
              className={`outline-none bg-[#DC3545] text-white py-2 px-3 rounded hover:brightness-[115%] transition disabled:brightness-75 disabled:!cursor-default`}
            >
              Huỷ đơn hàng
            </button>
            {data.status !== 0 && (
              <p className="text-gray-400">
                Chỉ đơn hàng ở trạng thái đang chờ có thể được huỷ
              </p>
            )}
          </div>

          <div className="flex flex-col items-end">
            <h1>
              <span className="text-2xl">Tổng số tiền: </span>
              <span className="text-3xl text-primary">{data.amount}₫</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
