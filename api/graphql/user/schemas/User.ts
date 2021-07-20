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
}

@ObjectType()
class UserAlreadyExistsError {
  @Field()
  type: String = "UserAlreadyExists";

  @Field()
  message!: string;
}

@ObjectType()
class UserCreationSuccess {
  @Field()
  type: String = "UserCreationSuccess";

  @Field()
  user!: User;
}

@ObjectType()
class UserDoesNotExistError {
  @Field()
  type: String = "UserDoesNotExist";

  @Field()
  message!: string;
}

@ObjectType()
class UserLoginError {
  @Field()
  type: String = "UserLoginError";

  @Field()
  message!: string;
}

const userResultUnion = createUnionType({
  name: "UserResult",
  types: () => [User, UserAlreadyExistsError, UserDoesNotExistError, UserCreationSuccess] as const,
  resolveType: (data) => {
    if ("type" in data) {
      if (data.type == "UserAlreadyExists") {
        return UserAlreadyExistsError;
      } else if(data.type == "UserCreationSuccess") {
        return UserCreationSuccess;
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
}

export {
  User,
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserCreationSuccess,
  userResultUnion,
  UserInput,
};
