import React from "react";
import { View } from "react-native";
import Capture from "../../components/Capture";

const CaptureScreen = () => {
  return <Capture />;
};

CaptureScreen.navigationOptions = {
  headerTitle: "Capture",
};

export default CaptureScreen;
