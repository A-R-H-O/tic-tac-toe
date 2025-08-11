import {deleteGame} from "../services/deleteGame"
import axios from "axios"

export function generateCode(oldCode) {
  let code = String(Math.trunc(Math.random() * 100000));
  let canReturn = true;

  if (code.length === 4) code += "0";

  if (oldCode !== "") deleteGame(oldCode);

  axios
    .post(
      Platform.OS === "android"
        ? "http://10.0.2.2:3001/exists"
        : "http://192.168.1.114:3001/exists",
      { code: code }
    )
    .then((res) => {
      if (res.data === 1) canReturn = false;
      else if (res.data === 0) canReturn = true;
    });

  console.log(code);
  if (canReturn) return code;
  else if (!canReturn) generateCode(code);
}
