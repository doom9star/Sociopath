import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import { Image } from "./Image";
import { Profile } from "./Profile";

@Entity("posts")
export class Post extends Base {
  @Column({ nullable: true, type: "text" })
  body: string;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @ManyToOne(() => Profile, (profile) => profile.posts, { onDelete: "CASCADE" })
  profile: Profile;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  comments: number;

  isLiked?: boolean;
}
