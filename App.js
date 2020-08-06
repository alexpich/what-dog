import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import CaptureScreen from "./screens/dog/CaptureScreen";
import CaptureNavigator from "./navigation/CaptureNavigator";

export default function App() {
  return <CaptureNavigator />;
}

