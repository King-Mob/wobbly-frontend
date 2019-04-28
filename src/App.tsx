import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { Font, SecureStore } from "expo";
import jwtDecode from "jwt-decode";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { NavigationContainerComponent } from "react-navigation";
import SentryExpo from "sentry-expo";
import { parse } from "url";

import AppNavigation from "./AppNavigation";
import AppWithSubscriptions from "./AppWithSubscriptions";
import { SplashScreen } from "./components/screens";
import { config } from "./config";
import { fonts } from "./fonts";
import { OWN_INFO_QUERY, OwnInfoQuery } from "./graphql/queries";
import { NavigationService } from "./services";

interface IAppState {
  clientHasLoaded: boolean;
  fontsHaveLoaded: boolean;
}
export default class App extends React.Component<{}, IAppState> {
  private client?: ApolloClient<any>;

  public constructor(props: {}) {
    super(props);
    this.state = { clientHasLoaded: false, fontsHaveLoaded: false };
  }

  public async componentDidMount() {
    await this.initSentry();
    await this.initClient();
    await this.initFonts();
  }

  public render() {
    if (!this.state.clientHasLoaded || !this.state.fontsHaveLoaded || !this.client) {
      return <SplashScreen />;
    }
    const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;

    return (
      <ApolloProvider client={this.client}>
        <OwnInfoQuery query={OWN_INFO_QUERY}>
          {ownInfoResult => (
            <AppWithSubscriptions ownInfoResult={ownInfoResult}>
              <ActionSheetProvider>
                <AppNavigation
                  ref={(el: NavigationContainerComponent | null) => {
                    NavigationService.setTopLevelNavigator(el);
                  }}
                  persistenceKey={navigationPersistenceKey}
                />
              </ActionSheetProvider>
            </AppWithSubscriptions>
          )}
        </OwnInfoQuery>
      </ApolloProvider>
    );
  }

  private async initSentry() {
    if (!config.sentryDsn) {
      return;
    }
    // SentryExpo.enableInExpoDevelopment = true;
    SentryExpo.config(config.sentryDsn).install();
    const authToken = await SecureStore.getItemAsync("token");
    if (!authToken) {
      return;
    }
    const decodedJwt = jwtDecode<{ personId: string }>(authToken);
    SentryExpo.setUserContext({ id: decodedJwt.personId });
  }

  private async initClient() {
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
      // TODO: can we get this once in `initClient` so that it doesn't run on
      // every request?
      const token = await SecureStore.getItemAsync("token");
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
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

    this.client = new ApolloClient({
      link: allLinks,
      cache: new InMemoryCache({ addTypename: true })
    });
    this.setState({ clientHasLoaded: true });
  }

  private async initFonts() {
    await Font.loadAsync(fonts);
    this.setState({ fontsHaveLoaded: true });
  }
}
