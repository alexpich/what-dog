import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";

import CaptureScreen from "../screens/dog/CaptureScreen";
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

export default createAppContainer(CaptureNavigator);
