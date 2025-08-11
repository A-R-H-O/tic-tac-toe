import { View, Text, StyleSheet } from "react-native"

export default function DisconnectedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Looks like you're offline.</Text>
      <Text style={styles.text}>Please check your internet and try again.</Text>
      <Text style={styles.text}>This app requires a stable internet connection.</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    gap: 8,
  },

  title: {
    color: "#ffff",
    fontSize: 30,
    fontFamily: "poppins-extra-bold",
  },

  text: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "poppins-bold",
  },
})