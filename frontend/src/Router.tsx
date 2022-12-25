import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  RouteProps,
  useLocation,
} from "react-router-dom";
import Spinner from "./components/custom/Spinner";
import { useProfile } from "./hooks/useProfile";
import HomeRouter from "./pages/HomeRouter";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Modals from "./components/Modals";
import { useGlobalCtx } from "./context";
import { useRedirect } from "./hooks/useRedirect";
import { useQueryData } from "./hooks/useQueryData";
import { IProfile } from "./ts/types";

export function PrivateRoute(props: RouteProps) {
  const profile = useQueryData<IProfile>(["me", "profile"]);
  const { pathname } = useLocation();
  const { setActiveSidebarItem } = useGlobalCtx();
  useRedirect(!profile, "/");

  setActiveSidebarItem(pathname.split("/").slice(-1)[0]);

  return <Route {...props} />;
}

export function PublicRoute(props: RouteProps) {
  const profile = useQueryData<IProfile>(["me", "profile"]);
  useRedirect(!!profile, "/home/feed");
  return <Route {...props} />;
}

function Router() {
  const { isFetching, isLoading, data } = useProfile("me");
  const { setUserID } = useGlobalCtx();

  React.useEffect(() => {
    if (data) setUserID(data.id);
  }, [data, setUserID]);

  if (isLoading || isFetching) return <Spinner />;

  return (
    <BrowserRouter>
      <Modals>
        <Switch>
          <Route exact path="/" component={Landing} />
          <PublicRoute exact path="/login" component={Login} />
          <PublicRoute exact path="/register" component={Register} />
          <PrivateRoute path="/home" component={HomeRouter} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Modals>
    </BrowserRouter>
  );
}

export default Router;
