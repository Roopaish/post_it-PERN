import DataLoader from "dataloader";
import { In } from "typeorm";
import { Updoot } from "../entities/Updoot";

// input: [{postId: 5, userId: 10}]
// output: [{postId:5, userId:10, value:1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findBy({
        postId: In(keys.map((key) => key.postId)),
        userId: In(keys.map((key) => key.userId)),
      });
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      updoots.forEach(
        (u) => (updootIdsToUpdoot[`${u.userId}|${u.postId}`] = u)
      );

      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
      );
    }
  );
