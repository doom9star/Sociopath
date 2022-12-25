import { Exclude } from "class-transformer";
import { BeforeRemove, Column, Entity, ManyToOne } from "typeorm";
import Base from "./Base";
import { Post } from "./Post";
import { v2 } from "cloudinary";

@Entity("images")
export class Image extends Base {
  @Column()
  url: string;

  @Exclude()
  @Column()
  cid: string;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: "CASCADE" })
  post: Post;

  @BeforeRemove()
  async removeCloudinary() {
    await v2.uploader.destroy(this.cid);
  }

  uploadCloudinary(uri: string) {
    return new Promise<void>(async (res) => {
      const { secure_url, public_id } = await v2.uploader.upload(uri);
      this.url = secure_url;
      this.cid = public_id;
      await this.save();
      res();
    });
  }
}
