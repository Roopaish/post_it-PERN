import { Field, InputType } from "type-graphql";

@InputType()
export class AuthInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
