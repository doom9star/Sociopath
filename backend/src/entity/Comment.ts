import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import { Post } from "./Post";
import { Profile } from "./Profile";

@Entity("comments")
export default class Comment extends Base {
  @ManyToOne(() => Post, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  profile: Profile;

  @Column({ type: "text" })
  body: string;

  @ManyToOne(() => Comment, { onDelete: "CASCADE" })
  parent: Comment;

  @OneToMany(() => Comment, (c) => c.parent, { cascade: true })
  children: Comment[];
}
