import { Image, StyleSheet, Text, View } from "react-native";

function StartScreen() {
  return (
    <View style={styles.container}>
        <View style={styles.imageView}>
      <Image style={styles.image} source={require("../assets/RoomService.png")} />
        </View>
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#283618",
  },
  imageView: {
    width: "80%",
  },
  image: {
    width: "100%",
    resizeMode: "contain"
  },
  text: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: "44",
    color: "white"
  }
});
