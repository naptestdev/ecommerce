import LatestTransactions from "../components/Home/LatestTransactions";
import Layout from "../components/Layout";
import RecentUsers from "../components/Home/RecentUsers";
import TotalSales from "../components/Home/TotalSales";
import TotalTransactions from "../components/Home/TotalTransactions";
import TotalUsers from "../components/Home/TotalUsers";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-stretch mx-[3vw]">
        <div className="grid grid-cols-2 md:grid-cols-3 my-10 gap-8">
          <TotalSales />
          <TotalUsers />
          <TotalTransactions />
        </div>
      </div>
      <div className="grid mx-[3vw] gap-6 md:grid-cols-two-three mb-6">
        <RecentUsers />
        <LatestTransactions />
      </div>
    </Layout>
  );
}
