import { Image, Pressable, Dimensions , ImageBackground} from "react-native";
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
import { TouchableOpacity } from "react-native-gesture-handler";
import Svg, {Path} from 'react-native-svg';
const { width, height } = Dimensions.get("window");
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "react-native-paper";




function Product({product}) {
  function isValidURL(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    
    return str.startsWith("http://") || str.startsWith("https://");
  }
  function handleIncrement() {
    if (!canAddToCart()){
      navigation.navigate('Product',{product, productData})
      return
    }
    dispatch(addToCart({id : productData }))
   }
  const canAddToCart = () => {
    // Check if there are at least 2 items in the extra array
    if (product.extra) {
      return false; // Cannot add to cart if there are fewer than 2 extra items
    } if (product.components?.length > 0){
      return false
    }
    for (let optionCategory of product.options) {
      if (optionCategory?.required) {
          return false; // Cannot add to cart if any required category doesn't meet the required quantity
        }
      }
    return true; 
  };
  const dummyData = {
    id: 1,
    title: "Classic Cheese Burger",
    image: "https://example.com/cheese-burger.jpg", // Replace with your own image URL
    description: "Juicy beef patty topped with melted cheese, fresh lettuce, tomato, pickles, and our special sauce, all nestled in a toasted bun.",
    price: 15.50,
    rating: 4.8,
    time: 12, // in minutes
    calories: 145, // in kcal
    extras: [
      {
        name: "More Ham",
        price: 4.50,
      },
      {
        name: "Spicy",
        price: 0.50,
      },
      {
        name: "Add Egg",
        price: 2.00,
      },
    ],
    options: [{'name': 'Flavors', 'value': [
      {
        name: 'Barbeque',
        price: 0
      },
      {
        name: 'Lemon Hot',
        price: 0
      },
      {
        name: 'Hot',
        price: 0
      },
      {
        name: 'Mild Hot',
        price: 0
      },
    ] ,  'required': false,
    'quantity': 2
  },{'name': 'Drinks', 'value': [
      {
        name: 'Coca Cola',
        price: 2,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
      {
        name: 'Smirnoff',
        price: 1,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
      {
        name: 'Pepsi',
        price: 2,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
      {
        name: 'Lemonade',
        price: 3,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
    ],
    'required': false,
    'quantity': 4
  }]
  };
  const constructProductFormObject = (product) => {
    // Initialize the form object
    let formObject = {
      extra: product.extra ? [] : null, // If extra is true, set to an empty array
      components: product.components.length > 0 ? '' : null, // If components exist, set empty string
      options: [], // Prepare options array
      products: [product],
      instructions: product.instructions ? '' : null, // If instructions are true, set empty string
    };
  
    // Loop through options and set the values array to empty
    if (product.options) {
      formObject.options = dummyData.options.map(option => ({
        name: option.name,
        required: option.required || false,
        quantity: option.quantity || null,
        values: [] // Set values to an empty array
      }));
    }
  
    return formObject;
  };
  const productData = constructProductFormObject(product);
//   const [show, setShow] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
//   const productItems = useSelector((state) => state.productItems.ids);
//   function handleAddToCart(product){
//     dispatch(addToCart({id : product}))
//   }
//   function handleRemoveFromCart(product){
//     dispatch(removeFromCart({id : product}))
//   }
//   function addQuantityToObjects(inputList) {

//     const result = {};
//     inputList.forEach(obj => {
//         const title = Object.keys(obj)[0];
//         const arrayLength = obj[title].length;
//         result[title] = arrayLength;
//     });
//     return result;
// }
//   // const item = productItems.find(item => product.title === title);


//   // Example usage:

//   const newList = addQuantityToObjects(cartItems);
//   var quantity = 0
//   if (newList){
//       quantity = newList[title]
//   }
  function pressHandler (){
    navigation.navigate('Product',{product, productData})

  }

//   const getAverageRatingByTitle = () => {
//     const item = productItems.find(item => item.title === title);

//     if (item && item.reviews.length > 0) {
//         const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
//         const averageRating = totalRating / item.reviews.length;
//         return averageRating;
//     } else {
//         return 0; // Indicate that there are no reviews or the item is not found
//     }
// };
//   const rating = getAverageRatingByTitle().toFixed(0)
//   var rate = []
//     for (var i = 0; i < 5; i++ ){
//         if (i < rating){
//             rate.push('star')
//         }
//         else{
//             rate.push('staro')
//         }
//     }
  return (
    <View style={styles.container}>
      <Pressable onPress={pressHandler}>
    {product.images && isValidURL(product.images[0]) && (
      <ImageBackground
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
        source={{ uri: product.images[0] }}
      >
        {/* Apply LinearGradient as an overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']} // Customize gradient colors
          style={styles.gradient}
        >
        <Pressable style={styles.addButton} onPress={handleIncrement}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13Z"
                fill="#BC6C25"
              />
            </Svg>
          </Pressable>
          <View style={styles.detailsContainer}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>African</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Sides</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>2+</Text>
        </View>
      </View>
        </LinearGradient>
      </ImageBackground>
    )}</Pressable>
    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
      {product.title}
    </Text>
    <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
      {product.description.length > 1 ? product.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." }
    </Text>
    <View style={{width: 172.5}}>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={styles.price}>${product.price?.toFixed(2)}</Text><Pressable style={{backgroundColor: '#BC6C25', paddingHorizontal: 6, paddingTop: 1.5, borderRadius: 4 }}><Text style={{color: 'white', fontSize: 12, fontFamily: 'Poppins-SemiBold',}}>Order Now</Text></Pressable></View>
      {/* <FlexButton></FlexButton> */}
    </View>
  </View>
     )
}

export default Product;
const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    // marginRight: 8,
    padding: 10,
    // width: 172.5,
    // backgroundColor: "white",
    justifyContent: "center",
    // alignItems:'center',
    
    
  }, plus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },  image: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: 172.5,
    height: 160,
    borderRadius: 20
  },
  button: {
    // position:'absolute',
    // top: 0,
    // left: width/9,
    alignSelf: 'flex-end'
  },
  detailsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    gap: 3,
    bottom: 0,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  pill: {
    backgroundColor: '#F0F0F0', // Light background for the pill
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#555', // Darker text for contrast
  },
  name: {
    fontSize: 16,
    width: 172.5,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  description: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    width: 172.5,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-SemiBold',
  },
  price: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'Poppins-SemiBold',
  },
  card: {
    backgroundColor: "#EFF5E9",
    borderRadius: 35,
    width: width/2.5,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  textContainer: { marginBottom: 5 },
  text: { fontSize: 14 },
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
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)', // Orange color for the button
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    width: 172.5,
    borderRadius: 20, // Ensure the gradient matches the border radius of the image

  },
});
{/* <View style={{paddingTop: 9}}>
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
        {product.images && isValidURL(product.images[0]) && <Image
          style={styles.image}
          source={{uri:product.images[0]}}
        />}
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
            {product.title
              ? product.title.replace(/\b\w/g, (char) => char.toUpperCase()) + '\n'
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
</View> */}
