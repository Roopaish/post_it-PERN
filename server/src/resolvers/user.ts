import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UserAccount } from "../entities/User";
import { MyContext } from "../types";
import { createEmailTemplate } from "../utils/createEmailTemplate";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";
import { AuthInput } from "./AuthInput";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => UserAccount, { nullable: true })
  user?: UserAccount;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: AuthInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(input);

    if (errors) {
      return { errors: errors };
    }

    const hashedPassword = await argon2.hash(input.password);

    let user: UserAccount;

    try {
      // const result = await dataSource
      //   .createQueryBuilder()
      //   .insert()
      //   .into(Users)
      //   .values({
      //     username: input.username,
      //     email: input.email,
      //     password: hashedPassword,
      //   })
      //   .returning("*")
      //   .execute();

      // user = result.raw[0];

      user = await UserAccount.create({
        username: input.username,
        email: input.email,
        password: hashedPassword,
      }).save();

      req.session.userId = user.id;
      return { user };
    } catch (e) {
      if (e.code === "23505") {
        return {
          errors: [
            { field: "username", message: "Username/Email already exists" },
          ],
        };
      }
      return {
        errors: [
          {
            field: "unknown",
            message: "Something went wrong!",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      usernameOrEmail
    );

    const user = await UserAccount.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }
    );

    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: "User not found" }],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Incorrect password" }],
      };
    }

    // save user id session on redis
    req.session.userId = user.id;

    return { user };
  }

  @Query(() => UserAccount, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return UserAccount.findOneBy({ id: req.session.userId });
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((_res) =>
      // removing from redis
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME); // removes from client
        if (err) {
          _res(false);
          return;
        }
        _res(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await UserAccount.findOneBy({ email });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    ); // expire in 3 days (1000ms * 60s * 60m * 24h * 3d)

    sendEmail(
      email,
      createEmailTemplate(`http://localhost:3000/change-password/${token}`)
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 6) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Password must be greater or equal to 6 characters",
          },
        ],
      };
    }

    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token is expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await UserAccount.findOneBy({ id: userIdNum });
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "User no longer exists",
          },
        ],
      };
    }

    await UserAccount.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    await redis.del(FORGET_PASSWORD_PREFIX + token);

    req.session.userId = userIdNum;

    return { user };
  }
}
