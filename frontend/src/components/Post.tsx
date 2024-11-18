import classNames from "classnames";
import { produce } from "immer";
import React from "react";
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
  const [showOptionsBar, setShowOptionsBar] = React.useState(false);

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
        `flex flex-col mb-10 border border-gray-200 relative` +
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
            className="md:w-14 w-10 h-10 md:h-14 rounded-full"
          />
        </div>
        <span className="ml-2 text-gray-600 text-xs md:text-sm lg:text-lg font-bold">
          <i className="text-gray-400">@</i>
          <Link
            to={
              profile?.id === poster?.id
                ? "/home/profile"
                : "/home/user/" + poster?.id
            }
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {poster?.name}
          </Link>
        </span>
        <i
          className="fas fa-ellipsis-v ml-auto text-purple-500 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptionsBar(!showOptionsBar);
          }}
        />
        {showOptionsBar && (
          <div
            className="border border-gray-200 absolute text-xs right-6 top-14 font-semibold"
            style={{ fontFamily: "Josefin Sons" }}
          >
            {poster?.id === profile?.id && (
              <div
                className="py-2 px-6 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setShowOptionsBar(false);
                  showDeletePost(post.id);
                }}
              >
                <i className="far fa-trash-alt mr-2 text-red-400"></i>
                <span className="text-gray-500">Delete</span>
              </div>
            )}
            {poster?.id !== profile?.id && (
              <div className="py-2 px-6 cursor-pointer hover:bg-gray-100">
                <i className="fas fa-flag mr-2 text-yellow-500"></i>
                <span className="text-gray-500">Report</span>
              </div>
            )}
          </div>
        )}
      </div>
      {post.body && (
        <div className="mx-10 my-2">
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
        <div className="font-bold">
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
        <span className="text-gray-500 text-sm">
          <i className="fas fa-clock"></i> &nbsp;
          <ReactTimeAgo date={new Date(post.createdAt)} locale={"en-us"} />
        </span>
      </div>
    </div>
  );
}

export default Post;
