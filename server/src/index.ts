import { MikroORM } from "@mikro-orm/core";
import "dotenv-safe/config";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up(); // runs migrations
  // const post = orm.em.create(Post, { title: "my second post fr" } as Post);
  // orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.log(err);
});
