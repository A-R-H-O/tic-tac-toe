import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TouchableHighlight
} from "react-native";
import useConnectionRedirect from "../hooks/useConnectionRedirect";

export default function MainMenu({ navigation }) {
  useConnectionRedirect(navigation)
  return (
    <SafeAreaView style={styles.appContainer}>
      <Text style={styles.title}>Jick Zach Beau</Text>

      <View style={styles.buttonContainer}>
        <TouchableHighlight onPress={() => navigation.navigate("Join")}>
          <View style={styles.button}>
            <Text style={styles.text}>Join a Game</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => navigation.navigate("Create")}>
          <View style={styles.button}>
            <Text style={styles.text}>Create a Game</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,

    justifyContent: "space-evenly",
    alignItems: "center",

    backgroundColor: "#101010",

    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  title: {
    color: "#ffff",
    fontSize: 40,
    fontFamily: "poppins-extra-bold",
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
    fontSize: 0,
    color: "#232323",
  },

  button: {
    width: 230,
    height: 60,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  buttonContainer: {
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  }
});
