import { Column, Entity, ManyToOne } from "typeorm";
import { NotificationType } from "../ts/types";
import Base from "./Base";
import { Post } from "./Post";
import { Profile } from "./Profile";

@Entity("notifications")
export default class Notification extends Base {
  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  creator?: Profile;

  @ManyToOne(() => Post)
  post?: Post;

  @ManyToOne(() => Profile, (profile) => profile.notifications, {
    onDelete: "CASCADE",
  })
  reciever: Profile;

  @Column({ default: false })
  read: boolean;
}
