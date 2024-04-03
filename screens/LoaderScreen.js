import { Image, Pressable, SafeAreaView, StyleSheet, Text, View , ActivityIndicator, Dimensions} from "react-native";
import React, { useState, useEffect } from 'react';
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser"
import  * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
function LoaderScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
        navigation.replace('HomeTabs');
      setIsLoading(false); // Set loading status to false after some time (simulating app loading)
    }, 1000); // Change the timeout value as per your requirement
  }, []);
  const [isLoading, setIsLoading] = useState(true); // State variable to track loading status

  
  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)'}}><Image style={styles.image} source={require('../assets/Logo.png')}/></View> 
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
