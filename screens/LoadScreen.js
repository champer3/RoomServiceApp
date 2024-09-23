import { Image, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import {fetchProducts} from "../Data/Items"
import { registerPushNotifications } from '../Data/notify';
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { store } from "../Data/Store";
import FalseHomeScreen from "./FalseHomeScreen";
import { fetchOrders } from "../Data/order";
import * as Notifications from 'expo-notifications';
import { saveNotification, loadNotifications, setExpoPushToken } from '../Data/notify';


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
    // Listen for incoming notifications
    Notifications.
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Dispatch action to save the notification in Redux
      dispatch(saveNotification(notification));
    });

    // Optionally listen for notification responses (if needed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User interacted with notification:', response);
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []); // Dependency array includes dispatch



  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(()=>{setTimeout(()=>{retrieveNewFromAsyncStorage()}, 3000) },[])
 const retrieveTokenFromAsyncStorage = async () => {
  try {
    let profile = await AsyncStorage.getItem("profile");
    let storedToken = await AsyncStorage.getItem("essential");
    storedToken = JSON.parse(storedToken)
    if (profile) {
      profile = JSON.parse(profile)
        dispatch(fetchProducts());
        dispatch(fetchOrders());
          dispatch(registerPushNotifications());
      dispatch(updateProfile({ id: {firstName: profile.firstName, lastName: profile.lastName,phoneNumber : profile.phoneNumber, email: profile.email, address: storedToken.address}}));
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
    let storedToken = await AsyncStorage.getItem("essential");
    storedToken = JSON.parse(storedToken)
    if (storedToken == null) {
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
