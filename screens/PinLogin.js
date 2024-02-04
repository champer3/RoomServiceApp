import { StyleSheet, Image, Text, View, TouchableWithoutFeedback, Keyboard, Pressable } from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Info from "../components/Info";
import CodeInput from "../components/Inputs/CodeInput";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";

function NumberLogin() {
  const [otp, setOtp] = useState()
  const route = useRoute()
  const phoneNumber = route.params?.phoneNumber || ""
  console.log("number:",phoneNumber)
  function getOtp(data){
    setOtp(data)
  }

  function handleScreenPress() {
    Keyboard.dismiss()
  }
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('HomeTabs')
    console.log("otp: ", otp)
    verifyNumber(otp)
  }
  function signUpHandler (){
    navigation.navigate('StartScreen')
  }
  const verifyNumber = async(code) =>{
    const response = await axios.get(`http://10.0.0.173:3000/verifyPhone/${phoneNumber}/${code}`);
    console.log("got here")
    // console.log(response.data)
  }
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Hello,</Text>
            <Text style={styles.text}>Welcome Back😍</Text>
          </View>
        </View>
        <View style={styles.middleView}>
          <View style={{ marginBottom: "5%" }}>
            <CodeInput getOtpData={getOtp} length={6} />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress = {pressHandler}>
              <Text style={{ fontSize: 16, color: "white" }}>Continue</Text>
              <Image
                style={styles.vector}
                source={require("../assets/Vector.png")}
              />
            </Button>
          </View>
          <View>
          <Info text="Enter the five-digit code that was sent to your registered phone number." />
          </View>
        </View>
        <View style={styles.downView}>
          <View style={styles.threeContainer}>
            <View style={styles.line}></View>
            <Text>or continue with</Text>
            <View style={styles.line}></View>
          </View>
          <View style={[styles.buttonContainer, { marginBottom: 24 }]}>
            <BareButton borderRadius={24} color="#EEEEEE">
              <Image
                style={styles.facebook}
                source={require("../assets/facebook.png")}
              />
              <Text> Continue with facebook</Text>
            </BareButton>
          </View>
          <View style={[styles.buttonContainer, { marginBottom: 24 }]}>
            <BareButton borderRadius={24} color="#EEEEEE">
              <Image
                style={styles.facebook}
                source={require("../assets/google.png")}
              />
              <Text> Continue with Google</Text>
            </BareButton>
          </View>
          <View style={styles.textContainer}>
            <Text style={{ color: "#333333", opacity: 0.5 }}>
              New to RoomService?
            </Text>
            <Pressable onPress = {signUpHandler}>
            <Text style={{ color: "#BC6C25", fontWeight: "700", opacity: 1 }}>
              {" "}
              Sign Up
            </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}

export default NumberLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginHorizontal: "5%",
    marginTop: "10%",
    marginBottom: "5%",
  },
  topView: {
    height: "16%",
    marginBottom: "10%",
  },
  welcomeView: {},
  middleView: {
    height: "40%",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    marginBottom: "5%",
  },
  vector: {
    width: "10%",
    resizeMode: "center",
    marginLeft: 5
  },
  facebook: {
    width: "7%",
    resizeMode: "contain",
    marginRight: 3
  },
  threeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    height: 2,
    backgroundColor: "#EEEEEE",
    width: "30%",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    color: "#333333",
    fontSize: 32,
    fontWeight: "500",
    letterSpacing: 2,
  },
  downView: {
    flex: 1,
    justifyContent: "flex-end",
    // borderWidth: 2
  },
});
