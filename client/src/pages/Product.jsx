import ReactLoading from "react-loading";
import axios from "../services/axios";
import { useParams } from "react-router-dom";

export default function Product() {
  const { id } = useParams();
  return (
    <div>
      <ReactLoading type="spin" color="#2874F0" width={40} height={40} />
    </div>
  );
}
