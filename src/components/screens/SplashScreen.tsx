import { Font, SecureStore } from "expo";
import jwtDecode from "jwt-decode";
import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import SentryExpo from "sentry-expo";

import { client } from "../../apolloClient";
import { config } from "../../config";
import { fonts } from "../../fonts";
import { getGroups } from "../../generated/getGroups";
import { GROUPS_QUERY } from "../../graphql/queries";
import { NavigationService } from "../../services";
import WobblyText from "../atoms/WobblyText";

interface ISplashScreenState {
  hasInitialized: boolean;
}

/**
 * react-navigation opens this as the default screen but redirects to the Auth or App stack,
 * depending on whether the user is authenticated or not.
 */
class SplashScreen extends React.PureComponent<{}, ISplashScreenState> {
  public constructor(props: {}) {
    super(props);
    this.state = { hasInitialized: false };
  }

  public async componentDidMount() {
    await this.initSentry();
    await Font.loadAsync(fonts);
    this.setState({ hasInitialized: true });
    this.navigateToAppOrAuth();
  }

  public render() {
    return (
      <SafeAreaView style={style.wrapper}>
        {this.state.hasInitialized && <WobblyText>Loading...</WobblyText>}
      </SafeAreaView>
    );
  }

  private navigateToAppOrAuth = async () => {
    // https://reactnavigation.org/docs/en/auth-flow.html
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      // We're logged in. Load a list of the person's groups before showing them the app. Also set the current group
      // to the first one.
      const groups = await client.query<getGroups>({ query: GROUPS_QUERY });
      // TODO: what if there are none?
      await client.writeData({ data: { currentGroupId: groups.data.groups![0].id } });
      NavigationService.navigate("App");
    } else {
      NavigationService.navigate("Auth");
    }
  };

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
}

export default SplashScreen;

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ed2826"
  }
});
