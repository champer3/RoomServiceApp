import { Image, Pressable } from "react-native";
import { StyleSheet, Text, View, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
function Item({ text, image }) {
    // console.log(width)
  return (
    <View style={[styles.container, {}]}>
      <Pressable style={[styles.pressed, ({ pressed }) => pressed && { opacity: 0.5 }]}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
        </View>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );
}

export default Item;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // marginHorizontal: 10,
    height: "100%",
    width: width / 3.5,
  },
  pressed: {
    width: "86%",
    // height: "90%"
  },
  imageContainer: {
    height: height / 9,
    backgroundColor: "#E1F2CD",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: { width: "90%", height: "70%", resizeMode: "contain", },
  text: { fontWeight: "600", fontSize: 20, textAlign: "center" },
});
