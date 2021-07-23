import { config } from "./config/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express, { request } from "express";
import UserResolver from "./graphql/user/resolver/userResolver";
import { buildSchema } from "type-graphql";
import { getUserIdFromJwtToken } from "./controllers/auth.controller";

async function init() {
  const gqlSchema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
  });

  const app = express();
  const server = new ApolloServer({
    schema: gqlSchema,

    context: ({ req }) => {
      const context = {
        req,
        userId:
          req && req.headers.authorization ? getUserIdFromJwtToken(req) : null,
      };
      return context;
    },
  });

  server.applyMiddleware({ app });
  // server.setGraphQLPath("/api/v0");

  app.listen(4000, () =>
    console.log(
      `Server is running on http://localhost:4000${server.graphqlPath}`
    )
  );
}

init();
