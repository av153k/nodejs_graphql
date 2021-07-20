import { config } from "./config/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import UserResolver from "./graphql/user/resolvers/userResolver";
import { buildSchema } from "type-graphql";

async function init() {
  const gqlSchema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
  });

  const app = express();
  const server = new ApolloServer({
    schema: gqlSchema,
  });

  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("Server is running on http://localhost:4000")
  );
}

init();
