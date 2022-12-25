import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { useQueryData } from "../hooks/useQueryData";
import { INotification } from "../ts/types";
import Logo from "./Logo";
import { useModalFuncs } from "./Modals";
import Notifications from "./Notifications";
import Overlay from "./Overlay";

type TItems = { name: string; icon: string; children: TItems | null }[];
const items: TItems = [
  {
    name: "feed",
    icon: "fas fa-users",
    children: [
      {
        name: "new",
        icon: "fas fa-plus-circle",
        children: null,
      },
    ],
  },
  {
    name: "world",
    icon: "fas fa-globe-americas",
    children: null,
  },
  {
    name: "chat",
    icon: "fas fa-paper-plane",
    children: null,
  },
  {
    name: "profile",
    icon: "fas fa-user",
    children: [{ name: "edit", icon: "fas fa-pen", children: null }],
  },
  {
    name: "settings",
    icon: "fas fa-cog",
    children: null,
  },
];

const Items: React.FC<{}> = () => {
  const { activeSidebarItem, setActiveSidebarItem } = useGlobalCtx();

  const _: React.FC<{ preurl?: string; _items: TItems }> = ({
    preurl = "/home",
    _items,
  }) => {
    return (
      <>
        {_items.map((i) => {
          const url = `${preurl}/${i.name}`;
          const pad = (preurl.split("/").length - 2) * 6;
          return (
            <React.Fragment key={url}>
              <div
                className={
                  `pb-${preurl !== "/home" && !i.children ? 4 : 0} ml-${pad}` +
                  classNames({ " flex items-center": !!i.children })
                }
              >
                <Link
                  to={url}
                  onClick={() => setActiveSidebarItem(i.name)}
                  className={
                    "py-2 px-2 flex w-full justify-between rounded-lg cursor-pointer items-center hover:bg-white transition-all duration-300" +
                    classNames({
                      " bg-white": activeSidebarItem === i.name,
                    })
                  }
                >
                  <span className="flex items-center text-sm">
                    <i className={`${i.icon} w-5`}></i>
                    <span className="ml-2 opacity-70">
                      {i.name[0].toUpperCase() + i.name.slice(1)}
                    </span>
                  </span>
                </Link>
              </div>
              {i.children && <_ _items={i.children} preurl={url} />}
            </React.Fragment>
          );
        })}
      </>
    );
  };
  return <_ _items={items} />;
};

function Sidebar() {
  const { showLogout } = useModalFuncs();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const barRef = React.useRef<HTMLDivElement | null>(null);

  const notifications = useQueryData<INotification[]>("notifications");
  const unreadNotifications = React.useMemo(() => {
    let count = 0;
    if (!notifications) return count;
    for (const n of notifications) {
      if (n.read) break;
      count++;
    }
    return count;
  }, [notifications]);
  const hideNotifications = React.useCallback(() => {
    setShowNotifications(false);
  }, []);

  return (
    <React.Fragment>
      {showNotifications && (
        <Overlay onClick={() => setShowNotifications(false)}>
          <Notifications hide={hideNotifications} />
        </Overlay>
      )}
      {isOpen ? (
        <>
          <div
            style={{ height: "100vh", minWidth: "350px", width: "350px" }}
          ></div>
          <div
            className="bg-gray-100 flex flex-col justify-between animate-slideRight text-gray-600 fixed"
            style={{ height: "100vh", minWidth: "350px", width: "350px" }}
            ref={barRef}
          >
            <div className="px-4 pt-4" style={{ fontFamily: "monospace" }}>
              <Logo styles="mb-8" />
              <Items />
            </div>
            <div className="px-4 py-2">
              <ul className="w-full flex items-center justify-evenly">
                <li
                  onClick={() => setShowNotifications(true)}
                  className="cursor-pointer text-purple-800 px-3 py-2 rounded-full relative hover:opacity-80"
                >
                  {notifications && unreadNotifications > 0 && (
                    <span className="font-bold text-xs bg-red-600 text-white rounded-full px-1 absolute left-1 -top-1">
                      {unreadNotifications}
                    </span>
                  )}
                  <i className="far fa-bell"></i>
                </li>
                <li
                  className="cursor-pointer text-purple-800 px-3 py-2 rounded-full hover:opacity-80"
                  onClick={showLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                </li>
              </ul>
            </div>
            <div
              className="absolute p-2 top-1 right-1 text-purple-500 cursor-pointer z-20"
              onClick={() => {
                barRef.current!.classList.add("animate-slideLeft");
                setTimeout(() => {
                  setIsOpen(!isOpen);
                }, 80);
              }}
            >
              <i className="fas fa-times-circle text-sm" />
            </div>
          </div>
        </>
      ) : (
        <div
          className="absolute top-5 left-5 text-purple-500 cursor-pointer z-20"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <span className="relative">
            {unreadNotifications > 0 && (
              <i
                className="fas fa-circle text-red-600 absolute top-0 left-1"
                style={{ fontSize: "0.5rem" }}
              />
            )}
            <i className={`fas fa-bars text-lg`}></i>
          </span>
        </div>
      )}
    </React.Fragment>
  );
}

export default Sidebar;
