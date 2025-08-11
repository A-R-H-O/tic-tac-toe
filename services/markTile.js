import { socket } from "../utils/socket";

// 6/25/23
// Its something who the person who is going has...
// Now please, shoot me.
// NOW
// I SAID NOW DAMNIT.
// programming gods please forgive me for all my sin.
// i better write better code when i write snaparena.
// thats why im going to plan everything out, which for this app, i didnt fucking do.

// 6/26/23 | 9:40 AM
// okay we fixed it. it was variable names :D
// ig a learned more about websockets through all that mental distress.
// programming is comparable to BDSM.
export function markTile(gameData, position) {
  if (gameData.turn === gameData.userRole && !gameData.hasWinner) {
    socket.emit("mark", {
      code: gameData.gameCode,
      position: position,
      turn: gameData.turn,
      value:
        gameData.userRole === "creator"
          ? gameData.creatorSymbol
          : gameData.joinerSymbol,
    });
  }
}
