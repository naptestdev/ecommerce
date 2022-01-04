import { Navigate, useLocation } from "react-router-dom";

import { useStore } from "../store";

export default function PrivateRoute({ children }) {
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();

  if (!currentUser)
    return (
      <Navigate
        to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`}
      />
    );

  return <>{children}</>;
}
