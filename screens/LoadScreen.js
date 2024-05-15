import { Image, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { store } from "../Data/Store";


function LoadScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  useEffect(()=>{setTimeout(()=>{retrieveNewFromAsyncStorage()}, 3000) },[])
 const retrieveTokenFromAsyncStorage = async () => {
  try {
    let profile = await AsyncStorage.getItem("profile");
    let storedToken = await AsyncStorage.getItem("essential");
    storedToken = JSON.parse(storedToken)
    if (profile) {
      profile = JSON.parse(profile)
      console.log(profile, storedToken)
      dispatch(updateProfile({ id: {firstName: profile.firstName, lastName: profile.lastName,phoneNumber : profile.phoneNumber, email: profile.email, address: storedToken.address}}));
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
