import * as React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingState: React.SFC = () => (
  <View style={style.container}>
    <ActivityIndicator size="large" />
  </View>
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
});

export default LoadingState;
