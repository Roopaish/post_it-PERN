import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/dataSource";
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  await dataSource.initialize();

  const app = express();

  /* Using redis to store session data */
  const RedisStore = connectRedis(session);

  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
    password: process.env.REDIS_PASSWORD,
  });

  // apply cors throughout the app
  app.use(
    cors({
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    })
  );

  app.set("trust proxy", 1);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true, // Disables re-saving and resetting the TTL when using touch
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true, // can't be accessed by client side js
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https if true, true for https and false for http
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
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
    // cors: {
    //   credentials: true,
    //   origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    // }, // cors for this endpoint only
  }); // creates graphql endpoint on express

  app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port: ", process.env.PORT || 4000);
  });
};

main().catch((err) => {
  console.log(err);
});
