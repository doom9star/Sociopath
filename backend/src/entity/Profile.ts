import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Base from "./Base";
import { Image } from "./Image";
import Notification from "./Notification";
import { Post } from "./Post";
import { User } from "./User";

@Entity("profiles")
export class Profile extends Base {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: "text" })
  bio: string | null;

  @Column({ nullable: true })
  location: string | null;

  @Column({ nullable: true })
  occupation: string | null;

  @Column({ nullable: true })
  weblink: string | null;

  @OneToOne(() => Image, { cascade: true, onDelete: "SET NULL" })
  @JoinColumn()
  avatar: Image;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  user: User;

  @Column({ default: 0 })
  followers: number;

  @Column({ default: 0 })
  following: number;

  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.reciever)
  notifications: Notification[];

  isFollowing?: boolean;
}
