import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import { useIOListeners } from "../hooks/useIOListeners";
import { useNotifications } from "../hooks/useNotifications";
import { useTitle } from "../hooks/useTitle";
import Chat from "./Chat";
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
      <div className="flex flex-col px-4 w-full mx-auto md:w-3/4 relative mt-14">
        <Routes>
          <Route path={`feed`} element={<Feed />} />
          <Route path={`new-post`} element={<New />} />
          <Route path={`explore/`} element={<Explore />} />
          <Route path={`chat`} element={<Chat />} />
          <Route path={`profile`} element={<Profile />} />
          <Route path={`edit-profile`} element={<Edit />} />
          <Route
            path={`profile/:type(followers|following)`}
            element={<Follow />}
          />
          <Route path={`post/:postId`} element={<PostDetail />} />
          <Route path={`post/:postId/likes`} element={<Like />} />
          <Route path={`user/:pid`} element={<Profile />} />
          <Route
            path={`user/:pid/:type(followers|following)`}
            element={<Follow />}
          />
          <Route path={`settings`} element={<Settings />} />
          <Route path="*" element={<Navigate replace to={"/home/feed"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default HomeRouter;
