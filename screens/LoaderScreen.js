import { Image, Pressable, SafeAreaView, StyleSheet, Text, View , ActivityIndicator, Dimensions} from "react-native";
import React, { useState, useEffect } from 'react';
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
function LoaderScreen() {
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
    } else{navigation.replace('HomeTabs')} } catch (error) {
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

export default LoaderScreen;

const styles = StyleSheet.create({
    image: {
        height: height / 2,
        alignSelf: "center",
        resizeMode: 'contain'
      },
});
