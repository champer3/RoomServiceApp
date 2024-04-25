import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
  Dimensions, KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Info from "../components/Info";
import CodeInput from "../components/Inputs/CodeInput";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function NumberLogin() {
  const dispatch = useDispatch();
  let authToken
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false)
  const route = useRoute();
  const [err, setErr] = useState(false) 
  const phoneNumber = route.params?.phoneNumber || "";
  console.log("number:", phoneNumber);
  function getOtp(data) {
    setOtp(data);
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status
  
 
  const loginData = async () => {
    try {
      const response = await axios.post(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/loginWithNumber/`,
        JSON.stringify({ phoneNumber }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("token", response.data.data.user);
      console.log(response.data)
      authToken = response.data.token
      return response.data.data.user;
    } catch (err) {
      console.log(err.error);
    }
  };
  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            clearInterval(intervalId);
            setIsActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive]);

  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const navigation = useNavigation();
  function resendCode(){
    setSeconds(60); // Set your desired countdown time here
    setIsActive(true);
    // Put your OTP resend logic here
    console.log('Resending OTP...');
    resendVerifyNumber()
  }
  async function pressHandler() {
    const verifyResponse = await verifyNumber(otp);
    
    if (verifyResponse === "success") {
      const loginInfo = await loginData();
      console.log(loginInfo)
      let storedToken = {address: [], orders:  [],}
      
      try {
        await saveTokenToAsyncStorage()
        await AsyncStorage.setItem("profile", JSON.stringify({
          firstName: loginInfo.firstName,
          lastName: loginInfo.lastName,
          phoneNumber: loginInfo.phoneNumber,
          email: loginInfo.email,
          password: loginInfo.password,
          address: storedToken.address
        },));
        console.log("Profile saved successfully.");
      } catch (error) {
        console.error("Error saving token:", error);
      }
      dispatch(
        updateProfile({
          id: {
            firstName: loginInfo.firstName,
            lastName: loginInfo.lastName,
            phoneNumber: loginInfo.phoneNumber,
            email: loginInfo.email,
            password: loginInfo.password,
            address: storedToken.address
          },
        })
      );
      navigation.replace('Loader'); 
    } else {
      Alert.alert("Invalid OTP")
    } 
   
   
  }
  function signUpHandler() {
    navigation.navigate("StartScreen");
  }
  const verifyNumber = async (code) => {
    try {
      const response = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/verifyPhone/${phoneNumber}/${code}`
      );
      console.log(response.data.status);
      return response.data.status;
    } catch (err) {
      console.log(err.error);
    }
  };
  const resendVerifyNumber = async () => {
    try {
      console.log(phoneNumber);
      const response = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/getCode/${phoneNumber}`
      );
      // console.log("got here")
      console.log(response.data);
    } catch (err) {
      console.log(err.error);
    }
  };

  const saveTokenToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      console.log("Token saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };
  console.log('otp',otp)
  return (

    <KeyboardAvoidingView  onTouchStart={handleScreenPress} onPress={handleScreenPress} behavior="height"  style={styles.container} >
       {isLoading ? (
        // Render loading indicator while loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<>
        <StatusBar hidden={false} barStyle="dark-content" />
          <View style={styles.topView}>
            <View style={styles.welcomeView}>
              <Text style={styles.text}>Hello,</Text>
              <Text style={styles.text}>Welcome Back😍</Text>
            </View>
            <View style={{ marginBottom: "5%" }}>
              <CodeInput getOtpData={getOtp} length={6} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text onPress={!isActive ? resendCode: ()=>{}} style={{marginVertical: 2, color: isActive ? '#aaa' : 'black'}}>Resend Code</Text>
          {isActive && <Text style={{marginVertical: 0}}>{`0${Math.floor(seconds/60)}:${seconds % 60 >= 10 ? seconds%60 : '0' + seconds%60}`}</Text>}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={otp.length == 6 ? pressHandler: ()=>{}} color={otp.length == 6 ? '' : '#aaa'}>
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
            {/* <View style={styles.threeContainer}>
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
            </View> */}
            <View style={styles.textContainer}>
              <Text style={{ color: "#333333", opacity: 0.5 }}>
                New to RoomService?
              </Text>
              <Pressable onPress={signUpHandler}>
                <Text
                  style={{ color: "#BC6C25", fontWeight: "700", opacity: 1 }}
                >
                  {" "}
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View></>)}
            </KeyboardAvoidingView>
  );
}

export default NumberLogin;
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: "5%",
    marginTop: height/35,
    // marginTop: 200
  },
  welcomeView: {},
  middleView: {
    height: "40%",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    width: "100%",
    height: 55,
    marginBottom: 25,
    alignSelf: 'flex-end'
  },
  vector: {
    width: 21.5,
    height: 15,
    // resizeMode: 'center',
    marginLeft: 5,
  },
  facebook: {
    width: "7%",
    resizeMode: "contain",
    marginRight: 3,
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
    marginTop: 22,
    justifyContent: "flex-end",
    // borderWidth: 2
  },
});
