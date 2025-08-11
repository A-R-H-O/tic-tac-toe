import { useState, useEffect, useContext } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { markTile } from "../services/markTile";
import { GameData } from "../context/gameData";

export default function GameTile({ value, position }) {
  function determineStyle(styleValue) {
    if (styleValue === "x") return styles.x;
    else if (styleValue === "o") return styles.o;
    else if (styleValue === null) return styles.blank;
  }

  const [style, setStyle] = useState(determineStyle());
  const gameData = useContext(GameData);

  useEffect(() => setStyle(determineStyle(value)), [value]);

  return (
    <TouchableWithoutFeedback onPress={() => markTile(gameData, position)}>
      <View style={styles.boardTile}>
        <Text style={style}> {value ?? ""} </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  boardTile: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#404040",
    borderRadius: 10,
  },

  x: {
    display: "flex",
    color: "red",
    fontSize: 60,
  },

  o: {
    display: "flex",
    color: "blue",
    fontSize: 60,
  },

  blank: {
    fontSize: 0.1,
  },
});
