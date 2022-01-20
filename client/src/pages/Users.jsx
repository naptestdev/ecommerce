import Layout from "../components/Layout";
import Spin from "react-cssfx-loading/lib/Spin";
import UsersTable from "../components/Users/UsersTable";
import { getAllUsers } from "../services/api/users";
import useSWR from "swr";

export default function Users() {
  const { data, error, mutate } = useSWR("all-users", () => getAllUsers());

  return (
    <Layout>
      {error ? (
        <div className="flex-grow flex flex-col justify-center items-center gap-3">
          <img className="w-36 h-36 object-cover" src="/error.png" alt="" />
          <p className="text-2xl">Something went wrong</p>
        </div>
      ) : !data ? (
        <div className="flex-grow flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <UsersTable refetch={mutate} data={data} />
      )}
    </Layout>
  );
}
