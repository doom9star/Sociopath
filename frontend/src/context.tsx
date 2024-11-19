import React from "react";
import { WorldPostType } from "./ts/types";

type TGlobalCtx = {
  userID: string | null;
  setUserID: React.Dispatch<React.SetStateAction<string | null>>;
  wpt: WorldPostType;
  setWPT: React.Dispatch<React.SetStateAction<WorldPostType>>;
  activeSidebarItem: string;
  setActiveSidebarItem: React.Dispatch<React.SetStateAction<string>>;
};
const GlobalCtx = React.createContext({} as TGlobalCtx);

export const useGlobalCtx = () => React.useContext(GlobalCtx);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [userID, setUserID] = React.useState<string | null>(null);
  const [wpt, setWPT] = React.useState<WorldPostType>(
    WorldPostType.IMAGE_WRITING
  );
  const [activeSidebarItem, setActiveSidebarItem] =
    React.useState<string>("feed");
  return (
    <GlobalCtx.Provider
      value={{
        userID,
        setUserID,
        wpt,
        setWPT,
        activeSidebarItem,
        setActiveSidebarItem,
      }}
    >
      {children}
    </GlobalCtx.Provider>
  );
};

export default GlobalProvider;
