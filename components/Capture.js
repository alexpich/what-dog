import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

const stateMachine = {
  initial: "initial",
  states: {
    initial: { on: { next: "loadingModel", text: "Load Model" } },
    loadingModel: { on: { next: "modelReady", text: "Loading Model" } },
    modelReady: { on: { next: "imageReady", text: "Upload Image" } },
    imageReady: {
      on: { next: "identifying" },
      text: "Identify Breed",
      showImage: true,
    },
    identifying: { on: { next: "complete", text: "Identifying…" } },
    complete: {
      on: { next: "modelReady" },
      text: "Reset",
      showImage: true,
      showResults: true,
    },
  },
};

const formatResult = ({ className, probability }) => (
  <li key={className}>
    {`${className}:`}{" "}
    <span className="probability">{`${(probability * 100).toFixed(2)}%`}</span>
  </li>
);

const Capture = () => {
  tf.setBackend("cpu");

  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    (async function checkReady() {
      await tf.ready();
    })();
    setIsTfReady(true);
  }, []);

  return (
    <View>
      <Text>Capture component!!!</Text>
      <Text>TFJS ready? {isTfReady ? <Text>Yes</Text> : ""}</Text>
    </View>
  );
};

export default Capture;
