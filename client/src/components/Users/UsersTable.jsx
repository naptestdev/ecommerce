import { avatarAPI } from "../../shared/constant";
import { deleteUser } from "../../services/api/users";

export default function UsersTable({ data, refetch }) {
  const handleDeleteUser = (id) => {
    deleteUser(id).finally(() => {
      refetch();
    });
  };

  return (
    <div className="flex justify-center mx-[4vw]">
      <div className="w-full">
        <h1 className="text-2xl my-5">All Users</h1>
        <table className="table">
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Email verified</th>
            <th>Creation Date</th>
            <th>Actions</th>
          </tr>
          {data.map((user) => (
            <tr>
              <td>{user._id}</td>
              <td>
                <div className="flex items-center gap-2">
                  <img
                    className="w-7 h-7 rounded-full"
                    src={avatarAPI(user.username)}
                    alt=""
                  />
                  <p>{user.username}</p>
                </div>
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
        </table>
      </div>
    </div>
  );
}
