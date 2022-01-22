import Spin from "react-cssfx-loading/lib/Spin";
import { useStore } from "../store";

export default function PrivateRoute({ children }) {
  const currentUser = useStore((state) => state.currentUser);

  if (typeof currentUser === "undefined")
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin />
      </div>
    );

  if (!currentUser)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-10">
        <img
          className="h-[200px] w-[200px] object-cover"
          src="/sign-in.svg"
          alt=""
        />
        <h1 className="text-2xl">You need to sign in</h1>
      </div>
    );

  return <>{children}</>;
}
