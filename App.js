import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Provider as PaperProvider } from "react-native-paper";
import Input from "./components/Inputs/Input";
import Product from "./components/Product/Product";
import CodeInput from "./components/Inputs/CodeInput";

export default function App() {
  return (
    <PaperProvider >
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>New Code</Text>
      <View style={{flexDirection: 'row', width: 600}}>
        <Product />
        <Product/>
      </View>
      <View style={{flexDirection: 'row', width: 500}}>
        <Product width={500}/>
      </View>
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
