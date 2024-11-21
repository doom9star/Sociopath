import { Navigate } from "react-router-dom";
import { useQueryData } from "../hooks/useQueryData";
import { IProfile } from "../ts/types";

type Props = {
  children: any;
};

export const PrivateRoute: React.FC<Props> = (props) => {
  const profile = useQueryData<IProfile>(["me", "profile"]);

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
