import { Image, Pressable, SafeAreaView, StyleSheet, Text, View , ActivityIndicator, Dimensions} from "react-native";
import React, { useState, useEffect } from 'react';
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { useNavigation } from "@react-navigation/native";


const { width, height } = Dimensions.get("window");
function StartScreen() {
  const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState()
  function pressHandler (){
      navigation.replace('Loader'); 
    
  }
  function emailHandler (){
    navigation.navigate('EmailSignUp')
  }
  function signInHandler (){
    navigation.navigate('NumberLogin')
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

  
  return (
    <SafeAreaView style={styles.container}>
        {isLoading ? (
        // Render loading indicator while loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<>
      <Pressable onPress={pressHandler} style={{alignSelf: 'flex-end', marginBottom: height/ 9}}><Text style={{color: "#333333", opacity: 0.7, fontSize: height/50, fontWeight: "500", alignSelf: "flex-end"}}>Skip</Text></Pressable>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/startimage.png")}
        />
      </View>
      <View style={styles.description}>
        <Text style={{color: "#333333", fontSize: 24, fontWeight: "800", marginVertical: 4}}>Welcome to RoomService</Text>
        <Text style={{color: "#333333", fontSize: 14, fontWeight: "500", marginVertical: 8, textAlign: "center"}}>
          Enjoy the ease of ordering food, groceries, and related items from the
          comfort of your home
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={emailHandler}>
          <Text style={{ fontSize: 16, color: "white" }}>Sign Up  </Text>
          <Image
            style={styles.vector}
            source={require("../assets/Vector.png")}
          />
        </Button>
      </View>
      <View style={styles.threeContainer}>
        <View style={styles.line}></View>
      </View>
      {/* <View style={[styles.buttonContainer, {marginBottom: 8}]}>
        <BareButton borderRadius={24} color="#EEEEEE">
          <Image
            style={styles.facebook}
            source={require("../assets/facebook.png")}
          />
          <Text> Continue with facebook</Text>
        </BareButton>
      </View>
      <View style={[styles.buttonContainer, {marginBottom: 24}]}>
        <BareButton onPress={()=>{promptAsync(); console.log('pressed')}} borderRadius={24} color="#EEEEEE">
          <Image
            style={styles.facebook}
            source={require("../assets/google.png")}
          />
          <Text> Continue with Google</Text>
        </BareButton>
      </View> */}
      <View style={styles.textContainer}>
        <Text style={{color: "#333333", opacity: 0.5}}>Already have an account?</Text>
        <Pressable onPress={signInHandler}>
        <Text style={{color: "#BC6C25", fontWeight: "700", opacity: 1}}> Sign In</Text>
        </Pressable>
      </View>
      <View><Image style={styles.image} source={require('../assets/Logo.png')}/></View>
      </>)}
    </SafeAreaView>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "5%",
    paddingTop: 45,
    marginTop: height/ 25,
  },
  imageContainer: {
    width: "100%",
    height: "30%",
    marginTop: 6,
    marginBottom: 32
  },
  description: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  image: {
    height: height / 4,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    // marginBottom: 20
  },
  vector: {
    width: "10%",
    resizeMode: "center",
  },
  facebook: {
    width: "7%",
    resizeMode: "contain",
    marginRight: 3
  },
  threeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 26
  },
  line: {
    height: 2,
    backgroundColor: "#EEEEEE",
    width: "90%",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center"
  }
});
