import ExportDropdown from "../ExportDropdown";
import { avatarAPI } from "../../shared/constant";
import { deleteUser } from "../../services/users";

export default function UsersTable({ data, refetch }) {
  const handleDeleteUser = (id) => {
    deleteUser(id).finally(() => {
      refetch();
    });
  };

  return (
    <div className="mx-[4vw]">
      <div className="flex justify-between my-5">
        <h1 className="text-2xl">Tất cả người dùng</h1>

        <ExportDropdown type="users" />
      </div>

      <div className="max-w-[92vw] lg:max-w-[calc(100vw-350px)] overflow-x-auto">
        <table className="table overflow-x-auto">
          <thead>
            <tr>
              <th>ID người dùng</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Email đã xác nhận</th>
              <th>Tạo vào lúc</th>
              <th>Hành động</th>
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
                <td>{user.emailVerified ? "Có" : "Không"}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500"
                  >
                    Xoá
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
