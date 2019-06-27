import * as React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../style/common";
import WobblyText from "../atoms/WobblyText";

interface INonIdealStateProps {
  IconFamily: React.ComponentType<any>;
  iconName: string;
  title: string;
  subtitle?: string;
}
const NonIdealState: React.SFC<INonIdealStateProps> = ({ IconFamily, iconName, title, subtitle }) => (
  <View style={style.container}>
    <IconFamily name={iconName} size={50} color={colors.gray1} />
    <WobblyText title2={true} style={style.title}>
      {title}
    </WobblyText>
    {subtitle && <WobblyText style={style.subtitle}>{subtitle}</WobblyText>}
  </View>
);
export default NonIdealState;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  title: {
    marginVertical: 5,
    color: colors.gray1
  },
  subtitle: {
    color: colors.gray1,
    textAlign: "center",
    marginHorizontal: 15
  }
});
