import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { ApiKey } from "src/api-keys/apiKey.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Name: string;

  @Column()
  Email: string;

  @Column()
  Password: string;

  @OneToOne(() => ApiKey, (apiKey) => apiKey.User)
  ApiKey: ApiKey;

  @CreateDateColumn({ name: "CreatedAt" })
  CreatedAt: Date;

  @UpdateDateColumn({ name: "UpdatedAt" })
  UpdatedAt: Date;
}
