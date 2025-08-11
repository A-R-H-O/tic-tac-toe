import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { deleteGame } from "../services/deleteGame";
import { generateCode } from "../utils/generateCode";
import { socket } from "../utils/socket";
import axios from "axios";
import CodeDisplay from "./CodeDisplay";

export default function CreateScreen({ navigation }) {
  const [code, setCode] = useState("");
  const [topText, setTopText] = useState("Create a game");

  useEffect(() => {
    axios
      .post(
        Platform.OS === "android"
          ? "http://10.0.2.2:3001/create"
          : "http://192.168.1.114:3001/create",
        { code: code, creatorID: socket.id }
      )
      .then((res) => {
        if (res.status === 200 && code !== "") {
          setTopText("Game created!");
          setTimeout(() => setTopText("Waiting for opponent..."), 2500);
        }
      })
      .catch((err) => {
        setTopText("Failed to create game.");
        console.error(err);
      });
  }, [code]);

  useEffect(() => {
    function handleStart(args) {
      console.log(args, "ONE")
      navigation.navigate("Game", {
        ...args,
        userRole: "creator",
        gameCode: code,
      });
    }

    socket.on("start", handleStart);

    return () => {
      socket.off("start", handleStart);
    };
  }, [code]);

  return (
    <SafeAreaView style={styles.createContainer}>
      <Text style={styles.waitingText}>{topText}</Text>
      <View style={styles.codeContainer}>
        <Text style={styles.text}>Share this code to play:</Text>
        <CodeDisplay code={code.split("")} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableHighlight
          onPress={() => {
            deleteGame(code);
            navigation.goBack();
          }}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Back</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => setCode(generateCode(code))}>
          <View style={styles.button}>
            <Text style={styles.textSmall}>Generate</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    gap: 40,
  },

  text: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "poppins-bold",
  },

  textSmall: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "poppins-bold",
  },

  codeContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 70,
  },

  button: {
    width: 120,
    height: 60,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  waitingText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "poppins-semi",
  },
});
