import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import "dotenv-safe/config";
import express from "express";
import { buildSchema } from "type-graphql";
import mikroOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  // Database Setup
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up(); // runs migrations

  // Server setup
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }), // make orm available to all the resolvers
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app }); // creates graphql endpoint on express

  app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port: ", process.env.PORT || 4000);
  });
};

main().catch((err) => {
  console.log(err);
});
