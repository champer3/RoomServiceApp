import { StyleSheet, Image, Text, View, TouchableWithoutFeedback, Keyboard, Alert, Dimensions, KeyboardAvoidingView } from "react-native";
import CodeInput from "../components/Inputs/CodeInput";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { RadioButton } from "react-native-paper";
import Info from "../components/Info";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

function AddPin() {
  const [otp, setOtp] = useState([1,2,3,4,5,6])
  const route = useRoute()
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false)
  const phoneNumber = route.params?.phoneNumber || ""
  function getOtp(data){
    setOtp(data)
  }
  function handleScreenPress() {
    Keyboard.dismiss()
  }
  function resendCode(){
    setSeconds(60); // Set your desired countdown time here
    setIsActive(true);
    // Put your OTP resend logic here
    console.log('Resending OTP...');
    resendVerifyNumber()
  }
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

  function nextHandler(){
    navigation.navigate('AddNumber')
  }
  const navigation = useNavigation()
  async function pressHandler (){
    // const verifyResponse = await verifyNumber(otp)
    // if(verifyResponse === "approved"){
      navigation.navigate('CreatePassword')
    // }else{
    //   Alert.alert('Incorrect OTP', 'Please check your input and try again')
    // }
  }
  const verifyNumber = async(code) =>{
    try{
      const response = await axios.get(
        `http://10.0.0.173:3000/verifyPhone/${phoneNumber}/${code}`
      );
      console.log(response.data.verification)
      return response.data.verification;
    } catch(err){
      console.log(err.error)
    }
  }

  const resendVerifyNumber = async() =>{
    try{
      console.log(phoneNumber)
      const response = await axios.get(`http://10.0.0.173:3000/getCode/${phoneNumber}`);
      // console.log("got here")
      console.log(response.data)
    } catch(err){
      console.log(err.error)
    }
  }
  return (
    <GestureRecognizer onTouchStart={handleScreenPress} onSwipeLeft={pressHandler} onSwipeRight={(nextHandler)}  style={{flex: 1}} >
    <KeyboardAvoidingView onPress={handleScreenPress} behavior="height"  style={styles.container} >
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Almost there,</Text>
        <Text style={styles.text}>Verify Your Number😉</Text>
        <View style={styles.lineContainer}>
            <View style={styles.line}></View>
            <View style={styles.line} ></View>
            <View style={[styles.line, {backgroundColor: "#283618"}]}></View>
            <View style={styles.line}></View>
        </View>
        <View style={{}}>
        <CodeInput getOtpData={getOtp}  length={6} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text onPress={!isActive ? resendCode: ()=>{}} style={{marginVertical: 20, color: isActive ? '#aaa' : 'black'}}>Resend Code</Text>
          {isActive && <Text style={{marginVertical: 20}}>{`0${Math.floor(seconds/60)}:${seconds % 60 >= 10 ? seconds%60 : '0' + seconds%60}`}</Text>}
        </View>
        <Info text="Enter the six-digit code that was sent to the mobile number you previously entered" />
      </View>
      </View>
      <View style={{ justifyContent: 'flex-end', flex: 1 }}>
      <View style={styles.buttonContainer}>
        <Button onPress={pressHandler}>
          <Text style={{ fontSize: 16, color: "white" }}>Continue </Text>
          <Image
            style={styles.vector}
            source={require("../assets/Vector.png")}
            />
        </Button>
      </View>
            </View>
            </KeyboardAvoidingView>
          </GestureRecognizer>
  );
}

export default AddPin;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: "5%",
    marginTop: height/35,
    // marginTop: 200
  },
  welcomeView: {
    // flex: 1,
    // marginBottom: 42,
    // marginTop: -70,
  },
  description: {
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 55,
    marginBottom: 25,
    alignSelf: 'flex-end'
  },
  vector: {
    width: "7%",
    resizeMode: "contain",
  },
  facebook: {
    width: "12%",
    resizeMode: "contain",
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
  lineContainer: {
    flexDirection: "row",
    marginVertical: height/35,
    justifyContent: "space-between",
  },
  line: {
    height: 2,
    width: "20%",
    backgroundColor: "#D9D9D9",
  }
});
