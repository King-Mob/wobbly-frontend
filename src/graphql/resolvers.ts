import gql from "graphql-tag";

// Initial client state is set in `/src/apolloClient.ts`.
export const typeDefs = gql`
  extend type Query {
    currentGroupId: String
  }
`;

export const resolvers = {};
