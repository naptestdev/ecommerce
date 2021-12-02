import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { resizeImage } from "../services/image";
import { useStore } from "../store";

export default function Cart() {
  const { cart, addCartItem, isCartLoading, setIsCartLoading, removeCartItem } =
    useStore((state) => ({
      cart: state.cart,
      addCartItem: state.addCartItem,
      isCartLoading: state.isCardLoading,
      setIsCartLoading: state.setIsCartLoading,
      removeCartItem: state.removeCartItem,
    }));

  return (
    <>
      {isCartLoading && (
        <div className="fixed h-screen w-screen top-0 left-0 bg-[#00000033] flex justify-center items-center">
          <ReactLoading type="spin" color="#2874F0" width={40} height={40} />
        </div>
      )}
      {cart.length === 0 ? (
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col items-center">
            <img
              className="w-32 h-auto"
              src="https://res.cloudinary.com/shopproj/image/upload/w_150,h_150,c_fill/j4rilqmejexwk2ngvtqi.png"
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
        <div className="min-h-screen px-[10vw] bg-[#F5F5F5] flex items-start pt-8 gap-8">
          <div className="bg-white flex-grow p-4">
            <div>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product Detail</th>
                    <th>Quantity</th>
                    <th>Total price</th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product._id}>
                      <td>
                        <div className="flex gap-4">
                          <img
                            className="w-[120px] h-[120px] object-contain"
                            src={resizeImage(item.product.image[0], 120, 120)}
                            alt=""
                          />
                          <div>
                            <p className="text-2xl">{item.product.name}</p>
                            <p className="text-xl text-primary">
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
                      <td className="text-2xl text-primary">
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
          <div className="w-72 bg-white flex-shrink-0">
            <h1>Checkout</h1>
            <p>Total cost: $10</p>
            <button>Checkout</button>
          </div>
        </div>
      )}
    </>
  );
}
