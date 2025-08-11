import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { config } from "dotenv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tictactoe = require("@jeanfredrik/tictactoe");
const getWinner = tictactoe.winner(null);

config();

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server);
const client = createClient();

client.on("error", (error) => console.error(`Redis Error: ${error}`));

await client.connect();

app.post("/create", async (req, res) => {
  let creatorSymbol = ["x", "o"][Math.round(Math.random())];
  await client.json.SET(`rooms:${req.body.code}`, "$", {
    creatorID: req.body.creatorID,
    joinerID: null,
    creatorSymbol: creatorSymbol,
    joinerSymbol: creatorSymbol === "x" ? "o" : "x",
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    turn: creatorSymbol === "x" ? "creator" : "joiner",
  });
  res.sendStatus(200);
});

app.post("/join", async (req, res) => {
  let roomData;
  let creator;
  let joiner;
  let turn;

  if (
    (await client.EXISTS(`rooms:${req.body.code}`)) === 1 &&
    req.body.code !== ""
  ) {
    roomData = await client.json.GET(`rooms:${req.body.code}`);
    creator = roomData.creatorID;
    joiner = req.body.joinerID;
    turn = roomData.turn;

    console.log(req.body.code, joiner);

    await client.json.SET(`rooms:${req.body.code}`, "$.joinerID", joiner);

    io.to(creator).emit("start", {
      creatorID: creator,
      joinerID: joiner,
      creatorSymbol: roomData.creatorSymbol,
      joinerSymbol: roomData.joinerSymbol,
      turn: turn,
    });

    io.to(joiner).emit("start", {
      creatorID: creator,
      joinerID: joiner,
      creatorSymbol: roomData.creatorSymbol,
      joinerSymbol: roomData.joinerSymbol,
      turn: turn,
    });

    res.sendStatus(200);
  }
});

app.post("/exists", async (req, res) => {
  let roomExists = await client.EXISTS(`rooms:${req.body.code}`);
  res.status(200).json(roomExists);
});

app.delete("/delete", async (req, res) => {
  await client.DEL(`rooms:${req.body.code}`);
  if ((await client.EXISTS(`rooms:${req.body.code}`)) === 0) {
    console.log("Destroyed.")
    res.sendStatus(200);
  }
});

io.on("connection", async (socket) => {
  socket.on("board", async (arg) => {
    const gameData = await client.json.GET(`rooms:${arg.code}`);
    io.to(gameData.creatorID).emit("recieveBoard", {
      board: gameData.board,
      turn: gameData.turn,
    });
    io.to(gameData.joinerID).emit("recieveBoard", {
      board: gameData.board,
      turn: gameData.turn,
    });
  });

  socket.on("mark", async (arg) => {
    const markPosition = arg.position.split(",").map((item) => Number(item));
    let board = await client.json.GET(`rooms:${arg.code}`, {
      path: ["$.board"],
    });
    let otherData = await client.json.GET(`rooms:${arg.code}`);

    if (board[0][markPosition[0]][markPosition[1]] === null) {
      board[0][markPosition[0]][markPosition[1]] = arg.value;
      await client.json.SET(`rooms:${arg.code}`, "$.board", board[0]);
      await client.json.SET(
        `rooms:${arg.code}`,
        "$.turn",
        arg.turn === "creator" ? "joiner" : "creator"
      );
    }

    io.to(otherData.creatorID).emit("boardGet");
    io.to(otherData.joinerID).emit("boardGet");

    let gameResult = getWinner([
      ...board[0][0],
      ...board[0][1],
      ...board[0][2],
    ]);

    if (gameResult !== null) {
      io.to(otherData.creatorID).emit("win", gameResult);
      io.to(otherData.joinerID).emit("win", gameResult);
    } else if (
      gameResult === null &&
      board[0]
        .map((row) =>
          row
            .map((tile) => (tile === null ? 1 : 0))
            .reduce((prev, cur) => prev + cur)
        )
        .reduce((prev, cur) => prev + cur) === 0
    ) {
      io.to(otherData.creatorID).emit("draw");
      io.to(otherData.joinerID).emit("draw");
    }
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server active on port ${process.env.PORT}`)
);
