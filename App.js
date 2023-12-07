import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import BoxItemCategory from "./components/Category/BoxItemCategory";

export default function App() {
  // return (
  //   <BoxItemCategory
  //     items={[
  //       { text: "hbjdbc", image: require("./assets/image.png") },
  //       { text: "hbjdbc", image: require("./assets/image.png") },
  //     ]}
  //   />
  // );
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Code this shit</Text>
        <BoxItemCategory
      items={[
        { text: "Snack", image: require("./assets/snack.png") },
        { text: "Snack", image: require("./assets/snack.png") },
      ]}
    />
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
