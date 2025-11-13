import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Name: string;

  @Column()
  Key: string;

  @OneToOne(() => User, (user) => user.ApiKey, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" }) // explicit FK column
  User: User;

  @CreateDateColumn({ name: "CreatedAt" })
  CreatedAt: Date;

  @UpdateDateColumn({ name: "UpdatedAt" })
  UpdatedAt: Date;
}
