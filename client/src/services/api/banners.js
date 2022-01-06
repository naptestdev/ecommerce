import axios from "../axios";

export const getBanners = async () => (await axios.get("banners")).data;
