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
  Button,
  SafeAreaView,
} from "react-native";

import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import * as jpeg from "jpeg-js";

import * as FileSystem from "expo-file-system";

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

const Capture = () => {
  tf.setBackend("cpu");

  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
      });

      if (!response.cancelled) {
        const source = { uri: response.uri };
        setImage(source);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const classifyImage = async () => {
    try {
      const fileUri = Image.resolveAssetSource(image);
      const imgB64 = await FileSystem.readAsStringAsync(fileUri.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
      const raw = new Uint8Array(imgBuffer);
      const imageTensor = decodeJpeg(raw);
      const result = await model.classify(imageTensor);

      setPredictions(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const formatResult = (probability) =>
    `${(parseFloat(probability) * 100).toFixed(2)}%`;

  const renderItem = ({ item }) => (
    <Item title={item.className + ", " + formatResult(item.probability)} />
  );

  useEffect(() => {
    (async function checkTfReady() {
      await tf.ready();
    })();
    setIsTfReady(true);
    (async function checkModelReady() {
      // await mobilenet.load();
      const mobilenetModel = await mobilenet.load();
      setModel(mobilenetModel);
    })();
    setIsModelReady(true);

    getPermissionAsync();
  }, []);

  useEffect(() => {
    if (image) {
      classifyImage();
    }
  }, [image]);

  return (
    <View style={styles.container}>
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
              <FlatList
                data={predictions}
                renderItem={renderItem}
                keyExtractor={(item) => item.className}
                height
              />
            </SafeAreaView>
          )}
        </View>
      ) : (
        <Text>Loading...</Text>
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
