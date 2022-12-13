import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import * as redis from "redis";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.getMigrator().up(); // runs migrations

  const app = express();

  /* Using redis to store session data */
  const RedisStore = connectRedis(session);

  const redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
  });

  await redisClient.connect();

  app.set("trust proxy", !__prod__);
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true, // Disables re-saving and resetting the TTL when using touch
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true, // can't be accessed by client side js
        sameSite: __prod__ ? "lax" : "none", // csrf
        secure: true, // cookie only works in https if true
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false, // not pinging redis continuously
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // to make variables available to all the resolvers, can pass anything
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: { credentials: true, origin: "https://studio.apollographql.com" },
  }); // creates graphql endpoint on express

  app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port: ", process.env.PORT || 4000);
  });
};

main().catch((err) => {
  console.log(err);
});
