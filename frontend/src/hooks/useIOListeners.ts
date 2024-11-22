import { produce } from "immer";
import React from "react";
import { useQueryClient } from "react-query";
import { socket } from "../socket";
import { INotification, IProfile, NotificationType } from "../ts/types";

export function useIOListeners() {
  const client = useQueryClient();
  React.useEffect(() => {
    socket.on("notification", (notification: INotification) => {
      client.setQueryData<INotification[]>("notifications", (old) =>
        !old ? [notification] : [notification, ...old]
      );
      if (notification.type === NotificationType.FOLLOW) {
        client.setQueryData<IProfile>(["me", "profile"], (old) => ({
          ...old!,
          followers: old!.followers + 1,
        }));
      }
    });
    socket.on("unfollow", () => {
      client.setQueryData<IProfile>(["me", "profile"], (old) => ({
        ...old!,
        followers: old!.followers - 1,
      }));
    });
    socket.on("notifications:read:success", () => {
      client.setQueryData<INotification[]>("notifications", (old) =>
        produce(old!, (draft) => {
          for (let i = 0; i < draft.length; i++) {
            if (draft[i].read) break;
            draft[i].read = true;
          }
        })
      );
    });
  }, [client, socket]);
}
