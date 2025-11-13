import { Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,Column } from "typeorm";
@Entity()
export class apiKey{
    @PrimaryGeneratedColumn()
    Id:number;
    @Column()
    Name:string;
    @Column()
    Key:string;
    @CreateDateColumn({name:'CreatedAt'})
    CreatedAt:Date;
    @UpdateDateColumn({name:"UpdatedAt"})
    UpdatedAt:Date;
}