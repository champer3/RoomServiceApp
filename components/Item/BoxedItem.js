import { Image, Pressable } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

function BoxedItem({ text, image }) {
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: image }} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, ]}>
            {text ? text.replace(/\b\w/g, (char) => char.toUpperCase()) : ""}
          </Text>
        </View>
      </View>
  );
}

export default BoxedItem;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: { flex: 1.5, paddingHorizontal: 10 },
  container: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: "3%",
    marginTop: 20,
    flexDirection: "row",
    width: '43%',
    height: "100%"
  },
  image: { width: "150%", height: "110%", resizeMode: "contain" },
  text: { fontSize: 20, color: "rgba(0,0,0,0.8)" },
});
