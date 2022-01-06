import LatestTransactions from "../components/Home/LatestTransactions";
import Layout from "../components/Layout";
import RecentUsers from "../components/Home/RecentUsers";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-stretch mx-[3vw]">
        <div className="grid grid-cols-3 my-10 gap-8">
          {[...new Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-5 bg-white shadow"
            >
              <p className="text-lg">Sales</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-semibold">$99,999</p>

                <i className="fas fa-arrow-up text-green-500"></i>
              </div>
              <p className="text-gray-500">Compared to last month</p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="grid mx-[3vw] gap-6"
        style={{ gridTemplateColumns: "2fr 3fr", gridAutoRows: "1fr" }}
      >
        <RecentUsers />
        <LatestTransactions />
      </div>
    </Layout>
  );
}
