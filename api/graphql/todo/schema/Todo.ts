import { User } from "api/graphql/user/schema/User";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class Todo {
  @Field((type) => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  createdAt!: Date;

  @Field()
  lastUpdatedAt!: Date;

  @Field()
  creator!: User;

  @Field(type => Boolean)
  isCompleted!: boolean


}

export { Todo };
