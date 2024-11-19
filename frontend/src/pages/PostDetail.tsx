import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { produce } from "immer";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Spinner from "../components/custom/Spinner";
import Post from "../components/Post";
import { useGlobalCtx } from "../context";
import { useComment } from "../hooks/useComment";
import { axios } from "../ts/constants";
import { IComment, IJsonResponse, IPost } from "../ts/types";

function PostDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { userID } = useGlobalCtx();
  const { isLoading, isFetching, data } = useQuery(
    [params.postId, "detail"],
    async () => {
      const { data } = await axios.get<IJsonResponse<IPost>>(
        "/api/post/" + params.postId
      );
      return data.body;
    },
    {
      refetchOnMount: "always",
    }
  );
  const [commentBody, setCommentBody] = React.useState("");
  const commentResult = useComment(({ updater, comment }) => {
    setCommentBody("");
    const pid = data?.profile.id === userID ? "me" : data?.profile.id;
    if (client.getQueryData([pid, "private"]))
      client.setQueryData<IPost[]>([pid, "private"], (old) =>
        produce(old!, (draft) => {
          const idx = draft.findIndex((p) => p.id === comment.post.id);
          draft[idx] = updater(draft[idx]);
        })
      );
  });

  if (isLoading || isFetching) return <Spinner />;

  if (data)
    return (
      <React.Fragment>
        <Button
          icon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          className="mb-4"
        />
        <Post post={data} showDetailOnClick={false} />
        <div className="mb-4">
          <TextArea
            rows={5}
            placeholder="Write a comment..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <div className="flex justify-end my-2">
            <Button
              loading={commentResult.isLoading}
              onClick={() =>
                commentResult.mutate({ postId: data.id, body: commentBody })
              }
              disabled={commentBody.trim() === ""}
            >
              Post
            </Button>
          </div>
          {(data.comments as IComment[]).map((c) => (
            <Comment comment={c} key={c.id} post={data} />
          ))}
        </div>
      </React.Fragment>
    );

  return null;
}

export default PostDetail;
