import { ApolloError } from "apollo-server-errors";
import { Resolver, Mutation, Query, Arg, Args, Ctx } from "type-graphql";
import { User, userResultUnion, UserInput } from "../schema/User";
import * as UserController from "../../../controllers/user.controller";
import { Context } from "apollo-server-core";
import { CustomContext } from "../../../utils/customContext";

@Resolver()
class UserResolver {
  private user: User = new User();

  @Query((returns) => userResultUnion, { nullable: false, name: "getUser" })
  async getCurrentUser(
    @Ctx() context : CustomContext,
  ): Promise<typeof userResultUnion> {
    return await UserController.getCurrentUser(context.userId);
  }

  @Mutation((returns) => userResultUnion, { name: "login" })
  async login(@Arg("user") user: UserInput): Promise<typeof userResultUnion> {
    return await UserController.login(user);
  }

  @Mutation((returns) => userResultUnion, { name: "createUser" })
  async register(
    @Arg("user") user: UserInput
  ): Promise<typeof userResultUnion> {
    return await UserController.register(user);
  }
}

export default UserResolver;
