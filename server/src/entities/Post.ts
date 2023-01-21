import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Updoot } from "./Updoot";
import { UserAccount } from "./User";

@ObjectType() // to get graphql type
@Entity()
export class Post extends BaseEntity {
  @Field() // expose the following field to graphql
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  creatorId!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field()
  @ManyToOne(() => UserAccount, (user) => user.posts)
  creator: UserAccount;

  @ManyToOne(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
