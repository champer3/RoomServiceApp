import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
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
  payment: {
    height: 96,
    width: "50%",
    alignSelf: 'flex-start',
    marginLeft: 45
  },
  cart: {
    width: "40%",
    height: "8%"
  },
  button: {
    height: 100,
    width: "80%"
  },
  image: {
    resizeMode: "contain",
    width: "80%",
    opacity: 1
  },
  google: {

  }
});
