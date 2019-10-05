import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient, { Resolvers } from "apollo-client";
import { SchemaLink } from "apollo-link-schema";
import { buildClientSchema, printSchema } from "graphql";
import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import React from "react";
import { ApolloProvider } from "react-apollo";

import { someDateTime, someGroup, somePerson, somePost, someSequence, someThread } from "./testData";

interface IGraphQLMockProviderProps {
  mocks?: any;
  children?: React.ReactNode;
}

export function GraphQLMockProvider({ mocks, children }: IGraphQLMockProviderProps) {
  const schema = makeExecutableSchema({
    typeDefs: convertSchemaToTypeDefs(require("../../.storybook/schema.json"))
  });

  addMockFunctionsToSchema({
    schema,
    mocks: {
      Person: () => somePerson(),
      Group: () => someGroup(),
      GroupSearchResponse: () => someGroup(),
      Thread: () => someThread(),
      DateTime: () => someDateTime(),
      Post: () => somePost(),
      Query: () => ({
        groups: () => someSequence(2, someGroup),
        threads: () => someSequence(5, someThread)
      }),
      ...mocks
    }
  });

  const localMockResolvers: Resolvers = {
    Query: {
      currentGroupId: () => someGroup().id
    }
  };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema
    }),
    resolvers: localMockResolvers
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

function convertSchemaToTypeDefs(schema: any) {
  return printSchema(buildClientSchema(schema));
}
