import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StoryDecorator } from "@storybook/react";
import { IMocks } from "graphql-tools";
import React from "react";
import { View } from "react-native";
import { NavigationScreenOptions } from "react-navigation";

import { GraphQLMockProvider } from "./MockClient";
import { MockNavigator } from "./MockNavigator";

export interface IScreenWrapperProps extends IScreenLayoutProps {
  navigationOptions?: NavigationScreenOptions;
  mocks?: IMocks;
}
/**
 * Story decorator to inject in all the required context
 */
export function screenWrapper({ navigationOptions, mocks, ...layoutProps }: IScreenWrapperProps = {}): StoryDecorator {
  return (story, params) => {
    class Screen extends React.Component {
      public static navigationOptions = {
        title: params.kind,
        ...navigationOptions
      };

      public render() {
        return story();
      }
    }

    return (
      <GraphQLMockProvider mocks={mocks}>
        <ScreenLayout {...layoutProps}>
          <ActionSheetProvider>
            <MockNavigator screen={Screen} />
          </ActionSheetProvider>
        </ScreenLayout>
      </GraphQLMockProvider>
    );
  };
}

interface IScreenStoryOpts {
  navigationParams?: {};
  mocks?: IMocks;
}
/**
 * Return a story that renders a whole screen, with the appropriate context set up
 * and, optionally, any navigation params / custom data
 */
export function screenStory(Screen: React.ComponentType<any>, { navigationParams, mocks }: IScreenStoryOpts = {}) {
  return () => (
    <GraphQLMockProvider mocks={mocks}>
      <ScreenLayout>
        <ActionSheetProvider>
          <MockNavigator screen={Screen} navigationParams={navigationParams} />
        </ActionSheetProvider>
      </ScreenLayout>
    </GraphQLMockProvider>
  );
}

interface IScreenLayoutProps {
  backgroundColor?: string;
  children?: React.ReactNode;
}
/**
 * Fixes the story dimensions to a phone screen size and renders a phone around the story if running interactively
 */
function ScreenLayout({ children, backgroundColor = "white" }: IScreenLayoutProps) {
  // If running snapshot test, skip phone image surrounding the story and use the screen dimensions specified by the
  // test configuration
  if (process.env.STORYBOOK_LOKI) {
    return (
      <View
        style={{
          backgroundColor,
          width: "100vw",
          height: "100vh",
          display: "flex",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {children}
      </View>
    );
  }

  // If running interactively, render with phone around the story
  return (
    <View>
      <img style={{ position: "absolute", width: 431 }} src={require("./phone.svg")} />
      <View
        style={{
          backgroundColor,
          display: "flex",
          position: "absolute",
          overflow: "hidden",
          left: 28,
          top: 105,
          height: 667,
          width: 375
        }}
      >
        {children}
      </View>
    </View>
  );
}
