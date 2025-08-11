import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { socket } from "./utils/socket";

import MainMenu from "./components/MainMenu";
import JoinScreen from "./components/JoinScreen";
import CreateScreen from "./components/CreateScreen";
import DisconnectedScreen from "./components/DisconnectedScreen";
import GameScreen from "./components/GameScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    "poppins-extra-bold": require("./assets/fonts/Poppins-ExtraBold.ttf"),
    "poppins-bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "poppins-semi": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  StatusBar.setHidden(true);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Menu"
      >
        <Stack.Screen name="Menu" component={MainMenu} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Disconnected" component={DisconnectedScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
