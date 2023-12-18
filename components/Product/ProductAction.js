import { Image, Pressable, Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");



function ProductAction({ image, quantity, action,  children }) {
  let text = "Goldfish Flavor Blasted Xtra Cheddar Crackers 6.6oz";
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Product')
  }
  return (
    <View style={[styles.container]}>
      <View style={styles.imageContainer}>
        <View
          style={{
            flex: -1,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 30,
            paddingVertical: 20,
            paddingHorizontal: 30,
          }}
        >
          <Pressable onPress={pressHandler} style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Image
              style={styles.image}
              source={require("../../assets/snack.png")}
            />
          </Pressable>
        </View>

        <View style={{ flex: -1.5, justifyContent: 'space-between',gap: 9 }}>
          
            <View style={styles.textContainer}>
                <View style= {{width: '80%'}}>
              <Text
                style={[styles.text]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {text
                  ? text.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ""}
              </Text>
              </View>
              {action}
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 9, alignItems: 'center' }}
              >
                <Text style={{fontWeight: 'bold', fontSize: 18}}>$3.69</Text>
                {quantity && <View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 5, borderRadius: 50}}>
                    <Text>{quantity}</Text>
                </View>}
              </View>
              <View style={{width: '45%'}}>
               {children}
            </View>
            </View>
        </View>
      </View>
    </View>
  );
}
export default ProductAction;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 45,
    // marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "space-around",
    
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
    // borderWidth: 2
  },
  textContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  image: {
    maxWidth: width / 5.7,
    height: height / 12,
  },
  text: { fontSize: 16, fontWeight: 500, lineHeight: 25, },
  priceView: {
    position: "absolute",
    top: 15,
    zIndex: 2,
    left: 15,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "#283618",
    padding: 0.5,
    paddingHorizontal: 6,
    borderRadius: 30,
    zIndex: 1,
  },
  priceText: {
    color: "white",
    fontWeight: "900",
    fontStyle: "italic",
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
