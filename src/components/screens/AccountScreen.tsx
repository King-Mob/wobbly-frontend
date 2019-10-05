import { SecureStore } from "expo";
import * as React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import HeaderButtons from "react-navigation-header-buttons";

import { NavigationService } from "../../services";
import { createNavigatorFunction, unregisterForPushNotificationsAsync } from "../../util";
import { WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import { WobblyHeaderButtons } from "../molecules";
import { UpdatePersonForm } from "../organisms";

interface IAccountScreenProps extends WithApolloClient<{}> {
  displayName: string;
  email: string;
}
interface IAccountScreenState {
  isLoggingOut: boolean;
}

class AccountScreen extends React.Component<IAccountScreenProps, IAccountScreenState> {
  public static navigationOptions = () => {
    const navigateToSettings = createNavigatorFunction("Settings");
    return {
      title: "Account",
      headerLeft: <Button type="clear" title="Close" onPress={NavigationService.goBack} />,
      headerRight: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Settings" iconName="settings" onPress={navigateToSettings} />
        </WobblyHeaderButtons>
      )
    };
  };

  public constructor(props: IAccountScreenProps) {
    super(props);
    this.state = { isLoggingOut: false };
  }

  public render() {
    return (
      <ScrollView>
        <UpdatePersonForm />
        <View style={styles.bottomFormSection}>
          <WobblyButton
            text="Log out"
            onPress={this.logout}
            intent={Intent.DANGER}
            isLoading={this.state.isLoggingOut}
          />
        </View>
      </ScrollView>
    );
  }

  private logout = async () => {
    this.setState({ isLoggingOut: true });
    try {
      await unregisterForPushNotificationsAsync(); // must come before the others as it depends on the token
      await this.props.client.clearStore();
      await SecureStore.deleteItemAsync("token");
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
    } finally {
      this.setState({ isLoggingOut: false });
      // Navigate to login screen
      NavigationService.navigate("Auth");
    }
  };
}

export default withApollo(AccountScreen);

const styles = StyleSheet.create({
  bottomFormSection: {
    marginHorizontal: 20
  }
});
