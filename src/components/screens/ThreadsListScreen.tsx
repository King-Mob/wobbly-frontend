import * as React from "react";
import HeaderButtons from "react-navigation-header-buttons";

import { NavigationService } from "../../services";
import { createNavigatorFunction } from "../../util";
import { WobblyHeaderButtons } from "../molecules";
import { ThreadsList } from "../organisms";

export default class ThreadsListScreen extends React.PureComponent {
  public static navigationOptions = () => {
    const navigateToCreateThread = createNavigatorFunction("CreateThread");
    return {
      title: "Threads",
      headerRight: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Add" iconName="create" onPress={navigateToCreateThread} />
        </WobblyHeaderButtons>
      ),
      headerLeft: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Drawer" iconName="menu" onPress={NavigationService.openDrawer} />
        </WobblyHeaderButtons>
      )
    };
  };

  public render() {
    return <ThreadsList />;
  }
}
