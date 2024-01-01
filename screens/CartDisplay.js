import { Image, StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Review from "../components/Reviews/Review"
import Rating from "../components/Reviews/Rating"
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import { EvilIcons } from '@expo/vector-icons';
import ProductAction from "../components/Product/ProductAction";
import Input from "../components/Inputs/Input";
import Deal from "../components/Category/Deal";
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart, deleteFromCart} from '../Data/cart'

const { width, height } = Dimensions.get("window");
function CartDisplay() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  function handleAddToCart(product){
    dispatch(addToCart({id : product}))
  }
  function handleRemoveFromCart(product){
    dispatch(removeFromCart({id : product}))
  }
  function handleDeleteFromCart(product){
    dispatch(deleteFromCart({id : product}))
  }
  function getTotalSum() {
    return cartItems.reduce((sum, obj) => sum + obj.oldPrice, 0);
  } 
  function addQuantityToObjects(inputList) {
      const titleCountMap = {};
  
      // Loop through the inputList to count occurrences of each title
      inputList.forEach((obj) => {
          const title = obj.title;
  
          // Increment the count for the title or initialize to 1 if it doesn't exist
          titleCountMap[title] = (titleCountMap[title] || 0) + 1;
      });
  
      // Loop through the inputList again to create a new list with quantity key
      const newList = inputList.map((obj) => {
          const title = obj.title;
          const quantity = titleCountMap[title];
  
          // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
          titleCountMap[title] = 0;
  
          return { ...obj, quantity };
      });
      const filteredList = newList.filter((obj) => obj.quantity !== 0);

      return filteredList;
  }
  
  // Example usage:
  
  const newList = addQuantityToObjects(cartItems);
    const navigation = useNavigation()
    function pressHandler (){
      if (cartItems.length > 0){
        navigation.navigate('Checkout')}
    }
    function dealHandler (){
        navigation.navigate('All Deals')
      }
  return (
    <View  style = {{flex: 1, paddingTop: 20}}>
        <ScrollView style={{marginBottom: '19%' }}>
        
        {cartItems.length == 0 && <View  style={[styles.recommendedView,{gap: 50, marginVertical: 45}]}><View><Image style={styles.image} source={require('../assets/cartEmpty.png')}/></View><Text style={{textAlign: 'center'}}>Your cart is currently empty, Check out people’s favorite items!</Text></View>}
        {cartItems.length > 0 && <><View style={{marginHorizontal: '10%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
            {newList.map(({title, oldPrice,image, quantity}, idx)=>  <ProductAction key={idx} title={title} price={oldPrice} image={image} quantity={quantity} action={<Pressable onPress={()=>handleDeleteFromCart(newList[idx])} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={45} color="#B22334" /></Pressable>}><IncrementDecrementBtn minValue={quantity} onIncrease={()=>{handleAddToCart(newList[idx])}} onDecrease ={()=>{handleRemoveFromCart(newList[idx])}}/></ProductAction>)}
      
        </View>
        <View  style={{paddingHorizontal: '5%', paddingVertical: '10%'}}>
            <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }}>Have a coupon code?</Text>
            <Input text={'Enter Coupon'} buttonText={'Apply code'}/>
        </View></>}
        <View style={{paddingHorizontal: '5%', paddingVertical: '10%'}}>
        <Deal text={"Best Grocery Deals!"} onPress={dealHandler} item={[
    {
      title: "Woodstock Organic Frozen Broccoli Florets 10oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/cr3.png"),
    },
    {
      title: "Woodstock Frozen Organic Mixed Berries 10oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/cr2.png"),
    },
    {
      title: "Sambazon Original Blend Smoothie Superfruit Pack",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/cr1.png"),
    }
  ]} color = '#039F03' />
        </View>
        </ScrollView>
        <View style={{flex: 1, width: "100%", paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
            <View style={{height: '150%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
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
                    > {`$${getTotalSum().toFixed(2)}`}
                    </Text>
            </View>
            <View style ={{width: '40%', height: '130%'}}>
                <FlexButton onPress = {pressHandler} background={cartItems.length == 0 ? "rgba(0,0,0,0.5)" :  '#283618'}><FontAwesome name="shopping-bag" size={24} color="white" /><Text style={{color: 'white'}}>Checkout</Text></FlexButton>
            </View>
        </View>
    </View>
  );
}
export default CartDisplay
const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      image: {
        height: height / 3,
        alignSelf: "center",
        resizeMode: 'contain'
      },
      recommendedView: {
        paddingHorizontal: '5%', paddingTop: '5%', gap: 20
      },
})