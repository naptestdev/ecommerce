import Layout from "../components/Layout";
import UsersTable from "../components/Users/UsersTable";
import { getAllUsers } from "../services/api/users";
import useSWR from "swr";

export default function Users() {
  const { data, error, mutate } = useSWR("all-users", () => getAllUsers());
  return (
    <Layout>
      {!data ? <div>Loading</div> : <UsersTable refetch={mutate} data={data} />}
    </Layout>
  );
}
