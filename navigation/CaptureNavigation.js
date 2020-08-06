import { createStackNavigator } from "react-navigation";

import CaptureScreen from "../screens/dog/CaptureScreen";
import Colors from "../constants/Colors";

const CaptureNavigator = createStackNavigator(
  {
    Capture: CaptureScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.primary,
      },
    },
  }
);
