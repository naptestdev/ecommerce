import { avatarAPI } from "../../shared/constant";
import { deleteUser } from "../../services/api/users";

export default function UsersTable({ data, refetch }) {
  const handleDeleteUser = (id) => {
    deleteUser(id).finally(() => {
      refetch();
    });
  };

  return (
    <div className="mx-[4vw]">
      <h1 className="text-2xl my-5">All Users</h1>

      <div className="max-w-[92vw] lg:max-w-[calc(100vw-350px)] overflow-x-auto">
        <table className="table overflow-x-auto">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Email verified</th>
              <th>Creation Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  <img
                    className="w-7 h-7 rounded-full mr-2 inline"
                    src={avatarAPI(user.username)}
                    alt=""
                  />
                  <span>{user.username}</span>
                </td>
                <td>{user.email}</td>
                <td>{user.emailVerified ? "Yes" : "No"}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
