import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  return query;
};
