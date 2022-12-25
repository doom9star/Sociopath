import Base from "./Base";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { compareSync, hashSync } from "bcrypt";
import { Profile } from "./Profile";
import { Exclude } from "class-transformer";

@Entity("users")
export class User extends Base {
  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @BeforeInsert()
  hashPassword(): void {
    this.password = hashSync(this.password, 12);
  }

  comparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }
}
