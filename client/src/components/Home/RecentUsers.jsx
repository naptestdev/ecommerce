import { avatarAPI } from "../../shared/constant";
import { getRecentUsers } from "../../services/api/home";
import useSWR from "swr";

export default function RecentUsers() {
  const { data } = useSWR("home-recent-users", () => getRecentUsers());

  if (!data) return <div>Loading</div>;

  return (
    <div className="bg-white shadow p-4">
      <h1 className="text-2xl mb-3">New Users</h1>

      <div className="flex flex-col items-stretch gap-3">
        {data.map((user) => (
          <div key={user._id} className="flex justify-between gap-3">
            <img
              className="w-7 h-7 rounded-full flex-shrink-0"
              src={avatarAPI(user.username)}
              alt=""
            />
            <div className="flex-grow">
              <p>{user.username}</p>
            </div>

            <button className="flex-shrink-0 flex items-center gap-1 text-primary">
              <span>View</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
