import { ApolloError } from "apollo-server-errors";
import { Resolver, Mutation, Query, Arg, Args } from "type-graphql";
import { User, userResultUnion, UserInput } from "../schemas/User";
import * as UserController from "../../../controllers/user.controller";

@Resolver()
class UserResolver {
  private user: User = new User();

  @Query((returns) => userResultUnion, { nullable: false, name: "getUser" })
  async getUser(
    @Arg("phone", { nullable: true }) phone: string,
    @Arg("email", { nullable: true }) email: string
  ): Promise<typeof userResultUnion> {
    const _user = await UserController.getUser(
      phone ? phone : email,
      phone != null
    );
    return _user;
  }

  @Mutation((returns) => userResultUnion, { name: "login" })
  async login(@Arg("user") user: UserInput): Promise<typeof userResultUnion> {
    return new User();
  }

  @Mutation((returns) => userResultUnion, { name: "createUser" })
  async createUser(
    @Arg("user") user: UserInput
  ): Promise<typeof userResultUnion> {
    const data = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      createdAt: new Date(Date()),
    };
    const _user = await UserController.createNewUser(data);
    console.log(_user);
    return _user;
  }
}

export default UserResolver;
