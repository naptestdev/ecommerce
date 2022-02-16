import axios from "../shared/axios";

export const getTotalSales = async () =>
  (await axios.get("home/total-sales")).data;

export const getTotalUsers = async () =>
  (await axios.get("home/total-users")).data;

export const getTotalTransactions = async () =>
  (await axios.get("home/total-transactions")).data;

export const getRecentUsers = async () =>
  (await axios.get("home/recent-users")).data;

export const getRecentTransactions = async () =>
  (await axios.get("home/recent-transactions")).data;
