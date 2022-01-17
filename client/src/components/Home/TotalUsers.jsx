import Skeleton from "../Skeleton";
import { getTotalUsers } from "../../services/api/home";
import useSWR from "swr";

export default function TotalUsers() {
  const { data, error } = useSWR(`home-total-users`, () => getTotalUsers());

  return (
    <div className="flex flex-col gap-3 p-5 bg-white shadow">
      <p className="text-lg">Total Users</p>
      {!data || error ? (
        <>
          <Skeleton className="w-[50%] h-8" />
          <Skeleton className="w-full h-6" />
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold">
              {data.count} user{data.count > 1 ? "s" : ""}
            </p>

            <i className="fas fa-arrow-up text-green-500"></i>
          </div>
          <p className="text-gray-500">Compared to last month</p>
        </>
      )}
    </div>
  );
}
