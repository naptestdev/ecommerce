import { Link, useParams } from "react-router-dom";
import { addresses, resizeImage } from "../shared/constant";
import { getOrderById, updateOrderStatus } from "../services/orders";

import Alert from "../components/Alert";
import Layout from "../components/Layout";
import Spin from "react-cssfx-loading/lib/Spin";
import { statuses } from "../shared/constant";
import useSWR from "swr";
import { useState } from "react";

export default function Order() {
  const { id } = useParams();

  const { data, error, mutate } = useSWR(`order-${id}`, () => getOrderById(id));

  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const handleChangeStatus = (value) => {
    updateOrderStatus(id, value).then(() => {
      setIsAlertOpened(true);
      mutate();
    });
  };

  return (
    <>
      <Layout>
        {error ? (
          <div className="flex-grow flex flex-col justify-center items-center gap-3">
            <img className="w-36 h-36 object-cover" src="/error.png" alt="" />
            <p className="text-2xl">Có lỗi xảy ra</p>
          </div>
        ) : !data ? (
          <div className="flex-grow flex justify-center items-center">
            <Spin />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-[800px] bg-white p-6 my-6">
              <div className="flex flex-col md:flex-row justify-between my-6">
                <h1 className="text-xl">Mã đơn hàng: {id}</h1>

                <select
                  value={data.status}
                  className="p-2 outline-none border border-gray-300"
                  onChange={(e) => handleChangeStatus(e.target.value)}
                >
                  {statuses.map((status, index) => (
                    <option value={index}>{status.name}</option>
                  ))}
                </select>
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
                        <Link to={`/products/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                        <p className="text-lg">x {item.quantity}</p>
                      </div>
                    </div>

                    <p className="text-xl">
                      {item.product.price.toLocaleString()}₫
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end my-8">
                <h1>
                  <span className="text-2xl">Tổng số tiền: </span>
                  <span className="text-3xl text-primary">
                    {data.amount.toLocaleString()}₫
                  </span>
                </h1>
              </div>

              <div>
                <h1 className="text-2xl">Địa chỉ người dùng</h1>

                {Object.entries(data.address).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <p>{addresses[key]}</p>

                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Layout>
      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text="Order status changed successfully!"
      />
    </>
  );
}
