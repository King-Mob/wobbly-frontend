import { Constants } from "expo";
import * as React from "react";
import { ScrollView } from "react-native";
import { ListItem } from "react-native-elements";

import WobblyText from "../atoms/WobblyText";
import { UpdateSettingsForm } from "../organisms";

class SettingsScreen extends React.Component {
  public static navigationOptions = () => {
    return {
      title: "Account"
    };
  };

  public render() {
    const version = __DEV__ ? "test version" : Constants.manifest.version;
    return (
      <ScrollView>
        <UpdateSettingsForm />
        <ListItem
          title={<WobblyText>{(version && `Wobbly ${version}`) || "Unknown version"}</WobblyText>}
          topDivider={true}
          bottomDivider={true}
        />
      </ScrollView>
    );
  }
}

export default SettingsScreen;
