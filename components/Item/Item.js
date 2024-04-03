import { Image, Pressable } from "react-native";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');
function Item({ text, image , onPress, color, show}) {

const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Category', {cat: text})
  }
    // console.log(width)
  return (
      <Pressable onPress={pressHandler} style={ ({ pressed }) => pressed && { opacity: 0.5 }}>

        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
        </View>
        {show && <Text style={[styles.text, {color: "white" ? color : "black"}]}>{text}</Text>}

      </Pressable>
  );
}

export default Item;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // marginHorizontal: 10,
    height: height/2,
    // height: 200,
    width: width / 3.6,

  },
  pressed: {
    // width: "86%",
    // height: "90%"
  },
  imageContainer: {
    // backgroundColor: "#f9f3cf59",
    backgroundColor: "white",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    height: height/13,
    width: width/6.2,
  },
  image: { width: width/5.8, height: height/ 18, resizeMode: 'contain'  },
  text: { fontWeight: "bold", fontSize: 13, textAlign: "center" },
});
