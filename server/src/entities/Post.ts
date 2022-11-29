import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ type: "timestamp" })
  createdAt = new Date();

  @Property({ type: "timestamp" })
  updatedAt = new Date();

  @Property({ type: "text" })
  title!: string;
}
