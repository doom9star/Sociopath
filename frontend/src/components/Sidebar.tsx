import { Menu, MenuProps } from "antd";
import React from "react";
import { BsChatDots } from "react-icons/bs";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegNewspaper } from "react-icons/fa6";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { TbUserEdit } from "react-icons/tb";
import { TiWorldOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { useQueryData } from "../hooks/useQueryData";
import { INotification } from "../ts/types";
import Logo from "./Logo";
import { useModalFuncs } from "./Modals";
import Notifications from "./Notifications";
import Overlay from "./Overlay";

const menu: MenuProps["items"] = [
  {
    key: "feed",
    label: "Feed",
    icon: <FaRegNewspaper />,
  },
  {
    key: "new-post",
    label: "New Post",
    icon: <IoAddOutline />,
  },
  {
    key: "explore",
    label: "Explore",
    icon: <TiWorldOutline />,
  },
  {
    key: "chat",
    label: "Chat",
    icon: <BsChatDots />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <CiUser />,
  },
  {
    key: "edit-profile",
    label: "Edit Profile",
    icon: <TbUserEdit />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <HiOutlineCog8Tooth />,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { showLogout } = useModalFuncs();
  const { activeSidebarItem, setActiveSidebarItem } = useGlobalCtx();
  const [showNotifications, setShowNotifications] = React.useState(false);

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
      <div
        className="flex flex-col justify-between text-gray-600"
        style={{ height: "100vh", width: "20vw" }}
      >
        <div className="px-4">
          <Logo styles="my-8" />
          <Menu
            style={{ border: "none", width: "20vw" }}
            selectedKeys={[activeSidebarItem]}
            mode="inline"
            items={menu}
            onClick={(e) => {
              setActiveSidebarItem(e.key);
              navigate(`/home/${e.key}`);
            }}
          />
        </div>
        <ul className="w-full flex items-center justify-evenly mb-8 list-none">
          <li
            onClick={() => setShowNotifications(true)}
            className="cursor-pointer text-purple-800 rounded-full relative hover:opacity-80 text-3xl"
          >
            {notifications && unreadNotifications > 0 && (
              <span className="font-bold text-xs bg-red-600 text-white rounded-full px-1 absolute left-1 -top-1">
                {unreadNotifications}
              </span>
            )}
            <IoIosNotificationsOutline />
          </li>
          <li
            className="cursor-pointer text-purple-800 rounded-full hover:opacity-80 text-3xl"
            onClick={showLogout}
          >
            <CiLogout />
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default Sidebar;
