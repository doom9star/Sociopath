import { produce } from "immer";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Comment from "../components/Comment";
import Button from "../components/custom/Button";
import Spinner from "../components/custom/Spinner";
import Post from "../components/Post";
import { useGlobalCtx } from "../context";
import { useComment } from "../hooks/useComment";
import { axios } from "../ts/constants";
import { IComment, IJsonResponse, IPost } from "../ts/types";

function PostDetail() {
  const params = useParams();
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
        <BackButton />
        <Post post={data} showDetailOnClick={false} />
        <div className="mb-4">
          <textarea
            placeholder="Write a comment..."
            className="p-4 mb-2 w-full outline-none border-2 text-sm text-gray-700"
            style={{ fontFamily: "Josefin Sons" }}
            autoFocus={true}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          ></textarea>
          <div className="w-24 ml-auto">
            <Button
              label="Post"
              icon={<i className="fas fa-envelope mr-2" />}
              styles="bg-purple-500 text-gray-100 hover:bg-purple-700"
              loading={commentResult.isLoading}
              buttonProps={{
                onClick: () =>
                  commentResult.mutate({ postId: data.id, body: commentBody }),
                disabled: commentBody.trim() === "",
              }}
            />
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
