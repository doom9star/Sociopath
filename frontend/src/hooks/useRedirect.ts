import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirect(redirect: boolean, to: string) {
  const navigate = useNavigate();

  useEffect(() => {
    if (redirect) navigate(to);
  }, [redirect, to, navigate]);
}
