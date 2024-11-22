import React from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { useQueryData } from "../hooks/useQueryData";
import { socket } from "../socket";
import { INotification, IProfile, NotificationType } from "../ts/types";

type Props = {
  hide: () => void;
};

const Notifications: React.FC<Props> = ({ hide }) => {
  const notifications = useQueryData<INotification[]>("notifications");
  const profile = useQueryData<IProfile>(["me", "profile"]);

  React.useEffect(() => {
    if (notifications) {
      const unreadIDs: string[] = [];
      for (const n of notifications) {
        if (n.read) break;
        unreadIDs.push(n.id);
      }
      socket.emit("notifications:read", unreadIDs);
    }
  }, [notifications]);

  return (
    <div
      style={{ width: "400px", height: "500px", bottom: "8%", left: "9.5%" }}
      className="fixed no-scrollbar py-8 bg-gray-50 rounded-2xl overflow-y-scroll z-50 shadow-md"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <p className="text-center mb-2 font-semibold text-gray-500 text-sm">
        <i className="fas fa-bell text-2xl text-purple-600" />
      </p>
      <div>
        {notifications?.map((n) => {
          return (
            <Link
              to={
                n.type === NotificationType.FOLLOW
                  ? `/home/user/${n.creator?.id}`
                  : n.type === NotificationType.LIKE ||
                    n.type === NotificationType.COMMENT ||
                    n.type === NotificationType.REPLY
                  ? `/home/post/${n.post?.id}`
                  : "#"
              }
              onClick={hide}
              key={n.id}
              className="no-underline w-full bg-gray-50 flex items-center my-1 py-2 cursor-pointer hover:bg-white"
            >
              <img
                src={
                  n.type === NotificationType.ADMIN
                    ? "/logo.png"
                    : n.creator?.avatar
                    ? n.creator.avatar.url
                    : "/noImg.jpg"
                }
                alt="avatar"
                className="p-2 w-14 h-14 rounded-full object-contain"
              />
              <div className="flex flex-col w-3/4 px-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-600">
                    <span className="font-bold text-gray-800 text-base">
                      @
                      {n.type === NotificationType.ADMIN
                        ? profile?.name
                        : n.creator?.name}
                    </span>{" "}
                    {n.type === NotificationType.FOLLOW
                      ? "started following you!"
                      : n.type === NotificationType.COMMENT
                      ? "commented on your post!"
                      : n.type === NotificationType.LIKE
                      ? "liked your post!"
                      : n.type === NotificationType.REPLY
                      ? "replied to your comment!"
                      : n.type === NotificationType.ADMIN
                      ? ", we welcome you to our social world!"
                      : null}
                  </p>
                  {n.post && n.post.images.length > 0 && (
                    <img
                      src={n.post.images[0].url}
                      alt="avatar"
                      className="ml-2 w-10 h-10 m-4"
                    />
                  )}
                </div>
                <p className="text-xs text-right text-gray-400 font-bold">
                  <ReactTimeAgo date={new Date(n.createdAt)} locale={"en-us"} />
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
