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
import { User } from "../entities/User";
import { MyContext } from "../types";
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

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId } as User);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: AuthInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(input);

    if (errors) {
      return { errors: errors };
    }

    const _user = await em.findOne(User, {
      $or: [{ email: input.email }, { username: input.username }],
    });
    if (_user) {
      return {
        errors: [
          { field: "username", message: "Username/Email already exists" },
        ],
      };
    }

    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      email: input.email,
      username: input.username,
      password: hashedPassword,
    } as User);
    await em.persistAndFlush(user);

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      usernameOrEmail
    );

    const user = await em.findOne(
      User,
      isEmail
        ? {
            email: usernameOrEmail,
          }
        : { username: usernameOrEmail }
    );

    console.log(user);

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
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
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
      `<a href='http://localhost:3000/change-password/${token}'>Reset Your Password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { em, redis, req }: MyContext
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

    const user = await em.findOne(User, { id: parseInt(userId) });
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

    user.password = await argon2.hash(newPassword);

    await em.persistAndFlush(user);

    await redis.del(FORGET_PASSWORD_PREFIX + token);

    req.session.userId = userId;

    return { user };
  }
}
