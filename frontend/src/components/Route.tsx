import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { useQueryData } from "../hooks/useQueryData";
import { IProfile } from "../ts/types";

type Props = {
  children: any;
};

export const PrivateRoute: React.FC<Props> = (props) => {
  const profile = useQueryData<IProfile>(["me", "profile"]);
  const { pathname } = useLocation();
  const { setActiveSidebarItem } = useGlobalCtx();

  useEffect(() => {
    setActiveSidebarItem(pathname.split("/").slice(-1)[0]);
  }, [pathname, setActiveSidebarItem]);

  if (!profile) {
    return <Navigate replace to="/" />;
  }

  return props.children;
};

export const PublicRoute: React.FC<Props> = (props) => {
  const profile = useQueryData<IProfile>(["me", "profile"]);

  if (profile) {
    return <Navigate replace to="/home/feed" />;
  }
  return props.children;
};
