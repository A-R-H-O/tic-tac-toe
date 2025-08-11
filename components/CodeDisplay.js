import { StyleSheet, View, Text } from "react-native";

export default function CodeDisplay({ code }) {
  return (
    <View style={styles.charsContainer}>
      <View style={styles.charContainer}>
        <Text style={styles.char}>{code[0]}</Text>
      </View>
      <View style={styles.charContainer}>
        <Text style={styles.char}>{code[1]}</Text>
      </View>
      <View style={styles.charContainer}>
        <Text style={styles.char}>{code[2]}</Text>
      </View>
      <View style={styles.charContainer}>
        <Text style={styles.char}>{code[3]}</Text>
      </View>
      <View style={styles.charContainer}>
        <Text style={styles.char}>{code[4]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  charsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    width: 320,
  },

  charContainer: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 10,
    backgroundColor: "#232323",
  },

  char: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "poppins-bold"
  }
});
