import { Image, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import {fetchProducts} from "../Data/Items"
import { registerPushNotifications } from '../Data/notify';
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { setCart } from "../Data/cart";
import { setFavorites } from "../Data/favorites";
import { store } from "../Data/Store";
import FalseHomeScreen from "./FalseHomeScreen";
import { fetchOrders } from "../Data/order";
import * as Notifications from 'expo-notifications';
import { saveNotification, loadNotifications, setExpoPushToken } from '../Data/notify';
import { fetchAddresses, fetchCart, fetchFavorites } from "../api/syncService";


function LoadScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    // Register for push notifications
    dispatch(registerPushNotifications());
    dispatch(loadNotifications());

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      dispatch(saveNotification({
        request: { content: notification.request.content },
        date: new Date().toISOString(),
        type: 'received',
      }));
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.orderId) {
        navigation.navigate('Order History');
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);



  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    retrieveNewFromAsyncStorage();
  }, []);
 const retrieveTokenFromAsyncStorage = async () => {
  try {
    let profile = await AsyncStorage.getItem("profile");
    if (profile) {
      profile = JSON.parse(profile)
        
        dispatch(fetchOrders());
          dispatch(registerPushNotifications());

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
     setIsLoading(true)
     
      if (isLoading) { 
        return <FalseHomeScreen/>
      }
      navigation.replace('HomeTabs')
    } else {
      navigation.replace('Authentication')
    }
  } catch (error) {
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

export default LoadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#283618",
  },
  imageView: {
    width: "80%",
  },
  image: {
    width: "100%",
    resizeMode: "contain"
  },
  text: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: "44",
    color: "white"
  }
});
