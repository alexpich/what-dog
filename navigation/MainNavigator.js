import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Platform } from "react-native";

import CaptureScreen from "../screens/dog/CaptureScreen";
import DogInfoScreen from "../screens/dog/DogInfoScreen";
import FavoritesScreen from "../screens/user/FavoritesScreen";
import GroupsScreen from "../screens/user/GroupsScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import Colors from "../constants/Colors";

const CaptureNavigator = createStackNavigator(
  {
    Capture: CaptureScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTintColor:
        Platform.OS === "android" ? Colors.white : Colors.primary,
    },
  }
);

const FavoritesNavigator = createStackNavigator(
  {
    Favorites: FavoritesScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTintColor:
        Platform.OS === "android" ? Colors.white : Colors.primary,
    },
  }
);

const DogInfoNavigator = createStackNavigator(
  {
    DogInfo: DogInfoScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTintColor:
        Platform.OS === "android" ? Colors.white : Colors.primary,
    },
  }
);

const GroupsNavigator = createStackNavigator(
  {
    Groups: GroupsScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTintColor:
        Platform.OS === "android" ? Colors.white : Colors.primary,
    },
  }
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTintColor:
        Platform.OS === "android" ? Colors.white : Colors.primary,
    },
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Capture: {
      screen: CaptureNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons name="ios-camera" size={24} color={tabInfo.tintColor} />
          );
        },
      },
    },
    Favorites: {
      screen: FavoritesNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons name="ios-star" size={24} color={tabInfo.tintColor} />
          );
        },
      },
    },
    DogInfo: {
      screen: DogInfoNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <FontAwesome5 name="dog" size={24} color={tabInfo.tintColor} />
          );
        },
      },
    },
    Groups: {
      screen: GroupsNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons name="ios-people" size={32} color={tabInfo.tintColor} />
          );
        },
      },
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons name="ios-person" size={24} color={tabInfo.tintColor} />
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.secondary,
    },
  }
);

export default createAppContainer(TabNavigator);
