import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { NavigationContainerComponent } from "react-navigation";

import { client, initClient } from "./apolloClient";
import AppNavigation from "./AppNavigation";
import AppWithSubscriptions from "./AppWithSubscriptions";
import { OWN_INFO_QUERY, OwnInfoQuery } from "./graphql/queries";
import { NavigationService } from "./services";

interface IAppState {
  clientHasLoaded: boolean;
}
export default class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);
    this.state = { clientHasLoaded: false };
  }

  public async componentDidMount() {
    await initClient();
    this.setState({ clientHasLoaded: true });
  }

  public render() {
    if (!this.state.clientHasLoaded) {
      return null;
    }
    const navigationPersistenceKey = __DEV__ ? null : null; // TODO @tao
    return (
      <ApolloProvider client={client}>
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
}
