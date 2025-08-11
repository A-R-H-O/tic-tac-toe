import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { GameData } from "../context/gameData";
import { deleteGame } from "../services/deleteGame";
import GameTile from "./GameTile";

// i wanna cut my fucking wrist open and bleed out in my bathtub over this code.
// the entire codebase will be smeared on the wall in my blood
// 6/26/2023 8:08 PM]

// i pledge to never write code this bad again
// my head hurts for a number of reasons

function handleBack(route, navigation) {
  if (route.params.userRole === "creator") {
    deleteGame(route.params.gameCode);
  }
  navigation.navigate("Menu");
}

export default function GameScreen({ route, navigation }) {
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(route.params.turn);
  const [winState, setWinState] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    function recieveBoard(arg) {
      setBoard(arg.board);
      setTurn(arg.turn);
    }

    function handleWin(arg) {
      setWinState("win");
      setWinner(arg);
      // // i am so sorry future self if you a reading this.
      // // 6/26/23 7:30 PM gonna eat dinner
      // while (turn !== `${arg} won.`) {
      //   setTurn(`${arg} won.`);
      // }
    }

    function handleDraw() {
      setWinState("draw");
      // i better not pull fast shit like this when i write snaparena
      //   while (turn !== "Draw..") {
      //     setTurn("Draw..");
      //   }
    }

    function boardGet() {
      socket.emit("board", { code: route.params.gameCode });
    }

    socket.on("recieveBoard", recieveBoard);
    socket.on("boardGet", boardGet);
    socket.on("win", handleWin);
    socket.on("draw", handleDraw);

    socket.emit("board", { code: route.params.gameCode });

    return () => {
      socket.off("recieveBoard", recieveBoard);
      socket.off("boardGet", boardGet);
      socket.off("win", handleWin);
      socket.off("draw", handleDraw);
    };
  }, []);

  return (
    <View style={styles.gameContainer}>
      <GameData.Provider
        value={{ ...route.params, turn: turn, hasWinner: winState }}
      >
        <Text style={styles.text}>
          {turn === route.params.userRole && !winState
            ? "Your turn"
            : winState === "win"
            ? `${winner.toUpperCase()} won.`
            : winState === "draw"
            ? "Draw.."
            : "Opponents turn.."}
        </Text>
        <View style={styles.boardContainer}>
          {board.map((row, rowNumber) =>
            row.map((tile, tileNumber) => (
              <GameTile
                key={tileNumber}
                value={tile}
                position={`${rowNumber},${tileNumber}`}
              />
            ))
          )}
        </View>
        {(winState === "win" || winState === "draw") && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleBack(route, navigation)}>
              <View style={styles.button}>
                <Text style={styles.text}>Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </GameData.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    gap: 16,
  },
  boardContainer: {
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
    height: 300,
    width: 300,
    backgroundColor: "#282828",
    borderRadius: 20,
  },
  text: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "poppins-bold",
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
});
