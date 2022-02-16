import Skeleton from "../Skeleton";
import { getTotalSales } from "../../services/home";
import useSWR from "swr";

export default function TotalSales() {
  const { data, error } = useSWR(`home-total-sales`, () => getTotalSales());

  return (
    <div className="flex flex-col gap-3 p-5 bg-white shadow">
      <p className="text-lg">Tổng doanh thu</p>
      {!data || error ? (
        <>
          <Skeleton className="w-[50%] h-8" />
          <Skeleton className="w-full h-6" />
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold">
              {data.total?.toLocaleString()}₫
            </p>

            <i className="fas fa-arrow-up text-green-500"></i>
          </div>
          <p className="text-gray-500">Tăng so với tháng trước</p>
        </>
      )}
    </div>
  );
}
