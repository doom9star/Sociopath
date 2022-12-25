import { Entity, ManyToOne } from "typeorm";
import Base from "./Base";
import { Profile } from "./Profile";

@Entity("follows")
export default class Follow extends Base {
  @ManyToOne(() => Profile, {
    eager: true,
    onDelete: "CASCADE",
  })
  profile: Profile;

  @ManyToOne(() => Profile, {
    eager: true,
    onDelete: "CASCADE",
  })
  following: Profile;

  isFollowing?: boolean;
}
