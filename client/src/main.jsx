import "./index.css";

import { QueryClient, QueryClientProvider } from "react-query";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.render(
  <QueryClientProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById("root")
);
