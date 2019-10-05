import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  createAppContainer,
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  NavigationInjectedProps
} from "react-navigation";

import { DrawerNav } from "./components/organisms";
import {
  AccountScreen,
  CreateGroupScreen,
  CreateThreadScreen,
  EditGroupDescriptionModal,
  EditGroupNameModal,
  GroupDetailsScreen,
  JoinGroupScreen,
  LoginScreen,
  SearchGroupsModal,
  SignupScreen,
  SplashScreen,
  ThreadScreen,
  ThreadsListScreen,
  WelcomeScreen
} from "./components/screens";
import SettingsScreen from "./components/screens/SettingsScreen";

// Stack with a list of threads in a group. Can go one level deeper into a specific thread.
const ThreadsStack = createStackNavigator({
  ThreadsList: ThreadsListScreen,
  Thread: ThreadScreen
});
ThreadsStack.navigationOptions = ({ navigation }: NavigationInjectedProps) => {
  const tabBarVisible = navigation.state.index === 0;
  return { tabBarVisible };
};

const GroupDetailsStack = createStackNavigator({
  Details: GroupDetailsScreen
});

// Account and settings
const AccountStack = createStackNavigator({
  Account: AccountScreen,
  Settings: SettingsScreen
});

// The tabs for a single group
const GroupTabs = createBottomTabNavigator(
  {
    Threads: ThreadsStack,
    Details: GroupDetailsStack
  },
  {
    initialRouteName: "Threads",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const routeName = navigation.state.routeName;
        const IconComponent = Ionicons;
        let iconName;
        if (routeName === "Threads") {
          iconName = "ios-chatboxes";
        } else if (routeName === "Details") {
          iconName = "ios-information-circle-outline";
        }
        return <IconComponent name={iconName || ""} size={25} color={tintColor || undefined} />;
      }
    })
  }
);

// Drawer navigation (to select group)
const GroupsDrawer = createDrawerNavigator(
  {
    Group: GroupTabs
  },
  {
    contentComponent: DrawerNav,
    drawerType: "back"
  }
);

// Modal stack for searching/creating a group
const CreateNodeFlow = createStackNavigator({
  SearchGroups: SearchGroupsModal,
  CreateGroup: CreateGroupScreen,
  JoinGroup: JoinGroupScreen
});

// Modal stack for creating a new thread
const CreateThreadFlow = createStackNavigator({
  CreateThread: CreateThreadScreen
});

// Authentication stack
const AuthStack = createStackNavigator({
  Welcome: WelcomeScreen,
  Signup: SignupScreen,
  Login: LoginScreen
});

// We have stack navigators for these (even though there isn't actually a stack)
// because our `RootNavigator` has `headerMode: "none"`. Sub-navigators are responsible for
// setting their own headers.
const EditGroupNameStack = createStackNavigator({
  EditGroupName: EditGroupNameModal
});
const EditGroupDescriptionStack = createStackNavigator({
  EditGroupDescription: EditGroupDescriptionModal
});

// Put modals here (as long as they only need to be accessible from within `AppTabs`)
const RootNavigator = createStackNavigator(
  {
    GroupsDrawer,
    CreateNodeFlow,
    CreateThreadFlow,
    EditGroupNameStack,
    EditGroupDescriptionStack,
    AccountStack
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

// Auth/main app switch
export default createAppContainer(
  createSwitchNavigator(
    {
      App: RootNavigator,
      Auth: AuthStack,
      Splash: SplashScreen
    },
    {
      initialRouteName: "Splash"
    }
  )
);
