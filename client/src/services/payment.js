import axios from "../shared/axios";

export const requestPaymentSession = async () => {
  const session = (await axios.post("/payment/create-session")).data;

  window.location.assign(session);
};
