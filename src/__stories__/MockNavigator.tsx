import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import { View } from "react-native";
import { Header } from "react-native-elements";
import {
  createNavigator,
  NavigationAction,
  NavigationActions,
  NavigationDescriptor,
  StackRouter
} from "react-navigation";

import WobblyText from "../components/atoms/WobblyText";
import { NavigationService } from "../services";

interface IMockAppProps {
  screen: React.ComponentType;
  navigationParams?: {};
}

/**
 * Minimal stub providing enough of react-navigation's behavior for stories
 * without doing anything anoying like modifying the browser history
 */
export class MockNavigator extends React.Component<IMockAppProps> {
  public navigator = createNavigator(
    NavigationView,
    StackRouter(
      { Screen: this.props.screen },
      { initialRouteName: "Screen", initialRouteParams: this.props.navigationParams }
    ),
    {}
  );

  public state = {
    nav: this.navigator.router.getStateForAction(NavigationActions.init({ params: this.props.navigationParams }))
  };

  private subscribers = new Set();
  private navigation: any;

  public componentDidMount() {
    NavigationService.setTopLevelNavigator(this.navigator);

    this.subscribers.forEach(subscriber =>
      subscriber({
        type: "action",
        action: NavigationActions.init({ params: this.props.navigationParams }),
        state: this.state.nav,
        lastState: null
      })
    );
  }

  public render() {
    // No typings for available for react-navigation/core
    const { NavigationProvider, getNavigation } = require("@react-navigation/core");
    const Navigator = this.navigator;

    this.navigation = getNavigation(
      this.navigator.router,
      this.state.nav,
      this.handleNavigationAction,
      this.subscribers,
      () => undefined,
      () => this.navigation
    );

    return (
      <NavigationProvider value={this.navigation}>
        <Navigator navigation={this.navigation} />
      </NavigationProvider>
    );
  }

  private handleNavigationAction = (action: NavigationAction) => {
    const lastState = this.state.nav;
    const newState = this.navigator.router.getStateForAction(action, lastState);

    const dispatchEvents = () => {
      this.subscribers.forEach(subscriber =>
        subscriber({
          type: "action",
          action,
          state: newState,
          lastState
        })
      );
    };

    if (newState && newState !== lastState) {
      this.setState({ nav: newState }, dispatchEvents);
    } else {
      dispatchEvents();
    }
  };
}

interface INavigationViewProps {
  descriptors: Record<string, NavigationDescriptor>;
  navigation: any;
}
/**
 * Stub navigation view capable of rendering a basic header.
 * TODO: make the styling of the header match native header (or always use the react-native-elements one)
 */
function NavigationView({ descriptors, navigation }: INavigationViewProps) {
  const { SceneView } = require("@react-navigation/core");

  const activeKey = navigation.state.routes[navigation.state.index].key;
  const descriptor = descriptors[activeKey];
  const { header, headerStyle, headerTitleStyle, headerTitle, headerLeft, headerRight, title } = descriptor.options;
  const unwrapHeaderComponent = (x: typeof headerLeft) => (typeof x === "function" ? x({}) : x);

  const defaultHeader = (
    <Header
      leftComponent={unwrapHeaderComponent(headerLeft) || undefined}
      rightComponent={unwrapHeaderComponent(headerRight) || undefined}
      containerStyle={[{ backgroundColor: "coral" }, headerStyle]}
      centerComponent={<WobblyText style={headerTitleStyle}>{headerTitle || title}</WobblyText>}
    />
  );

  return (
    <ActionSheetProvider>
      <View style={{ width: "100%", height: "100%" }}>
        {typeof header === "undefined" ? defaultHeader : header}
        <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
      </View>
    </ActionSheetProvider>
  );
}
