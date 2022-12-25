import React from "react";
import ReactDOM from "react-dom";
import Router from "./Router";
import "./index.css";
import { QueryClientProvider, QueryClient } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import GlobalProvider from "./context";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <GlobalProvider>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        <Router />
      </GlobalProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
