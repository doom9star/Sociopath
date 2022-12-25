import { Response, Router } from "express";
import { Socket } from "socket.io";
import { getConnection } from "typeorm";
import Comment from "../../entity/Comment";
import Follow from "../../entity/Follow";
import { Image } from "../../entity/Image";
import Like from "../../entity/Like";
import Notification from "../../entity/Notification";
import { Post } from "../../entity/Post";
import { Profile } from "../../entity/Profile";
import { sMgr } from "../../ts/constants";
import { authenticate, cloudinary } from "../../ts/middlewares";
import {
  AuthRequest,
  FeedType,
  NotificationType,
  WorldPostType,
} from "../../ts/types";
import { Utils } from "../../ts/utils";

const router = Router();

router.post("/", authenticate, cloudinary, async (req: AuthRequest, res) => {
  const body: string | undefined = req.body.body;
  const images: string[] | undefined = req.body.images;
  if (!body && !images)
    return res.json(Utils.getResponse(400, "Required fields missing!"));

  const post = new Post();
  post.profile = <any>{ id: req.user.pid };
  if (body) post.body = body;
  post.images = [];
  if (images) {
    for (const imageURI of images) {
      const image = new Image();
      await image.uploadCloudinary(imageURI);
      post.images.push(image);
    }
  }
  await post.save();
  post.likes = <any>0;
  return res.json(Utils.getResponse(200, post));
});

router.delete(
  "/:postId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      relations: ["images"],
    });
    post.images.forEach(async (img) => await img.remove());
    await Like.delete({ post });
    await Comment.delete({ post });
    await post.remove();
    return res.json(Utils.getResponse(200));
  }
);

router.get(
  "/likes/:postId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const postId = req.params.postId;
    let likes = await Like.find({
      where: { post: postId },
      relations: ["profile", "profile.avatar"],
    });
    likes = await Promise.all(
      likes.map(async (l) => {
        const follow = await Follow.findOne({
          where: {
            profile: req.user.pid,
            following: l.profile,
          },
        });
        l.isFollowing = !!follow;
        return l;
      })
    );
    return res.json(Utils.getResponse(200, likes));
  }
);

router.get("/:pid/:type/:wpt?", authenticate, async (req: AuthRequest, res) => {
  const type = req.params.type as FeedType;
  const pid = req.params.pid === "me" ? req.user.pid : req.params.pid;

  let posts: Post[] = [];

  if (type === "public") {
    const wpt = parseInt(req.params.wpt);
    if (wpt === WorldPostType.IMAGE) {
      posts = await Post.createQueryBuilder("post")
        .leftJoinAndSelect("post.images", "images")
        .leftJoinAndSelect("post.profile", "profile")
        .leftJoinAndSelect("profile.avatar", "avatar")
        .leftJoin(Follow, "follow", "follow.following = profile.id")
        .where("images.id IS NOT NULL")
        .andWhere("post.body IS NULL")
        .andWhere("profile.id <> :pid", { pid })
        .andWhere("follow.following <> :pid", { pid })
        .orderBy("images.createdAt", "ASC")
        .getMany();
    } else if (wpt === WorldPostType.WRITING) {
      posts = await Post.createQueryBuilder("post")
        .leftJoinAndSelect("post.images", "images")
        .leftJoinAndSelect("post.profile", "profile")
        .leftJoinAndSelect("profile.avatar", "avatar")
        .leftJoin(Follow, "follow", "follow.following = profile.id")
        .where("images.id IS NULL")
        .andWhere("post.body IS NOT NULL")
        .andWhere("profile.id <> :pid", { pid })
        .andWhere("follow.following <> :pid", { pid })
        .orderBy("images.createdAt", "ASC")
        .getMany();
    } else {
      posts = await Post.createQueryBuilder("post")
        .leftJoinAndSelect("post.images", "images")
        .leftJoinAndSelect("post.profile", "profile")
        .leftJoinAndSelect("profile.avatar", "avatar")
        .leftJoin(Follow, "follow", "follow.following = profile.id")
        .where("images.id IS NOT NULL")
        .andWhere("post.body IS NOT NULL")
        .andWhere("profile.id <> :pid", { pid })
        .andWhere("follow.following <> :pid", { pid })
        .orderBy("images.createdAt", "ASC")
        .getMany();
    }
  } else if (type === "private") {
    posts = await Post.createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .where("post.profile = :id", { id: pid })
      .orderBy("post.createdAt", "DESC")
      .addOrderBy("images.createdAt", "ASC")
      .getMany();
  } else if (type === "protected") {
    const myPosts = await Post.createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .where("post.profile = :id", { id: pid })
      .orderBy("images.createdAt", "ASC")
      .getMany();

    const followingPosts = await Post.createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.profile", "profile")
      .leftJoinAndSelect("profile.avatar", "avatar")
      .leftJoin(Follow, "follow", "follow.following = profile.id")
      .where("follow.profile = :pid", { pid })
      .andWhere("follow.following = profile.id")
      .orderBy("images.createdAt", "ASC")
      .getMany();

    posts = myPosts
      .concat(followingPosts)
      .sort((p1, p2) => p2.createdAt.valueOf() - p1.createdAt.valueOf());
  }
  posts = await Promise.all(
    posts.map(async (post) => {
      const like = await Like.findOne({
        where: { profile: req.user.pid, post: post.id },
      });
      post.isLiked = !!like;
      return post;
    })
  );

  return res.json(Utils.getResponse(200, posts));
});

router.get(
  "/:postId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const post = await Post.createQueryBuilder("p")
      .leftJoinAndSelect("p.images", "pi")
      .leftJoinAndSelect("p.profile", "pp")
      .leftJoinAndSelect("pp.avatar", "ppa")
      .where("p.id = :id", { id: req.params.postId })
      .orderBy("pi.createdAt", "ASC")
      .getOne();
    const comments = await Comment.createQueryBuilder("c")
      .leftJoinAndSelect("c.profile", "cp")
      .leftJoinAndSelect("cp.avatar", "cpa")
      .leftJoinAndSelect("c.children", "cc")
      .leftJoinAndSelect("cc.profile", "ccp")
      .leftJoinAndSelect("ccp.avatar", "ccpa")
      .where("c.post = :id", { id: post.id })
      .andWhere("c.parent IS NULL")
      .getMany();

    post.comments = <any>comments;
    const like = await Like.findOne({ where: { post, profile: req.user.pid } });
    post.isLiked = !!like;

    return res.json(Utils.getResponse(200, post));
  }
);

router.post(
  "/like/:postId/:value",
  authenticate,
  async (req: AuthRequest, res) => {
    const postId = req.params.postId;
    const value = parseInt(req.params.value);
    const { poster } = req.body;

    if (value === 1) {
      const like = new Like();
      like.profile = <any>{ id: req.user.pid };
      like.post = <any>{ id: postId };
      await like.save();
      getConnection().manager.increment(Post, { id: postId }, "likes", 1);

      if (poster !== req.user.pid) {
        const notification = new Notification();
        notification.type = NotificationType.LIKE;
        notification.reciever = <any>{ id: poster };
        notification.creator = await Profile.findOne({
          where: { id: req.user.pid },
          relations: ["avatar"],
        });
        notification.post = await Post.findOne({
          where: { id: postId },
          relations: ["images"],
        });
        await notification.save();

        const s = sMgr.get(poster);

        if (s) s.emit("notification", notification);
      }
    } else if (value === -1) {
      await Like.delete({
        profile: { id: req.user.pid },
        post: { id: postId },
      });
      getConnection().manager.decrement(Post, { id: postId }, "likes", 1);
      await Notification.delete({
        creator: { id: req.user.pid },
        post: { id: postId },
      });
    }

    return res.json(Utils.getResponse(200, { value, postId }));
  }
);

router.post(
  "/comment/:postId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { body, pcid, poster } = req.body;
    const postId = req.params.postId;

    const comment = new Comment();
    comment.body = body;
    comment.post = <any>{ id: req.params.postId };
    comment.profile = await Profile.findOne({
      where: { id: req.user.pid },
      relations: ["avatar"],
    });

    const notification = new Notification();
    notification.creator = comment.profile;
    notification.post = await Post.findOne({
      where: { id: postId },
      relations: ["images"],
    });

    let s: Socket;

    if (pcid) {
      const parentComment = await Comment.findOne({
        where: { id: pcid },
        relations: ["children", "profile", "profile.avatar"],
      });
      parentComment.children.push(comment);
      await parentComment.save();
      comment.parent = <any>{ id: pcid };
      notification.type = NotificationType.REPLY;
      notification.reciever = parentComment.profile;
      s = sMgr.get(parentComment.profile.id);
    } else {
      getConnection().manager.increment(Post, { id: postId }, "comments", 1);
      comment.children = [];
      await comment.save();
      notification.type = NotificationType.COMMENT;
      notification.reciever = <any>{ id: poster };
      s = sMgr.get(poster);
    }
    if (poster !== req.user.pid) {
      await notification.save();
      if (s) s.emit("notification", notification);
    }
    return res.json(Utils.getResponse(200, comment));
  }
);

export default router;
