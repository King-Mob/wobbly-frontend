import { ApolloError } from "apollo-client";
import { Constants, Notifications, Permissions, SecureStore } from "expo";
import { AsyncStorage } from "react-native";

import { client } from "./apolloClient";
import { ADD_PUSH_TOKEN, DELETE_PUSH_TOKEN } from "./graphql/mutations";
import { NavigationService } from "./services";

/**
 * Sometimes we want a function that takes no arguments and, when called, navigates to a new page.
 * We don't want to put lambda functions in JSX (for perf reasons).
 *
 * @param route the route to navigate to when the function is called
 * @param params an object with any other parameters to be passed to `navigate`
 */
export const createNavigatorFunction = (route: string, params?: any): (() => void) => {
  return () => {
    NavigationService.navigate(route, params);
  };
};

/**
 * Saves the auth token to secure storage
 * @param token the JWT
 */
export const saveAuthTokenAsync = async (token: string) => {
  await SecureStore.setItemAsync("token", token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY // iOS only
  });
};

// p shamelessly copied from https://docs.expo.io/versions/latest/guides/push-notifications/
export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // also, don't ask on a simulator/emulator since these cannot receive push notifications.
  if (existingStatus !== "granted" && Constants.isDevice) {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();

  // Send the token to your backend server from where you can retrieve it to send push notifications.
  await client.mutate({ mutation: ADD_PUSH_TOKEN, variables: { token } }).catch((err: ApolloError) => {
    throw new Error(`Failed to set push token: ${err.message}`);
  });

  // Save our push token to local storage. This is so we can delete it when we sign out
  await AsyncStorage.setItem("pushToken", token).catch(() => {
    throw new Error("Failed to save push token locally.");
  });
};

export const unregisterForPushNotificationsAsync = async () => {
  const token = await AsyncStorage.getItem("pushToken");
  if (token) {
    await client.mutate({ mutation: DELETE_PUSH_TOKEN, variables: { token } }).catch((err: ApolloError) => {
      throw new Error(`Failed to unset push token: ${err.message}`);
    });
    await AsyncStorage.removeItem("pushToken").catch(() => {
      throw new Error("Failed to remove push token from AsyncStorage");
    });
  }
};
