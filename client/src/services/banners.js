import axios from "../shared/axios";

export const getBanners = async () => (await axios.get("banners")).data;

export const updateBanners = async (images) =>
  (await axios.post("banners", images)).data;
