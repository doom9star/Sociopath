import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { produce } from "immer";
import React from "react";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useComment } from "../hooks/useComment";
import { useQueryData } from "../hooks/useQueryData";
import { IComment, IPost, IProfile } from "../ts/types";

interface CommentProps {
  comment: IComment;
  post: IPost;
  isReply?: boolean;
}

export default function Comment({ comment, post, isReply }: CommentProps) {
  const profile = useQueryData<IProfile>(["me", "profile"]);
  const poster = comment.profile.id === profile?.id ? profile : comment.profile;
  const client = useQueryClient();

  const [showReply, setShowReply] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  const [replyBody, setReplyBody] = React.useState("");

  const replyResult = useComment(({ updater }) => {
    setReplyBody("");
    setShowReply(false);
    if (!showReplies) setShowReplies(true);
    if (client.getQueryData([comment.profile.id, "private"]))
      client.setQueryData<IPost[]>([comment.profile.id, "private"], (old) =>
        produce(old!, (draft) => {
          const idx = draft.findIndex((p) => p.id === comment.post.id);
          draft[idx] = updater(draft[idx]);
        })
      );
  });

  return (
    <div className="flex my-8">
      <div
        className="rounded-full border-2 border-gray-200"
        style={{ padding: "2px" }}
      >
        <img
          src={poster?.avatar ? poster?.avatar.url : "/noImg.jpg"}
          alt="profileImage"
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex flex-col ml-2 w-full">
        <div className="flex items-center justify-between">
          <span className="ml-2 text-sm">
            <i className="text-gray-400">@</i>
            <Link
              to={
                profile?.id === poster?.id
                  ? "/home/profile"
                  : "/home/user/" + poster?.id
              }
              className="no-underline hover:underline text-gray-600"
            >
              {poster?.name}
            </Link>
          </span>
          <p className="text-gray-400 text-xs">
            <ReactTimeAgo date={new Date(comment.createdAt)} locale={"en-us"} />
          </p>
        </div>
        <span className="text-gray-500 text-sm m-3">{comment.body}</span>
        {showReply ? (
          <>
            <TextArea
              rows={3}
              placeholder="Write a reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            />
            <div className="flex mt-2">
              <Button
                loading={replyResult.isLoading}
                onClick={() =>
                  replyResult.mutate({
                    postId: post.id,
                    body: replyBody,
                    pcid: comment.id,
                  })
                }
              >
                Post
              </Button>
              <Button className="ml-4" onClick={() => setShowReply(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="flex mt-4">
            {!isReply && (
              <div className="w-24">
                <Button onClick={() => setShowReply(true)}>Reply</Button>
              </div>
            )}
            {!isReply && comment.children?.length > 0 && (
              <div>
                <Button
                  icon={
                    <i
                      className={`fas fa-arrow-${
                        !showReplies ? "down" : "up"
                      } mr-2`}
                    />
                  }
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {`${comment.children?.length || 0} replies`}
                </Button>
              </div>
            )}
          </div>
        )}
        {showReplies &&
          (comment.children || []).map((cc) => (
            <Comment comment={cc} key={cc.id} post={post} isReply={true} />
          ))}
      </div>
    </div>
  );
}
