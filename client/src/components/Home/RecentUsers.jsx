import { Link } from "react-router-dom";
import Skeleton from "../Skeleton";
import { avatarAPI } from "../../shared/constant";
import { getRecentUsers } from "../../services/api/home";
import useSWR from "swr";

export default function RecentUsers() {
  const { data } = useSWR("home-recent-users", () => getRecentUsers());

  return (
    <div className="bg-white shadow p-4 md:h-[350px]">
      <h1 className="text-2xl mb-3">New Users</h1>

      {data ? (
        <div className="flex flex-col items-stretch gap-3">
          {data.map((user) => (
            <div
              key={user._id}
              className="flex justify-between gap-3 h-10 items-center"
            >
              <img
                className="w-7 h-7 rounded-full flex-shrink-0"
                src={avatarAPI(user.username)}
                alt=""
              />
              <div className="flex-grow">
                <p>{user.username}</p>
              </div>

              <Link
                to="/users"
                className="flex-shrink-0 flex items-center gap-1 text-primary"
              >
                <span>View</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-stretch gap-3">
          {[...new Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}
    </div>
  );
}
