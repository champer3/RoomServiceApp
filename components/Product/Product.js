import { Image, Pressable, Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import FlexButton from "../Buttons/FlexButton";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");




function Product({ image, title, oldPrice, newPrice, widths = 90 }) {
 console.log(image)
  let size = widths;
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Product', {image: image, title : title})
  }
  return (
    <View style={[styles.container]}>
      <View style={[styles.priceView, {backgroundColor: newPrice ? "#283618" : 'white', fontStyle: newPrice ? "italic" : 'normal',}]}>
        <Text style={[styles.priceText, {color : newPrice ? 'white' : 'black'}]}>{`$${oldPrice}`}</Text>
        {newPrice && <Text style={styles.crossPrice}>{`$${newPrice}`}</Text>}
      </View>
      <View style={styles.imageContainer}>
        <View
          style={{
            flex: -1,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
            // width: "10%"
          }}
        >
          <Pressable onPress={pressHandler} style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Image
              style={styles.image}
              source={image}
            />
          </Pressable>
        </View>

        <View style={{ flex: -1.5, width: `${size < 50 ? 100 : size * 3.75/6 }%`, gap: 10, paddingTop: 12 }}>
          <Pressable onPress={pressHandler} style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <View style={styles.textContainer}>
              <Text
                style={[styles.text]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {title
                  ? title.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <AntDesign name="star" size={15} color="#BC6C25" />
                <AntDesign name="star" size={15} color="#BC6C25" />
                <AntDesign name="star" size={15} color="#BC6C25" />
                <AntDesign name="star" size={15} color="#BC6C25" />
                <AntDesign name="star" size={15} color="#BC6C25" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 20 }}>
                53
              </Text>
            </View>
          </Pressable>
          <View style={{ height: height / 20 }}>
            <FlexButton color={"#aaa"} borderRadius={5} width={1.5}>
              <Text style={{ fontSize: 10 }}>
                {" "}
                <Feather name="shopping-cart" size={10} color="black" /> Add to
                Cart
              </Text>
            </FlexButton>
          </View>
        </View>
      </View>
    </View>
  );
}
export default Product;
const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    marginHorizontal: 8,
    // marginTop: 20,
    padding: 12,
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    // borderWidth: 2
  },
  textContainer: { marginBottom: 5 },
  image: {
    maxWidth: width / 3.7,
    height: height / 8,
    alignSelf: "center",
  },
  text: { fontSize: 14, fontWeight: 500 },
  priceView: {
    position: "absolute",
    top: 15,
    zIndex: 2,
    left: 15,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    
    borderWidth: 1,
    borderColor : '#aaa', 
    borderRadius: 10,
    padding: 0.5,
    paddingHorizontal: 6,
    borderRadius: 30,
    zIndex: 1,
  },
  priceText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
});
