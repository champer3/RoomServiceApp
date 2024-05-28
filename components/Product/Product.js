import { Image, Pressable, Dimensions } from "react-native";
import { StyleSheet, View } from "react-native";
import FlexButton from "../Buttons/FlexButton";
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../Text';
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart} from '../../Data/cart'
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import IncrementDecrementBtn from "../Buttons/IncrementDecrementBtn";
import CircleButton from "../Buttons/CircleButton";
import IncrementDecrementBton from "../Buttons/IncrementDecrementBtn copy";

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
    <View style={{paddingTop: 9}}>
    <View style={[styles.container,{  shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
    }]}>
      
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
                numberOfLines={title.length > 25 ? 2 : 1}
              >
                {title
                  ? title.replace(/\b\w/g, (char) => char.toUpperCase()) + '\n'
                  : "" }
              </Text>
              <View style={[styles.priceView, {backgroundColor: newPrice ? "#283618" : 'white', fontStyle: newPrice ? "italic" : 'normal', paddingHorizontal: newPrice ? 6 : 0,}]}>
                <Text style={[styles.priceText, {color : newPrice ? 'white' : 'black'}]}>{`$${oldPrice.toFixed(2)}`}</Text>
              {newPrice && <Text style={styles.crossPrice}>{`$${newPrice}`}</Text>}
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
    <View style={{ height: height / 18, position: 'absolute', top: 0 , right: 0,zIndex: 12}}>
      {(!show || !quantity) && <Pressable style={{backgroundColor: 'white', borderRadius: 100, borderRightColor: '#aaa', borderRightWidth: 0.5,   shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
    }} onPress={()=>{onAdd({image, title, oldPrice, newPrice, addOn, nutrient, extras, options}); setShow(true)}}>
        <AntDesign name="pluscircle" size={32} color="#BC6C25" />
      </Pressable>}
      {show && quantity && <IncrementDecrementBton minValue={quantity} onIncrease={()=>{onAdd({image, title, oldPrice, newPrice, addOn, nutrient, extras, options})}} onDecrease ={()=>{handleRemoveFromCart({ image, title, oldPrice})}}/>}
    </View>
    </View>
  );
}
export default Product;
const styles = StyleSheet.create({
  container: {
    // borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 15,
    // marginTop: 20,
    padding: 10,
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
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    borderColor : '#aaa',
    borderRadius: 10,
    marginTop: 2,
    paddingTop: 0.5,
    borderRadius: 30,
  },
  priceText: {
    color: "white",
    // fontWeight: "900",
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
