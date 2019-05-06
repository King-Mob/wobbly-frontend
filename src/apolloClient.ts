import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { SecureStore } from "expo";
import { parse } from "url";

import { config } from "./config";

export let client: ApolloClient<any>;

export const initClient = async () => {
  const httpLink = createHttpLink({
    uri: config.backendUrl
  });

  const authToken = await SecureStore.getItemAsync("token");
  const wsLink = new WebSocketLink({
    uri: `ws://${parse(config.backendUrl).host}/ws`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: `Bearer ${authToken}`
      }
    }
  });
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : ""
      }
    };
  });

  // Make subscriptions go over the WebSocket link
  const allLinks = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    authLink.concat(httpLink)
  );

  client = new ApolloClient({
    link: allLinks,
    cache: new InMemoryCache({ addTypename: true })
  });
};
