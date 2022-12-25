import Notification from "../entity/Notification";
import { sMgr } from "../ts/constants";
import { AuthIORequest } from "../ts/types";

export const IORouter = (socket: AuthIORequest) => {
  socket.on("connection", (s: AuthIORequest) => {
    const user = s.handshake.user;
    sMgr.add(user.pid, s);

    s.on("notifications:read", async (ids: string[]) => {
      const notifications = await Notification.findByIds(ids);
      for (const n of notifications) {
        n.read = true;
        await n.save();
      }
      socket.emit("notifications:read:success");
    });

    socket.on("disconnect", () => sMgr.remove(user.pid));
  });
};
