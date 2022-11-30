import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";

@InputType()
class AuthInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  name: string;

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
  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: AuthInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (input.username.length < 3) {
      return {
        errors: [
          {
            name: "username",
            message: "Username must be greater or equal to 3 characters",
          },
        ],
      };
    }
    if (input.password.length < 6) {
      return {
        errors: [
          {
            name: "password",
            message: "Password must be greater or equal 6 characters",
          },
        ],
      };
    }

    const _user = await em.findOne(User, { username: input.username });
    if (_user) {
      return {
        errors: [{ name: "username", message: "Username already exists" }],
      };
    }

    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword,
    } as User);
    await em.persistAndFlush(user);

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: AuthInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: input.username });
    if (!user) {
      return {
        errors: [{ name: "username", message: "Username not found" }],
      };
    }

    const valid = await argon2.verify(user.password, input.password);
    if (!valid) {
      return {
        errors: [{ name: "password", message: "Incorrect password" }],
      };
    }

    return { user };
  }
}
