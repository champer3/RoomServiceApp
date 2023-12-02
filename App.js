import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import CardStore from "./components/CardStore";

export default function App() {
  return (
    <PaperProvider >
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>New Code</Text>
      <CardStore card="Master Card" number={5342} />
      <StatusBar style="auto" />
    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

  },

});
