import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { joinGame } from "../services/joinGame";
import { socket } from "../utils/socket";
import CodeDisplay from "./CodeDisplay";

export default function JoinScreen({ navigation }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    function handleStart(args) {
      console.log(args, "TWO")
      navigation.navigate("Game", {
        ...args,
        userRole: "joiner",
        gameCode: code,
      });
    }

    if (code.length === 5) {
      socket.on("start", handleStart);

      return () => {
        socket.off("off", handleStart);
      };
    }
  }, [code]);

  return (
    <SafeAreaView style={styles.joinContainer}>
      <View style={styles.codeContainer}>
        <Text style={styles.text}>Enter a code</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setCode(text)}
          caretHidden={true}
          maxLength={5}
          keyboardAppearance="dark"
          keyboardType="number-pad"
        />
        <CodeDisplay code={code.split("")} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableHighlight onPress={() => navigation.goBack()}>
          <View style={styles.button}>
            <Text style={styles.text}>Back</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => joinGame(code)}>
          <View style={styles.button}>
            <Text style={styles.text}>Join</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    height: 100,
    width: 320,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 70,
  },

  text: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "poppins-bold",
  },

  textInput: {
    position: "absolute",
    height: 200,
    width: 320,
    zIndex: 2,
    fontSize: 0.1,
    color: "#232323",
  },

  joinContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    gap: 40,
  },

  button: {
    width: 120,
    height: 60,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});
