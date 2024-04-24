import { Image, Pressable, Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import FlexButton from "../Buttons/FlexButton";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart} from '../../Data/cart'
import { useState, useEffect } from 'react';
import IncrementDecrementBtn from "../Buttons/IncrementDecrementBtn";

const { width, height } = Dimensions.get("window");




function Product({ image, title, oldPrice, addOn, newPrice, reviews, category, nutrient, description, instructions, widths = 89 ,options,extras, onAdd}) {
  let size = widths;
  const [show, setShow] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  const productItems = useSelector((state) => state.productItems.ids);
  function handleAddToCart(product){
    dispatch(addToCart({id : product}))
  }
  function handleRemoveFromCart(product){
    dispatch(removeFromCart({id : product}))
  }
  function addQuantityToObjects(inputList) {

    const result = {};
    inputList.forEach(obj => {
        const title = Object.keys(obj)[0];
        const arrayLength = obj[title].length;
        result[title] = arrayLength;
    });
    return result;
}
  const item = productItems.find(item => item.title === title);


  // Example usage:

  const newList = addQuantityToObjects(cartItems);
  var quantity = 0
  if (newList){
      quantity = newList[title]
  }
  function pressHandler (){
    navigation.navigate('Product',item)

  }

  const getAverageRatingByTitle = () => {
    const item = productItems.find(item => item.title === title);

    if (item && item.reviews.length > 0) {
        const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / item.reviews.length;
        return averageRating;
    } else {
        return 0; // Indicate that there are no reviews or the item is not found
    }
};
  const rating = getAverageRatingByTitle().toFixed(0)
  var rate = []
    for (var i = 0; i < 5; i++ ){
        if (i < rating){
            rate.push('star')
        }
        else{
            rate.push('staro')
        }
    }

  return (
    <View style={[styles.container]}>
      <View style={[styles.priceView, {backgroundColor: newPrice ? "#283618" : 'white', fontStyle: newPrice ? "italic" : 'normal',}]}>
        <Text style={[styles.priceText, {color : newPrice ? 'white' : 'black'}]}>{`$${oldPrice.toFixed(2)}`}</Text>
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
                  ? title.replace(/\b\w/g, (char) => char.toUpperCase()) + '\n'
                  : "" }
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                {rate.map((star, idx)=><AntDesign key={idx} name={star} size={15} color="#BC6C25"/>)}

              </View>
              <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 20 }}>
              {reviews ? reviews.length : 0}
              </Text>
            </View>
          </Pressable>
          <View style={{ height: height / 18 }}>
            {(!show || !quantity) && <FlexButton color={"#aaa"} borderRadius={5} width={1.5} onPress={()=>{onAdd({image, title, oldPrice, newPrice, addOn, nutrient, extras, options}); setShow(true)}}>
              <Text style={{ fontSize: 10 }}>
                {" "}
                <Feather name="shopping-cart" size={10} color="black" /> Add to
                Cart
              </Text>
            </FlexButton>}
            {show && quantity && <IncrementDecrementBtn minValue={quantity} onIncrease={()=>{onAdd({image, title, oldPrice, newPrice, addOn, nutrient, extras, options})}} onDecrease ={()=>{handleRemoveFromCart({ image, title, oldPrice})}}/>}
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
    maxWidth: width / 3.3,
    height: height / 7,
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
