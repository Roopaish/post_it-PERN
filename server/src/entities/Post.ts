import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() // to get graphql type
@Entity()
export class Post {
  @Field() // expose the following field to graphql
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Field(() => String)
  @Property({ type: "timestamp" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "timestamp" })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
