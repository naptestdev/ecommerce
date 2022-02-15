import axios from "../shared/axios";
import create from "zustand";
import { getProductDetail } from "../services/product";
import { updateCart } from "../services/cart";

export const useStore = create((set, get) => ({
  verifyUser: () => {
    axios
      .post("auth/verify-token")
      .then((res) => {
        if (res.status === 200) {
          set({ currentUser: res.data.user });
          localStorage.setItem("token", res.data.token);
        } else {
          set({ currentUser: null });
        }
      })
      .catch(() => {
        set({ currentUser: null });
      });
  },
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
