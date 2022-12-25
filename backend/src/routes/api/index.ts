import { v2 } from "cloudinary";
import { Router } from "express";

import ProfileRouter from "./profile";
import PostRouter from "./post";
import MiscRouter from "./misc";
import { authenticate } from "../../ts/middlewares";
import { AuthRequest } from "../../ts/types";
import { Profile } from "../../entity/Profile";
import { Like } from "typeorm";
import { Utils } from "../../ts/utils";

const router = Router();

router.use("/profile", ProfileRouter);
router.use("/post", PostRouter);
router.use("/misc", MiscRouter);

router.post("/search/:query", authenticate, async (req: AuthRequest, res) => {
  const query = req.params.query as string;
  const profiles = await Profile.find({
    where: { name: Like(`%${query}%`) },
    relations: ["avatar"],
  });
  return res.json(Utils.getResponse<Profile[]>(200, profiles));
});

export default router;
