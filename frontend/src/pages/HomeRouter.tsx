import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "../components/Profile";
import { PrivateRoute } from "../components/Route";
import Sidebar from "../components/Sidebar";
import { useIOListeners } from "../hooks/useIOListeners";
import { useNotifications } from "../hooks/useNotifications";
import { useTitle } from "../hooks/useTitle";
import Edit from "./Edit";
import Explore from "./Explore";
import Feed from "./Feed";
import Follow from "./Follow";
import Like from "./Like";
import New from "./New";
import PostDetail from "./PostDetail";
import Settings from "./Settings";

function HomeRouter() {
  useTitle("Home");
  useIOListeners();
  useNotifications();

  return (
    <div className="flex">
      <Sidebar />
      <div
        className="no-scrollbar flex flex-col px-4 w-full mx-auto md:w-3/4 relative pt-14"
        style={{
          height: "100vh",
          overflowY: "scroll",
        }}
      >
        <Routes>
          <Route path={`feed`} element={<PrivateRoute children={<Feed />} />} />
          <Route
            path={`new-post`}
            element={<PrivateRoute children={<New />} />}
          />
          <Route
            path={`explore/`}
            element={<PrivateRoute children={<Explore />} />}
          />
          <Route
            path={`profile`}
            element={<PrivateRoute children={<Profile />} />}
          />
          <Route
            path={`edit-profile`}
            element={<PrivateRoute children={<Edit />} />}
          />
          <Route
            path={`profile/:type`}
            element={<PrivateRoute children={<Follow />} />}
          />
          <Route
            path={`post/:postId`}
            element={<PrivateRoute children={<PostDetail />} />}
          />
          <Route
            path={`post/:postId/likes`}
            element={<PrivateRoute children={<Like />} />}
          />
          <Route
            path={`user/:pid`}
            element={<PrivateRoute children={<Profile />} />}
          />
          <Route
            path={`user/:pid/:type`}
            element={<PrivateRoute children={<Follow />} />}
          />
          <Route
            path={`settings`}
            element={<PrivateRoute children={<Settings />} />}
          />
          <Route path="*" element={<Navigate replace to={"/home/feed"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default HomeRouter;
