import { Image, StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import Deal from "../components/Category/Deal";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart} from '../Data/cart'
import CartModal from "../components/Cart/CartModal";

function ProductDisplay() {
    const route = useRoute()
    const title = route.params.title
    const [visible, setVisible] = useState(false)
    
    useEffect(()=>{
        const timeoutId = setTimeout(() => {
          setVisible(false);
        }, 1500);
      }, [visible])
    const image = route.params.image
  const [index, setIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  const productItems = useSelector((state) => state.productItems.ids)
  const categoryObject = {};
  const getAverageRatingByTitle = (title) => {
    const item = productItems.find(item => item.title === title);

    if (item && item.reviews.length > 0) {
        const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / item.reviews.length;
        return averageRating;
    } else {
        return 0; // Indicate that there are no reviews or the item is not found
    }
};
  productItems.forEach(item => {
    const category = item.category;

    if (!categoryObject[category]) {
        // If the category key doesn't exist, create it with an array containing the current item
        categoryObject[category] = [item];
    } else {
        // If the category key already exists, push the current item to the existing array
        categoryObject[category].push(item);
    }
});
function handleAddToCart(product){
    dispatch(addToCart({id : product}))
    setVisible(true)
}
function handleAddToCartInc(product){
    dispatch(addToCart({id : product}))
}
function handleRemoveFromCart(product){
  dispatch(removeFromCart({id : product}))
}
function addQuantityToObjects(inputList) {
    
    const titleCountMap = {};

    // Loop through the inputList to count occurrences of each title
    inputList.forEach((obj) => {
        const title = obj.title;
        if (title == route.params.title){
        // Increment the count for the title or initialize to 1 if it doesn't exist
        titleCountMap[title] = (titleCountMap[title] || 0) + 1;}
    });
    return titleCountMap

    
}

// Example usage:

const newList = addQuantityToObjects(cartItems);
var quantity = 0
if (newList){
    quantity = newList[route.params.title]
}
console.log(quantity)
console.log(newList[route.params.title])
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Review', {reviews: route.params.reviews})
  }

  return (
    <View>
        <ScrollView>
        <View style= {{marginBottom: 120}}>
            <View style={{alignItems: 'center', backgroundColor: "#FAFAFA", paddingTop:'6%'}}>

                <Image  source={image} style ={{width: width/2, height: height/4 }} />
                <View
                    style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    padding: 0.5,
                    paddingHorizontal: 6,
                    borderRadius: 30,
                    zIndex: 1,
                    position: "absolute",top: 0, zIndex: 2 , right: '15%'
                    }}
                >
                    <Text
                    style={{
                        color: "black",
                        fontWeight: "900",
                        fontSize: 20,
                    }}
                    >
                    {`$${route.params.oldPrice}`}
                    </Text>
                </View>
            </View>
            <View  style={{paddingHorizontal: '5%', marginVertical: '4%'}} >
                <View style ={{width: '100%'}}><Text
                    style={{
                        color: "black",
                        fontWeight: "900",
                        fontSize: 22,
                    }}
                    >{title} </Text></View>
                <View style = {{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor:'#aaa', paddingBottom: '3%'}}>

                    <View >
                    <Pill text ="9289 Sold" type="null"/>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center', gap: 5}}>
                    <AntDesign name="star" size={30} color="black" />
                    <Text>{getAverageRatingByTitle(route.params.title).toFixed(1)}</Text>
                    <Text>({`${route.params.reviews.length}`} Reviews)</Text>
                    </View>
                    <Pressable onPress={pressHandler} style={({ pressed }) => pressed && { opacity: 0.5 }} >
                    <Text style={{color: "#BC6C25", fontSize: 12, fontWeight: 'bold'}}>See Reviews</Text>
                    </Pressable>
                </View>
                <View style = {{gap: 15, marginVertical: 30}}>
                    <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }} >Quantity</Text>
                    <View style ={{height: 'auto', width: '30%'}}>
                    <IncrementDecrementBtn minValue={quantity} onIncrease={()=>handleAddToCartInc(route.params)} onDecrease={()=>handleRemoveFromCart(route.params)}/>
                    </View>
                    <View style = {{paddingVertical: 15, gap: 10}}>
                    <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }} >Description</Text>
                    <Text style={{
                        color: "#aaa",
                        fontSize: 16,
                        lineHeight: 35,
                    }} >Rainbow NERDS surround fruity, gummy centers. Those sweet little sparks are fantastic inventors. A poppable cluster, packed with tangy, crunchy NERDS. A candy so tasty, there aren’t even words.
                    NUTRITIONAL INFO</Text>
                    </View>
                    <View style={styles.catHead}>
                        <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }} >Shop Related Products</Text>
                        <ProductCategory items={categoryObject[route.params.category].filter(item => item.title !== route.params.title)} onPress={handleAddToCart}/>
                    </View>
                    <View style={styles.catHead}>
                        {/* <Deal text={'Shop Related Products'}/> */}
                    </View>
                </View>
                <View>

                </View>
            </View>
            
        </View>
        </ScrollView>
        
        <View style={{flex: 1, width: "100%", minHeight: '60%', flexWrap: 'wrap', paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
        {visible && <View style ={{
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    width: '90%',
    alignItems: 'center',opacity: 1, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style ={{ 
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,}}><CartModal/></View>
        </View>}
            <View style={{height: '100%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Text
                style={{
                    color: "#aaa",
                    fontWeight: "bold",
                    fontSize: 20,
                }}
                > Total Payment</Text>
                <Text
                    style={{
                        color: "black",
                        fontWeight: "600",
                        fontSize: 20,
                        
                    }}
                    > {`$${!quantity ? 0 : (route.params.oldPrice * quantity).toFixed(2)}`}
                    </Text>
            </View>
            <View style ={{width: '40%', height: 70}}>
                <FlexButton onPress={()=>handleAddToCart(route.params)} background={'#283618'}><FontAwesome name="shopping-bag" size={24} color="white" /><Text style={{color: 'white'}}>Add to cart</Text></FlexButton>
            </View>
        </View>
        
    </View>
  );
}
export default ProductDisplay

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
})