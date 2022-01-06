import { avatarAPI, statuses } from "../../shared/constant";

const mockData = [
  {
    user: {
      username: "NAP",
    },
    date: Date.now(),
    amount: 100,
    status: 0,
  },
  {
    user: {
      username: "Phong",
    },
    date: Date.now(),
    amount: 200,
    status: 1,
  },
  {
    user: {
      username: "NAPTest",
    },
    date: Date.now(),
    amount: 300,
    status: 2,
  },
  {
    user: {
      username: "NAPDev",
    },
    date: Date.now(),
    amount: 400,
    status: 3,
  },
  {
    user: {
      username: "NAP",
    },
    date: Date.now(),
    amount: 100,
    status: 0,
  },
];

export default function LatestTransactions() {
  return (
    <div className="bg-white shadow p-4">
      <h1 className="text-2xl">Latest transactions</h1>

      <table className="w-full">
        <tr className="font-bold">
          <td className="p-2">Customer</td>
          <td>Date</td>
          <td>Amount</td>
          <td>Status</td>
        </tr>
        {mockData.map((item) => (
          <tr>
            <td className="p-2">
              <div className="flex items-center gap-2">
                <img
                  className="w-7 h-7 rounded-full"
                  src={avatarAPI(item.user.username)}
                  alt=""
                />

                <span>{item.user.username}</span>
              </div>
            </td>
            <td>{new Date(item.date).toDateString()}</td>
            <td>${item.amount}</td>
            <td>
              <span
                className="px-2 py-1 rounded-xl"
                style={{
                  color: statuses[item.status].color,
                  background: `${statuses[item.status].color}2d`,
                }}
              >
                {statuses[item.status].name}
              </span>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
