export const avatarAPI = (username) =>
  `https://avatars.dicebear.com/api/initials/${username}.svg`;

export const statuses = [
  {
    name: "Đang chờ",
    color: "#1D90FF",
  },
  {
    name: "Vận chuyển",
    color: "#5E35B1",
  },
  {
    name: "Hoàn thành",
    color: "#198754",
  },
  {
    name: "Đã huỷ",
    color: "#ff0000",
  },
];

export const addresses = {
  fullName: "Tên đầy đủ",
  phoneNumber: "Số điện thoại",
  city: "Thành phố",
  district: "Quận",
  exactAddress: "Địa chỉ chính xác",
};

export const resizeImage = (url, width = 0, height = 0) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${
    width || ""
  }&h=${height || ""}&fit=outside`;
