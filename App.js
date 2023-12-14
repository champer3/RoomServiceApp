import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import BoxItemCategory from "./components/Category/BoxItemCategory";
import Category from "./screens/category/Category";
import CategorySearch from "./screens/category/CategorySearch";
import Home from "./screens/Home";
import Deal from "./components/Category/Deal";
import ProductDisplay from "./screens/ProductDisplay";
import DealsScreen from "./screens/DealsScreen";

export default function App() {
  return (
    <>
    <DealsScreen />
    </>
  );
  // return (
  //   <PaperProvider>
  //     <View style={styles.container}>
  //       <Text>Code this shit</Text>
  //       <StatusBar style="auto" />
  //     </View>
  //   </PaperProvider>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
