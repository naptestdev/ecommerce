export const resizeImage = (url, width, height, mode = "fit") =>
  url.replace("upload/", `upload/w_${width},h_${height},c_${mode}/`);
