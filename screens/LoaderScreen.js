import { Image, Pressable, SafeAreaView, StyleSheet, Text, View , ActivityIndicator, Dimensions} from "react-native";
import React, { useState, useEffect } from 'react';
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { setCart } from "../Data/cart";
import { setFavorites } from "../Data/favorites";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAddresses, fetchCart, fetchFavorites } from "../api/syncService";
import { fetchOrders } from "../Data/order";

const { width, height } = Dimensions.get("window");
function LoaderScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  useEffect(()=>{setTimeout(()=>{retrieveNewFromAsyncStorage()}, 3000) },[])
 const retrieveTokenFromAsyncStorage = async () => {
  try {
    let profile = await AsyncStorage.getItem("profile");
    if (profile) {
      profile = JSON.parse(profile)

      let addresses = [];
      let cartItems = [];
      let favs = [];
      try {
        const serverAddresses = await fetchAddresses();
        if (serverAddresses && serverAddresses.length > 0) {
          addresses = serverAddresses;
        }
        const serverCart = await fetchCart();
        if (serverCart && serverCart.length > 0) {
          cartItems = serverCart;
        }
        const serverFavs = await fetchFavorites();
        if (serverFavs && serverFavs.length > 0) {
          favs = serverFavs;
        }
      } catch (e) {}

      dispatch(updateProfile({ id: {firstName: profile.firstName, lastName: profile.lastName, phoneNumber: profile.phoneNumber, email: profile.email, address: addresses}}));
      if (cartItems.length > 0) {
        dispatch(setCart(cartItems));
      }
      if (favs.length > 0) {
        dispatch(setFavorites(favs));
      }
      dispatch(fetchOrders());
      navigation.replace('HomeTabs')
    } else{navigation.replace('HomeTabs')} } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  const retrieveNewFromAsyncStorage = async () => {
    try {
      let onboarded = await AsyncStorage.getItem("onboarded");
      if (!onboarded) {
        navigation.replace('OnBoarding')
      } else {
        retrieveTokenFromAsyncStorage()
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)'}}><Image style={styles.image} source={require('../assets/splash.png')}/></View> 
  );
}

export default LoaderScreen;

const styles = StyleSheet.create({
    image: {
        height: height / 2,
        alignSelf: "center",
        resizeMode: 'contain'
      },
});
