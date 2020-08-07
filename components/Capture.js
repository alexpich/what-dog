import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import * as jpeg from "jpeg-js";

import * as FileSystem from "expo-file-system";

import Colors from "../constants/Colors";

getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  }
};

const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

const Capture = (props) => {
  tf.setBackend("cpu");

  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectImage = async () => {
    console.log("Selecting Image...");
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
      });

      if (!response.cancelled) {
        const source = { uri: response.uri };
        setImage(source);
        console.log("Image uploaded...");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const classifyImage = async () => {
    try {
      setLoading(true);

      const fileUri = Image.resolveAssetSource(image);
      const imgB64 = await FileSystem.readAsStringAsync(fileUri.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
      const raw = new Uint8Array(imgBuffer);
      const imageTensor = decodeJpeg(raw);
      const result = await model.classify(imageTensor);

      setPredictions(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (probability) =>
    `${(parseFloat(probability) * 100).toFixed(2)}%`;

  const renderItem = ({ item }) => (
    <Item title={item.className + ", " + formatResult(item.probability)} />
  );

  useEffect(() => {
    (async function checkTfReady() {
      console.log("1");
      await tf.ready();
    })();
    setIsTfReady(true);
    (async function checkModelReady() {
      console.log("2");
      const mobilenetModel = await mobilenet.load();
      setModel(mobilenetModel);
    })();
    console.log("3");
    setIsModelReady(true);

    getPermissionAsync();
  }, []);

  useEffect(() => {
    if (image) {
      console.log("classifying...");
      classifyImage();
    }
  }, [image]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      {isTfReady && isModelReady ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity onPress={selectImage}>
            {isModelReady && !image && (
              <Text>Pick an image from camera roll</Text>
            )}
            {image && (
              <Image source={image} style={{ width: 200, height: 200 }} />
            )}
          </TouchableOpacity>
          {isModelReady && image && predictions && (
            <SafeAreaView style={styles.listHeight}>
              {loading === true ? (
                <ActivityIndicator size="small" color={Colors.secondary} />
              ) : (
                <FlatList
                  data={predictions}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.className}
                  height
                />
              )}
            </SafeAreaView>
          )}
        </View>
      ) : (
        <ActivityIndicator size="small" color={Colors.secondary} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listHeight: {
    height: 50,
  },
});

export default Capture;
