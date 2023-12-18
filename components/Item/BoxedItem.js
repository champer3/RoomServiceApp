import { Image, Pressable } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
function BoxedItem({ text, image}) {
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Category', {cat: text})
  }
  return (

      <Pressable style={styles.container} onPress = {pressHandler}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text]}>
            {text ? text.replace(/\b\w/g, (char) => char.toUpperCase()) : ""}
          </Text>
        </View>
      </Pressable>
  );
}

export default BoxedItem;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    marginHorizontal: "1%",
    marginTop: 20,
    flexDirection: "row",
    width: "48%",
  },
  imageContainer: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {  flex: 1.5, paddingHorizontal: 10 },
  image: { width: 80, height: 100, resizeMode: "contain" },
  text: { fontSize: 14,fontWeight: 'bold', color: "rgba(0,0,0,0.8)" },
});
