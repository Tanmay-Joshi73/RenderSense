import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn, UpdateDateColumn} from "typeorm";
@Entity()
export class user{
@PrimaryGeneratedColumn()
Id:number;
@Column({})
Name:string;
@Column()
Email:string;
@Column()
Password:string;
@CreateDateColumn({name:'CreatedAt'})
CreatedAt:Date
@UpdateDateColumn({name:'UpdatedAt'})
UpdatedAt:Date;

}