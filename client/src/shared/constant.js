export const avatarAPI = (username) =>
  `https://avatars.dicebear.com/api/initials/${username}.svg`;

export const statuses = [
  {
    name: "Pending",
    color: "#1D90FF",
  },
  {
    name: "Delivering",
    color: "#5E35B1",
  },
  {
    name: "Finished",
    color: "#198754",
  },
  {
    name: "Canceled",
    color: "#ff0000",
  },
];
