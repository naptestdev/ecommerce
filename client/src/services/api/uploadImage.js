import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "shopproj");
  formData.append("folder", "slide");

  const data = (
    await axios.post(
      "https://api.cloudinary.com/v1_1/shopproj/image/upload",
      formData
    )
  ).data;

  return data;
};
