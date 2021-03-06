import { addresses, resizeImage } from "../shared/constant";

import { Link } from "react-router-dom";
import Spin from "react-cssfx-loading/lib/Spin";
import { requestPaymentSession } from "../services/payment";
import { useStore } from "../store";

export default function Cart() {
  const {
    cart,
    addCartItem,
    isCartLoading,
    setIsCartLoading,
    removeCartItem,
    currentUser,
  } = useStore((state) => ({
    cart: state.cart,
    addCartItem: state.addCartItem,
    isCartLoading: state.isCardLoading,
    setIsCartLoading: state.setIsCartLoading,
    removeCartItem: state.removeCartItem,
    currentUser: state.currentUser,
  }));

  return (
    <>
      {isCartLoading && (
        <div className="fixed h-screen w-screen top-0 left-0 bg-[#00000033] flex justify-center items-center">
          <Spin color="#2874F0" width="40px" height="40px" />
        </div>
      )}
      {cart.length === 0 ? (
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col items-center">
            <img
              className="w-32 h-32 object-cover"
              src="/empty-cart.png"
              alt=""
            />
            <h1 className="text-2xl my-4">Giỏ hàng của bạn trống</h1>
            <Link
              className="py-2 px-3 bg-primary hover:bg-secondary text-white transition"
              to="/"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center bg-bg">
          <div className="min-h-screen lg:max-w-[1500px] mx-4 flex items-start pt-8 gap-8 flex-col lg:flex-row">
            <div className="bg-white lg:flex-grow p-4">
              <div className="max-w-[90vw] overflow-x-auto">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th className="px-6">Giá</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.product._id}>
                        <td>
                          <div className="flex gap-4 mr-2">
                            <img
                              className="w-[60px] h-[60px] lg:w-[120px] lg:h-[120px] object-contain"
                              src={resizeImage(
                                item.product.images[0],
                                120,
                                120
                              )}
                              alt=""
                            />
                            <div>
                              <Link
                                to={`/product/${item.product._id}`}
                                className="text-lg lg:text-2xl max-w-[150px] lg:max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis inline-block"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-lg text-gray-600">
                                {item.product.price.toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-stretch">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  addCartItem(item.product._id, -1);
                                  setIsCartLoading(true);
                                } else {
                                  removeCartItem(item.product._id);
                                  setIsCartLoading(true);
                                }
                              }}
                              className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8"
                            >
                              -
                            </button>

                            <input
                              className="h-8 w-10 outline-none text-center border border-gray-300"
                              type="text"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              onClick={() => {
                                addCartItem(item.product._id);
                                setIsCartLoading(true);
                              }}
                              className="outline-none border border-gray-300 hover:border-primary hover:text-primary transition px-3 h-8"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-2xl px-6">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                          ₫
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              removeCartItem(item.product._id);
                              setIsCartLoading(true);
                            }}
                          >
                            <i className="fas fa-times text-red-600"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full lg:w-80 bg-white flex-shrink-0 p-7 flex flex-col items-stretch gap-4 text-lg">
              <div className="flex justify-between">
                <p>Tổng tiền</p>
                <p className="text-2xl text-primary">
                  {cart
                    .reduce((result, item) => {
                      result += item.product.price * item.quantity;
                      return result;
                    }, 0)
                    .toLocaleString()}
                  ₫
                </p>
              </div>

              <div className="bg-gray-400 w-full h-[1px]"></div>

              <div className="flex flex-col items-stretch">
                <div className="flex justify-between">
                  <p>Địa chỉ</p>

                  <Link className="text-primary" to="/profile">
                    {currentUser?.address ? "Sửa" : "Thêm"}
                  </Link>
                </div>

                {currentUser?.address && (
                  <div className="text-gray-500">
                    {Object.entries(currentUser?.address).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <p>{addresses[key]}</p>
                          <p>{value}</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  disabled={!currentUser?.address}
                  onClick={() => {
                    setIsCartLoading(true);
                    requestPaymentSession();
                  }}
                  className="py-2 px-5 bg-black hover:opacity-80 transition duration-300 text-white text-base disabled:!bg-gray-500 disabled:!opacity-100 disabled:!cursor-default"
                >
                  Thanh toán bằng VNPay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
