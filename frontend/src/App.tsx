import { ConfigProvider, Spin } from "antd";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ModalsProvider from "./components/Modals";
import { PublicRoute } from "./components/Route";
import { useGlobalCtx } from "./context";
import { useProfile } from "./hooks/useProfile";
import HomeRouter from "./pages/HomeRouter";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { colors } from "./ts/constants";

function App() {
  const { isFetching, isLoading, data } = useProfile("me");
  const { setUserID } = useGlobalCtx();

  React.useEffect(() => {
    if (data) setUserID(data.id);
  }, [data, setUserID]);

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.primary,
          },
        }}
      >
        {isLoading || isFetching ? (
          <div
            className="flex justify-center items-center"
            style={{ width: "100vw", height: "100vh" }}
          >
            <Spin />
          </div>
        ) : (
          <ModalsProvider>
            <Routes>
              <Route index element={<Landing />} />
              <Route
                path="login"
                element={<PublicRoute children={<Login />} />}
              />
              <Route
                path="register"
                element={<PublicRoute children={<Register />} />}
              />
              <Route path="home/*" element={<HomeRouter />} />
              <Route path="*" element={<Navigate replace to={"/"} />} />
            </Routes>
          </ModalsProvider>
        )}
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
