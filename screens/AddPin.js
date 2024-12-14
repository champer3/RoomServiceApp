import { StyleSheet, Image,  View, TouchableWithoutFeedback, Keyboard, Alert, Dimensions, KeyboardAvoidingView, Pressable, ActivityIndicator } from "react-native";
import CodeInput from "../components/Inputs/CodeInput";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { RadioButton } from "react-native-paper";
import Info from "../components/Info";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import Text from '../components/Text';
import AsyncStorage from "@react-native-async-storage/async-storage";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

function AddPin() {
  const [otp, setOtp] = useState('')
  const route = useRoute()
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  const [form, setForm] = useState(data);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false)
  const phoneNumber = route.params?.phoneNumber || ""
  function getOtp(data){
    setOtp(data)
  }
  const [keyboardActive, setKeyboardActive] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardActive(false);
      }
    );

    // Clean up event listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  function handleScreenPress() {
    Keyboard.dismiss()
  }
  const profile = useSelector((state) => state.profileData.profile);
  const phoneNumberString = phoneNumber.replace(/[^0-9]/g, '');
  const newphoneNumber = "+1" + phoneNumberString
  const datab = form.googleID && { googleID: form.googleID }
  const postData = {
    ...datab,
    firstName: form.firstName,
    lastName: form.lastName,
    phoneNumber,
    email: form.email,
    address: [],
  };
  const createAccount = async () => {
    try {
      const response = await axios.post(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/signup`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      authToken = response.data.token;

      console.log(response.data);
      console.log("got here");
    } catch (err) {
      console.log(err.error);
    }
  };
  function resendCode(){
    setSeconds(60); // Set your desired countdown time here
    setIsActive(true);
    // Put your OTP resend logic here
    console.log('Resending OTP...');
    resendVerifyNumber()
  }
  
  function handleUpdate() {
    dispatch(updateProfile({ id: form }));
  }
  let authToken = '123';
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
  const saveTokenToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      console.log("Token saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };
  const saveProfileToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem("profile", JSON.stringify(postData));
      console.log("Profile saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };
  function nextHandler(){
    navigation.navigate('AddNumber')
  }
  const navigation = useNavigation()
  async function pressHandler (){
    setIsLoading(true)
    let verifyResponse = ""
    try {verifyResponse = await verifyNumber(otp)}
    catch (error) {console.error("Error:", error);}
    if(verifyResponse === "approved"){
      handleUpdate();
      try{
      await createAccount();} catch(error) {
        console.error("Error:", error);
      }
      try{
        await saveTokenToAsyncStorage();} catch(error) {
        console.error("Error:", error);
      }
      try{
        await saveProfileToAsyncStorage();} catch(error) {
        console.error("Error:", error);
      }
      // Call the function to save the token
      
     
      setTimeout(() => {
        navigation.replace('Loader'); 
        
        // Set loading status to false after some time (simulating app loading)
      }, 300)
    }else{
      setTimeout(()=>{ setIsLoading(false)}, 300)
      Alert.alert('Incorrect OTP', 'Please check your input and try again')
    }
  }
  const verifyNumber = async(code) =>{
    try{
      const response = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/verifyPhone/${phoneNumber}/${code}`
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
      const response = await axios.get(`https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/getCode/${phoneNumber}`);
      // console.log("got here")
      console.log(response.data)
    } catch(err){
      console.log(err.error)
    }
  }
  return (
    <KeyboardAvoidingView  style={{flex: 1}} >
    {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
         </View> 
      ) : <Pressable onPress={handleScreenPress} style={styles.container} >
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Almost there,</Text>
        <Text style={styles.text}>Verify Your Number😉</Text>
        <View style={styles.lineContainer}>
            <View style={styles.line}></View>
            <View style={styles.line} ></View>
            <View style={[styles.line, {backgroundColor: "#283618"}]}></View>
        </View>
        <View style={{}}>
        <CodeInput getOtpData={getOtp}  length={6} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text onPress={!isActive ? resendCode: ()=>{}} style={{marginVertical: 20, color: isActive ? '#aaa' : 'black'}}>Resend Code</Text>
          {isActive && <Text style={{marginVertical: 20}}>{`0${Math.floor(seconds/60)}:${seconds % 60 >= 10 ? seconds%60 : '0' + seconds%60}`}</Text>}
        </View>
        {!keyboardActive && <Info text="Enter the six-digit code that was sent to the mobile number you previously entered" />}
      </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={otp.length == 6 ? pressHandler: ()=>{}} color={otp.length == 6 ? '' : '#aaa'}>
          <Text style={{ fontSize: 16, color: "white" }}>Continue </Text>
          <Image
            style={styles.vector}
            source={require("../assets/Vector.png")}
            />
        </Button>
      </View>
            </Pressable>}
          </KeyboardAvoidingView>
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
    height: height / 2,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  buttonContainer: {
    width: "100%",
    height: 55,
    marginBottom: 25,
    marginTop: 38,
    alignSelf: 'flex-end'
  },
  vector: {
    width: 21.5,
    height: 15,
    // resizeMode: 'center',
    marginLeft: 5,
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
    fontSize: 28,
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
    width: "30%",
    backgroundColor: "#D9D9D9",
  }
});
