import axios from "axios";
import { socket } from "../utils/socket";

export function joinGame(code) {
  axios
    .post(
      Platform.OS === "android"
        ? "http://10.0.2.2:3001/join"
        : "http://192.168.1.114:3001/join",
      { code: code, joinerID: socket.id }
    )
    .catch((err) => console.error(err))
}
