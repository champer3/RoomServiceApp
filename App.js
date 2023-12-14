import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import BoxItemCategory from "./components/Category/BoxItemCategory";
import Category from "./screens/category/Category";
import ProductDisplay from "./screens/ProductDisplay";

export default function App() {
  return (
    // <Category />
    <ProductDisplay/>
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
