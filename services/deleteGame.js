import axios from "axios"

export function deleteGame(code) {
  axios
    .delete(
      Platform.OS === "android"
        ? "http://10.0.2.2:3001/delete"
        : "http://192.168.1.114:3001/delete",
      { data: { code: code } }
    )
    .catch((err) => console.error(err));
}