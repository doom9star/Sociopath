import { Response, Router } from "express";
import Notification from "../../entity/Notification";
import { authenticate } from "../../ts/middlewares";
import { AuthRequest } from "../../ts/types";
import { Utils } from "../../ts/utils";

const router = Router();

router.get(
  "/notifications",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const notifications = await Notification.createQueryBuilder("n")
      .leftJoinAndSelect("n.creator", "nc")
      .leftJoinAndSelect("nc.avatar", "nca")
      .leftJoinAndSelect("n.post", "np")
      .leftJoinAndSelect("np.images", "npi")
      .where("n.reciever = :id", { id: req.user.pid })
      .orderBy("n.createdAt", "DESC")
      .addOrderBy("npi.createdAt", "ASC")
      .getMany();
    return res.json(Utils.getResponse(200, notifications));
  }
);

export default router;
