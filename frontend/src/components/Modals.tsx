import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { axios } from "../ts/constants";
import { IJsonResponse, IPost } from "../ts/types";
import Modal from "./custom/Modal";

interface IModalFuncs {
  showLogout: () => void;
  showDeletePost: (postId: string) => void;
}

const ModalContext = React.createContext({} as IModalFuncs);
export const useModalFuncs = () => React.useContext(ModalContext);

interface Props {
  children: JSX.Element;
}

export default function ModalsProvider({ children }: Props) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { setUserID } = useGlobalCtx();
  const [loading, setLoading] = React.useState(false);

  const [isLogoutActive, setLogoutActive] = React.useState(false);
  const logout = React.useCallback(async () => {
    setLoading(true);
    const { data } = await axios.delete<IJsonResponse>("/auth/logout");
    if (data.status === 200) {
      setLogoutActive(false);
      client.removeQueries(["me", "profile"]);
      setUserID(null);
      navigate("/");
      return;
    }
    setLoading(false);
  }, [navigate, client, setUserID]);

  const [isDeletePostActive, setDeletePostActive] = React.useState(false);
  const [deletePostID, setDeletePostID] = React.useState("");
  const delResult = useMutation(
    "delete",
    async () => {
      setLoading(true);
      const { data } = await axios.delete<IJsonResponse>(
        `/api/post/${deletePostID}`
      );
      return data;
    },
    {
      onSuccess: () => {
        setDeletePostActive(false);
        const protectedData = client.getQueryData<IPost[]>(["me", "protected"]);
        const privateData = client.getQueryData<IPost[]>(["me", "private"]);
        const postData = client.getQueryData<IPost>(deletePostID);

        if (protectedData)
          client.setQueryData(["me", "protected"], () =>
            protectedData.filter((p) => p.id !== deletePostID)
          );
        if (privateData)
          client.setQueryData(["me", "private"], () =>
            privateData.filter((p) => p.id !== deletePostID)
          );
        if (postData) client.removeQueries(deletePostID);
        if (window.location.href.includes(deletePostID)) navigate("/home/feed");
        setLoading(false);
      },
    }
  );

  return (
    <ModalContext.Provider
      value={{
        showLogout: () => setLogoutActive(true),
        showDeletePost: (postId) => {
          setDeletePostID(postId);
          setDeletePostActive(true);
        },
      }}
    >
      {isLogoutActive && (
        <Modal
          title="Logout"
          description="Are you sure you want to logout from your account?"
          onDismiss={() => setLogoutActive(false)}
          onSuccess={logout}
          loading={loading}
        />
      )}
      {isDeletePostActive && (
        <Modal
          title="Post Deletion"
          description="Are you sure you want to delete this post?"
          onDismiss={() => setDeletePostActive(false)}
          onSuccess={delResult.mutate}
          loading={loading}
        />
      )}
      {children}
    </ModalContext.Provider>
  );
}
