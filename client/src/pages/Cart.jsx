import { Link } from "react-router-dom";
import Spin from "react-cssfx-loading/lib/Spin";
import { requestPaymentSession } from "../services/api/payment";
import { resizeImage } from "../services/image";
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
            <h1 className="text-2xl my-4">Your cart is empty</h1>
            <Link
              className="py-2 px-3 bg-primary hover:bg-secondary text-white transition"
              to="/"
            >
              Continue buying
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen px-[10vw] bg-bg flex items-start pt-8 gap-8">
          <div className="bg-white flex-grow p-4">
            <div>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product Detail</th>
                    <th>Quantity</th>
                    <th className="px-6">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product._id}>
                      <td>
                        <div className="flex gap-4">
                          <img
                            className="w-[120px] h-[120px] object-contain"
                            src={resizeImage(item.product.images[0], 120, 120)}
                            alt=""
                          />
                          <div>
                            <p className="text-2xl">{item.product.name}</p>
                            <p className="text-lg text-gray-600">
                              $
                              {Math.round(
                                (item.product.price - item.product.discount) *
                                  10
                              ) / 10}
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
                        $
                        {Math.round(
                          (item.product.price - item.product.discount) *
                            10 *
                            item.quantity
                        ) / 10}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-80 bg-white flex-shrink-0 p-7 flex flex-col items-stretch gap-4 text-lg">
            <div className="flex justify-between">
              <p>Final price</p>
              <p className="text-2xl text-primary">
                $
                {Math.round(
                  cart.reduce((result, item) => {
                    result +=
                      Math.round(
                        (item.product.price - item.product.discount) *
                          10 *
                          item.quantity
                      ) / 10;
                    return result;
                  }, 0) * 10
                ) / 10}
              </p>
            </div>

            <div className="bg-gray-400 w-full h-[1px]"></div>

            <div className="flex flex-col items-stretch">
              <div className="flex justify-between">
                <p>Address</p>

                <Link className="text-primary" to="/profile">
                  {currentUser.address ? "Edit" : "Add now"}
                </Link>
              </div>

              {currentUser.address && (
                <div className="text-gray-500">
                  {Object.entries(currentUser.address).map(([key, value]) => (
                    <div className="flex justify-between">
                      <p>
                        {key
                          .replace(/([A-Z])/g, (match) => ` ${match}`)
                          .replace(/^./, (match) => match.toUpperCase())
                          .trim()}
                      </p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                disabled={!currentUser.address}
                onClick={() => {
                  setIsCartLoading(true);
                  requestPaymentSession();
                }}
                className="py-2 px-5 bg-black hover:opacity-80 transition duration-300 text-white text-base disabled:!bg-gray-500 disabled:!opacity-100 disabled:!cursor-default"
              >
                Checkout using Stripe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
