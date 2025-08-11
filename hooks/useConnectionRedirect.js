import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { socket } from "../utils/socket";

function socketRedirect(err) {
  console.error(err);
  navigation.navigate("Disconnected");
}

export default function useConnectionRedirect(navigation) {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable) navigation.navigate("Menu");
      if (!state.isInternetReachable && state.isInternetReachable !== null)
        navigation.navigate("Disconnected");
    });
    socket.on("connection_error", socketRedirect);
    return () => {
      unsubscribe();
      socket.off("connection_error", socketRedirect);
    };
  }, []);
}
