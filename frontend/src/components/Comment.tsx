import React from "react";
import { useQueryClient } from "react-query";
import { useComment } from "../hooks/useComment";
import { useQueryData } from "../hooks/useQueryData";
import { IComment, IPost, IProfile } from "../ts/types";
import Button from "./custom/Button";
import { produce } from "immer";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";

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
    <div className="flex mt-8">
      <div
        className="rounded-full border-2 border-gray-300 p-1"
        style={{ width: "4rem", height: "4rem", minWidth: "4rem" }}
      >
        <img
          src={poster.avatar ? poster.avatar.url : "/noImg.jpg"}
          alt="profileImage"
          className="rounded-full object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col ml-4 w-full">
        <div className="flex items-center justify-between">
          <span className="ml-2 text-gray-600 text-xs md:text-sm lg:text-lg font-bold">
            <i className="text-gray-400">@</i>
            <Link
              to={
                profile?.id === poster?.id
                  ? "/home/profile"
                  : "/home/user/" + poster?.id
              }
              className="hover:underline"
            >
              {poster?.name}
            </Link>
          </span>
          <p className="text-gray-400 font-bold text-xs">
            <ReactTimeAgo date={new Date(comment.createdAt)} locale={"en-us"} />
          </p>
        </div>
        <span className="text-gray-500 text-sm m-4">{comment.body}</span>
        {showReply ? (
          <>
            <textarea
              placeholder="Write a reply..."
              className="p-4 my-2 w-full outline-none border-2 text-xs text-gray-700"
              style={{ fontFamily: "cursive" }}
              autoFocus={true}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            ></textarea>
            <div className="flex">
              <div className="w-24">
                <Button
                  label="Post"
                  styles="border border-purple-500 text-purple-500 hover:opacity-80"
                  loading={replyResult.isLoading}
                  spinnerStyle="border-purple-800 left-0"
                  icon={<i className="fas fa-paper-plane mr-2" />}
                  buttonProps={{
                    onClick: () =>
                      replyResult.mutate({
                        postId: post.id,
                        body: replyBody,
                        pcid: comment.id,
                      }),
                  }}
                />
              </div>
              <div className="w-24">
                <Button
                  icon={<i className="fas fa-times mr-2" />}
                  label="Cancel"
                  styles="border border-red-500 text-red-500 hover:opacity-80 ml-2"
                  buttonProps={{
                    onClick: () => setShowReply(false),
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex mt-4">
            {!isReply && (
              <div className="w-24">
                <Button
                  icon={<i className="fas fa-comment-dots mr-2" />}
                  label="Reply"
                  styles="border border-purple-500 text-purple-500 hover:opacity-80"
                  buttonProps={{
                    onClick: () => setShowReply(true),
                  }}
                />
              </div>
            )}
            {!isReply && comment.children?.length > 0 && (
              <div className="ml-10">
                <Button
                  icon={
                    <i
                      className={`fas fa-arrow-${
                        !showReplies ? "down" : "up"
                      } mr-2`}
                    />
                  }
                  label={`${comment.children?.length || 0} replies`}
                  styles="text-gray-400 hover:opacity-80"
                  buttonProps={{
                    onClick: () => setShowReplies(!showReplies),
                  }}
                />
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
