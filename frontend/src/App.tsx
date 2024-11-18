import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./components/custom/Spinner";
import { PublicRoute } from "./components/Route";
import { useGlobalCtx } from "./context";
import { useProfile } from "./hooks/useProfile";
import HomeRouter from "./pages/HomeRouter";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModalsProvider from "./components/Modals";

function App() {
  const { isFetching, isLoading, data } = useProfile("me");
  const { setUserID } = useGlobalCtx();

  React.useEffect(() => {
    if (data) setUserID(data.id);
  }, [data, setUserID]);

  if (isLoading || isFetching) return <Spinner />;

  return (
    <BrowserRouter>
      <ModalsProvider>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="login" element={<PublicRoute children={<Login />} />} />
          <Route
            path="register"
            element={<PublicRoute children={<Register />} />}
          />
          <Route path="home/*" element={<HomeRouter />} />
          <Route path="*" element={<Navigate replace to={"/"} />} />
        </Routes>
      </ModalsProvider>
    </BrowserRouter>
  );
}

export default App;
