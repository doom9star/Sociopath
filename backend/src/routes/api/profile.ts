import { Response, Router } from "express";
import { getConnection } from "typeorm";
import Follow from "../../entity/Follow";
import { Image } from "../../entity/Image";
import { Profile } from "../../entity/Profile";
import { authenticate, cloudinary } from "../../ts/middlewares";
import { AuthRequest, NotificationType } from "../../ts/types";
import { Utils } from "../../ts/utils";
import { sMgr } from "../../ts/constants";
import Notification from "../../entity/Notification";

const router = Router();

router.put(
  "/",
  authenticate,
  cloudinary,
  async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const profile = await Profile.findOne({
        where: { id: req.user.pid },
        relations: ["avatar"],
      });
      if (!profile) return res.json(Utils.getResponse(404));

      const { avatar, ...values } = req.body;

      if (avatar && !req.body.avatar.includes("https")) {
        if (profile.avatar) await profile.avatar.remove();
        const image = new Image();
        await image.uploadCloudinary(req.body.avatar);
        await Profile.update(
          { id: req.user.pid },
          { ...values, avatar: image }
        );
        return res.json(Utils.getResponse(200, { avatar: image }));
      } else if (!req.body.avatar && profile.avatar)
        await profile.avatar.remove();

      await Profile.update({ id: req.user.pid }, { ...values });

      await getConnection().queryResultCache.remove([req.user.pid]);
      return res.json(Utils.getResponse(200));
    } catch (error) {
      console.log(error);
      return res.json(Utils.getResponse(500));
    }
  }
);
router.get(
  "/:pid",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const pid = req.params.pid === "me" ? req.user.pid : req.params.pid;
    try {
      const profile = await Profile.createQueryBuilder("profile")
        .leftJoinAndSelect("profile.avatar", "avatar")
        .where("profile.id = :id", { id: pid })
        .cache(pid, 1000 * 60 * 60 * 24 * 7)
        .getOne();
      if (pid !== req.user.pid) {
        const follow = await Follow.findOne({
          where: { profile: req.user.pid, following: pid },
        });
        profile.isFollowing = !!follow;
      }
      return res.json(Utils.getResponse<Profile>(200, profile));
    } catch (error) {
      console.log(error);
      return res.json(Utils.getResponse(500));
    }
  }
);

router.put(
  "/follow/:pid/:value",
  authenticate,
  async (req: AuthRequest, res) => {
    const pid = req.params.pid;
    const value = parseInt(req.params.value);

    const conn = getConnection();
    const s = sMgr.get(pid);

    if (value === 1) {
      const follow = new Follow();
      follow.profile = await Profile.findOne({
        where: { id: req.user.pid },
        relations: ["avatar"],
      });
      follow.following = <any>{ id: pid };
      await follow.save();

      conn.manager.increment(Profile, { id: pid }, "followers", 1);
      conn.manager.increment(Profile, { id: req.user.pid }, "following", 1);

      const notification = new Notification();
      notification.type = NotificationType.FOLLOW;
      notification.reciever = <any>{ id: pid };
      notification.creator = follow.profile;
      await notification.save();

      if (s) s.emit("notification", notification);
    } else if (value === -1) {
      await Follow.delete({
        profile: { id: req.user.pid },
        following: { id: pid },
      });
      conn.manager.decrement(Profile, { id: pid }, "followers", 1);
      conn.manager.decrement(Profile, { id: req.user.pid }, "following", 1);

      if (s) s.emit("unfollow");
    }

    await conn.queryResultCache.remove([req.user.pid, pid]);
    return res.json(Utils.getResponse(200, { value, pid }));
  }
);

router.get(
  "/follow/:type/:pid",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const pid = req.params.pid === "me" ? req.user.pid : req.params.pid;
    const type = req.params.type as "followers" | "following";
    let follows: Follow[] = [];
    if (type === "followers") {
      follows = await Follow.createQueryBuilder("f")
        .leftJoinAndSelect("f.profile", "fp")
        .leftJoinAndSelect("fp.avatar", "fpa")
        .where("f.following = :pid", { pid })
        .getMany();
      follows = await Promise.all(
        follows.map(async (f) => {
          const follow = await Follow.findOne({
            where: {
              profile: req.user.pid,
              following: f.profile ? f.profile : f.following,
            },
          });
          f.isFollowing = !!follow;
          return f;
        })
      );
    } else if (type === "following")
      follows = await Follow.createQueryBuilder("f")
        .leftJoinAndSelect("f.following", "ff")
        .leftJoinAndSelect("ff.avatar", "ffa")
        .where("f.profile = :pid", { pid })
        .getMany();

    return res.json(Utils.getResponse(200, follows));
  }
);

export default router;
