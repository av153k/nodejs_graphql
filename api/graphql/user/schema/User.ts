import { Blog } from "../../todo/schema/Todo";
import {
  createUnionType,
  Field,
  ID,
  InputType,
  ObjectType,
} from "type-graphql";

@ObjectType()
class User {
  @Field((type) => ID)
  id!: number;

  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: false })
  phone!: string;

  @Field({ nullable: false })
  password!: string;

  @Field({ nullable: false })
  createdAt!: Date;

  @Field({ nullable: false })
  lastUpdatedAt!: Date;

  @Field()
  isAuthor: boolean = false;

  @Field()
  lastLoginTime: Date = new Date(Date());

  @Field()
  lastLoginDevice!: string;
}

@ObjectType()
class UserAlreadyExistsError {
  @Field()
  type: string = "UserAlreadyExists";

  @Field()
  message!: string;
}

@ObjectType()
class UserAuthenticationSuccess {
  @Field()
  type: string = "UserAuthenticationSuccess";

  @Field({ nullable: false })
  token!: string;

  @Field()
  user!: User;
}

@ObjectType()
class UserDoesNotExistError {
  @Field()
  type: string = "UserDoesNotExist";

  @Field()
  message!: string;
}

@ObjectType()
class UserLoginError {
  @Field()
  type: string = "UserLoginError";

  @Field()
  message!: string;
}

const userResultUnion = createUnionType({
  name: "UserResult",
  types: () =>
    [
      User,
      UserAlreadyExistsError,
      UserDoesNotExistError,
      UserAuthenticationSuccess,
      UserLoginError,
    ] as const,
  resolveType: (data) => {
    if ("type" in data) {
      if (data.type == "UserAlreadyExists") {
        return UserAlreadyExistsError;
      } else if (data.type == "UserAuthenticationSuccess") {
        return UserAuthenticationSuccess;
      } else if (data.type == "UserLoginError") {
        return UserLoginError;
      } else {
        return UserDoesNotExistError;
      }
    } else {
      return User;
    }
  },
});

@InputType()
class UserInput {
  @Field((type) => ID, { nullable: true })
  id!: number;

  @Field((type) => String, { nullable: true })
  phone!: string;

  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  email!: string;

  @Field({ nullable: true })
  password!: string;

  @Field({ nullable: true })
  createdAt!: Date;

  @Field({ nullable: true })
  lastUpdatedAt!: Date;

  @Field({ nullable: false })
  lastLoginDevice!: string;
}

export {
  User,
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserAuthenticationSuccess,
  userResultUnion,
  UserInput,
  UserLoginError,
};
