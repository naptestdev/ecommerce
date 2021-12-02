import create from "zustand";
import { getProductDetail } from "../services/api/product";
import { updateCart } from "../services/api/cart";

export const useStore = create((set, get) => ({
  currentUser: undefined,
  setCurrentUser: (payload) => set({ currentUser: payload }),
  cart: [],
  isCardLoading: true,
  setIsCartLoading: (payload) => set({ isCardLoading: payload }),
  setCart: (cart) => set({ cart, isCardLoading: false }),
  addCartItem: async (id, quantity = 1) => {
    let cart = JSON.parse(JSON.stringify(get().cart));

    const existing = cart.find((item) => item.product._id === id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      const productDetail = await getProductDetail(id);

      cart.push({
        product: productDetail,
        quantity: quantity,
      });
    }

    await updateCart(
      cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }))
    );

    set({ cart, isCardLoading: false });
  },
  removeCartItem: async (id) => {
    let cart = JSON.parse(JSON.stringify(get().cart));

    cart = cart.filter((item) => item.product._id !== id);

    await updateCart(
      cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }))
    );

    set({ cart, isCardLoading: false });
  },
}));
