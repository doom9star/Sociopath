import { Button } from "antd";
import classNames from "classnames";
import { produce } from "immer";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useGlobalCtx } from "../context";
import { useLike } from "../hooks/useLike";
import { useQueryData } from "../hooks/useQueryData";
import { IPost, IProfile } from "../ts/types";
import { useModalFuncs } from "./Modals";

interface Props {
  post: IPost;
  postedBy?: IProfile;
  showDetailOnClick?: boolean;
}

function Post({ post, showDetailOnClick = true, postedBy }: Props) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { userID } = useGlobalCtx();
  const { showDeletePost } = useModalFuncs();

  const [isHovering, setIsHovering] = React.useState(false);

  const profile = useQueryData<IProfile>(["me", "profile"]);
  const poster = post.profile ? post.profile : postedBy;

  const likResult = useLike(({ updater }) => {
    const posterID = poster?.id !== userID ? poster?.id : "me";
    if (client.getQueryData([posterID, "private"]))
      client.setQueryData<IPost[]>([posterID, "private"], (old) =>
        produce(old!, (draft) => {
          const idx = draft.findIndex((p) => p.id === post.id);
          draft[idx] = updater(draft[idx]);
        })
      );
  });

  return (
    <div
      className={
        `flex flex-col mb-10 border border-solid rounded-lg border-gray-200 relative` +
        classNames({
          " cursor-pointer": showDetailOnClick,
        })
      }
      onClick={() => {
        if (showDetailOnClick) {
          navigate(`/home/post/${post.id}`);
          document.body.scrollTo({ top: 200, behavior: "smooth" });
        }
      }}
    >
      <div className="flex items-center p-4">
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
        <span className="ml-2 text-xs">
          <i className="text-gray-400">@</i>
          <Link
            to={
              profile?.id === poster?.id
                ? "/home/profile"
                : "/home/user/" + poster?.id
            }
            className="text-gray-600 no-underline hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {poster?.name}
          </Link>
        </span>
        {poster?.id === profile?.id && (
          <Button
            className="ml-auto"
            icon={<MdDeleteOutline />}
            onClick={(e) => {
              e.stopPropagation();
              showDeletePost(post.id);
            }}
          />
        )}
      </div>
      {post.body && (
        <div className="mx-10 my-4">
          <span className="text-gray-600 text-sm break-words whitespace-pre-wrap">
            {post.body}
          </span>
        </div>
      )}
      {post.images.length > 0 && (
        <div
          className={`my-10 w-full sm:w-3/4 py-2 sm:mx-auto overflow-x-${
            post.images.length > 1 ? "scroll" : "hidden"
          } flex items-center`}
        >
          {post.images.map((i, idx) => (
            <img
              key={idx}
              src={i.url}
              alt={i.id}
              className="object-contain w-full min-w-full h-52 sm:h-96"
            />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center px-10 py-4">
        <div>
          <span className="text-gray-600 mr-6 cursor-pointer">
            <i
              className={
                "fa-heart text-red-600" +
                classNames({
                  " far": !post.isLiked,
                  " fas": post.isLiked || isHovering,
                })
              }
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={(e) => {
                e.stopPropagation();
                likResult.mutate({
                  value: post.isLiked ? -1 : 1,
                  postId: post.id,
                  poster: poster!.id,
                });
              }}
            ></i>{" "}
            &nbsp;
            <span
              className="hover:underline text-xs"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/home/post/${post.id}/likes`);
              }}
            >
              {post.likes} {post.likes > 1 ? "likes" : "like"}
            </span>
          </span>
          <span className="text-gray-600 cursor-pointer">
            <i className="far fa-comments"></i> &nbsp;{" "}
            <span className="hover:underline text-xs">
              {Array.isArray(post.comments)
                ? post.comments.length
                : post.comments}{" "}
              {(Array.isArray(post.comments)
                ? post.comments.length
                : post.comments) > 1
                ? "comments"
                : "comment"}
            </span>
          </span>
        </div>
        <span className="text-gray-500 text-xs">
          <ReactTimeAgo date={new Date(post.createdAt)} locale={"en-us"} />
        </span>
      </div>
    </div>
  );
}

export default Post;
