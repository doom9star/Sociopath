import React from "react";
import { Route, Switch, Redirect, RouteComponentProps } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTitle } from "../hooks/useTitle";
import Feed from "./Feed";
import World from "./World";
import New from "./New";
import Edit from "./Edit";
import Profile from "../components/Profile";
import Follow from "./Follow";
import PostDetail from "./PostDetail";
import Settings from "./Settings";
import { useIOListeners } from "../hooks/useIOListeners";
import { useNotifications } from "../hooks/useNotifications";
import Like from "./Like";
import Chat from "./Chat";

function HomeRouter({ match: { path } }: RouteComponentProps) {
  useTitle("Home");
  useIOListeners();
  useNotifications();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col px-4 w-full mx-auto md:w-3/4 relative mt-14">
        <Switch>
          <Route exact path={`${path}/feed`} component={Feed} />
          <Route exact path={`${path}/feed/new`} component={New} />
          <Route exact path={`${path}/world/`} component={World} />
          <Route exact path={`${path}/chat`} component={Chat} />
          <Route exact path={`${path}/profile`} component={Profile} />
          <Route exact path={`${path}/profile/edit`} component={Edit} />
          <Route
            exact
            path={`${path}/profile/(followers|following)`}
            component={Follow}
          />
          <Route exact path={`${path}/post/:postId`} component={PostDetail} />
          <Route exact path={`${path}/post/:postId/likes`} component={Like} />
          <Route exact path={`${path}/user/:pid`} component={Profile} />
          <Route
            exact
            path={`${path}/user/:pid/(followers|following)`}
            component={Follow}
          />
          <Route exact path={`${path}/settings`} component={Settings} />
          <Redirect from={path} to={`${path}/feed`} />
        </Switch>
      </div>
    </div>
  );
}

export default HomeRouter;
