import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};

// Global module to extend express-session type
declare module "express-session" {
  interface Session {
    userId: number | string;
  }
}
