import DataLoader from "dataloader";
import { In } from "typeorm";
import { UserAccount } from "../entities/User";

// input: [1,2,3,4]
// output: [{id:1, username:'someone'},...]
export const createUserLoader = () =>
  new DataLoader<number, UserAccount>(async (userIds) => {
    const users = await UserAccount.findBy({ id: In(userIds) });
    const userIdToUser: Record<number, UserAccount> = {};
    users.forEach((u) => (userIdToUser[u.id] = u));

    return userIds.map((userId) => userIdToUser[userId]);
  });
