import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

// Global module to extend express-session type
declare module "express-session" {
  interface Session {
    userId: number;
  }
}
