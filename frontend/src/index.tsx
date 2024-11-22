import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import GlobalProvider from "./context";
import "./index.css";

TimeAgo.addDefaultLocale(en);

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <QueryClientProvider client={client}>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </QueryClientProvider>
);
