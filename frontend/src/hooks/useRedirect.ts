import { useEffect } from "react";
import { useHistory } from "react-router";

export function useRedirect(redirect: boolean, to: string) {
  const history = useHistory();
  useEffect(() => {
    if (redirect) history.push(to);
  }, [redirect, to, history]);
}
