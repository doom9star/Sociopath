import { Entity, ManyToOne } from "typeorm";
import Base from "./Base";
import { Post } from "./Post";
import { Profile } from "./Profile";

@Entity("likes")
export default class Like extends Base {
  @ManyToOne(() => Post, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  profile: Profile;

  isFollowing?: boolean;
}
