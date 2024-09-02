import { Image, Pressable, Dimensions } from "react-native";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from '../Text';
const { width, height } = Dimensions.get("window");



function ProductAction({title, image, price, reviews, category, quantity, action, onTap, children }) {
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Product', {title: title, image : image, reviews: reviews, oldPrice: price, category: category })
  }
    function isValidURL(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    
    return str.startsWith("http://") || str.startsWith("https://");
  }
  return (
    <Pressable onPress={onTap} style={[styles.container,
      {shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
    }
    ]}>
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
          <Pressable onPress={onTap} style={({ pressed }) => pressed && { opacity: 0.5 }}>
          {image && isValidURL(image) && <Image
              style={styles.image}
              source={{uri:image}}
            />}
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
                {title
                  ? title.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ""}
              </Text>
              </View>
              {action}
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 9, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 18}}>{`$${(price).toFixed(2)}`}</Text>
                {quantity != null && <View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 5, borderRadius: 50}}>
                    <Text>{quantity}</Text>
                </View>}
              </View>
              <View style={{width: '45%'}}>
               {children}
            </View>
            </View>
        </View>
      </View>
    </Pressable>
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
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
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
    width: width / 5.7,
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
    // fontWeight: "900",
    fontStyle: "italic",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    // fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
});
