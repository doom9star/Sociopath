import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import Notification from "../entity/Notification";

import { Profile } from "../entity/Profile";
import { User } from "../entity/User";
import { authenticate } from "../ts/middlewares";
import { AuthRequest, NotificationType } from "../ts/types";
import { Utils } from "../ts/utils";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { password, email } = req.body;
      const uniqueName = `${email.split("@")[0]}${v4().slice(0, 4)}`;

      const profile = new Profile();
      profile.name = uniqueName;

      const user = await User.create({
        password,
        email,
        profile,
      });
      await user.save();

      const token = jwt.sign(
        { uid: user.id, pid: user.profile.id },
        process.env.SECRET,
        {
          algorithm: "HS256",
          expiresIn: "7d",
        }
      );
      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });

      const notification = new Notification();
      notification.type = NotificationType.ADMIN;
      notification.reciever = <any>{ id: user.profile.id };
      await notification.save();

      return res.json(
        Utils.getResponse<{ [k: string]: any }>(200, {
          name: uniqueName,
          createdAt: user.profile.createdAt,
        })
      );
    } catch (err) {
      console.error(err);
      return res.json(Utils.getResponse(500));
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const user = await User.createQueryBuilder("u")
        .leftJoinAndSelect("u.profile", "p")
        .leftJoinAndSelect("p.avatar", "pa")
        .where("u.email = :email", { email })
        .getOne();
      if (!user) return res.json(Utils.getResponse(404));
      if (!user.comparePassword(password))
        return res.json(Utils.getResponse(401));

      const token = jwt.sign(
        { uid: user.id, pid: user.profile.id },
        process.env.SECRET,
        {
          algorithm: "HS256",
          expiresIn: "7d",
        }
      );

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });

      return res.json(Utils.getResponse(200, user.profile));
    } catch (error) {
      console.error(error);
      return res.json(Utils.getResponse(500));
    }
  }
);

router.delete("/logout", authenticate, (_: AuthRequest, res: Response) => {
  res.clearCookie("token");
  return res.json(Utils.getResponse(200));
});

export default router;
