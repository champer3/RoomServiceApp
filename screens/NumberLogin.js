import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import Input from "../components/Inputs/Input";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PhoneIcon from "../components/PhoneIcon";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const height = Dimensions.get('screen').height
function NumberLogin() {
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const [number, setNumber] = useState("");
  const phoneNumberString = number.replace(/[^0-9]/g, "");
  const phoneNumber = "+1" + phoneNumberString;
  console.log(number);
  const navigation = useNavigation();
  async function pressHandler() {
    let response =""
    try {
    response = await verifyNumber();}
    catch (error){
    }
    if (response) {
      navigation.navigate("PinLogin", { phoneNumber });
    } else {
      Alert.alert(
        "No account",
        "There is no account attributed to this number. SignUp!"
      );
    }
  }

  const verifyNumber = async () => {
    try {
      const checkNumber = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/getNumber/${phoneNumber}`
      );
      if (checkNumber.data.data) {
        const response = await axios.get(
          `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/getCode/${phoneNumber}`
        );
        console.log("hdhdhh", response.data);
      }
      return checkNumber.data.data;
      // console.log("got here")
    } catch (err) {
      console.log(err.error);
    }
  };
  function emailHandler() {
    navigation.navigate("EmailLogin");
  }
  function signUpHandler() {
    navigation.navigate("StartScreen");
  }
  navigation.canGoBack(false)
  const formatPhoneNumber = (input) => {
    // Remove non-numeric characters from input
    const cleanedInput = input.replace(/\D/g, "");

    // Add brackets dynamically based on entered digits
    let formattedNumber = "";
    for (let i = 0; i < cleanedInput.length; i++) {
      if (i === 0) {
        formattedNumber += "(";
      } else if (i === 3) {
        formattedNumber += ") ";
      } else if (i === 6) {
        formattedNumber += "-";
      }
      formattedNumber += cleanedInput[i];
    }

    // Set the state with the formatted number
    setNumber(formattedNumber);
  };

  // .................Google SignIn.........................................................

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("my-key");
      if (value !== null) {
        navigation.navigate("HomeTabs");
      }
      console.log(value);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  getData();
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
        <KeyboardAvoidingView behavior="height" style={styles.container}>
          <StatusBar hidden={false} barStyle="dark-content" />
          {/* <View style={{alignSelf: 'flex-start'}}><Image style={styles.image} source={require('../assets/Logo.png')}/></View> */}
          <View style={styles.topView}>
            <View style={styles.welcomeView}>
              <Text style={styles.text}>Hello,</Text>
              <Text style={styles.text}>Welcome Back😍</Text>
            </View>
          </View>
          <View style={styles.middleView}>
            <View style={{ marginBottom: "5%" }}>
              <Input
                length={14}
                icon={<PhoneIcon />}
                keyboard="numeric"
                textInputConfig={{
                  onChangeText: (text) => formatPhoneNumber(text),
                  value: number,
                }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={number.length == 14 ? pressHandler: ()=>{}} color={number.length == 14 ? '' : '#aaa'}>
                <Text style={{ fontSize: 16, color: "white" }}>Continue </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
            <View>
              <Pressable onPress={emailHandler}>
                <Text
                  style={{
                    // marginBottom: 120,
                    // marginTop: 40,
                    color: "#BC6C25",
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Login with email and password
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.downView}>
            {/* <View style={styles.threeContainer}>
              <View style={styles.line}></View>
              <Text>or continue with</Text>
              <View style={styles.line}></View>
            </View>
            <View style={[styles.buttonContainer,]}>
              <BareButton borderRadius={24} color="#EEEEEE">
                <Image
                  style={styles.facebook}
                  source={require("../assets/facebook.png")}
                />
                <Text> Continue with facebook</Text>
              </BareButton>
            </View>
            <View style={[styles.buttonContainer, ]}>
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
          </View>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default NumberLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: "5%",
    marginTop: height/7,
  },
  topView: {
    height: height/8,
  },
  welcomeView: {},
  middleView: {
  },
  image: {
  },
  buttonContainer: {
    height: 55,
    marginVertical: 15,
  },
  vector: {
    width: 21.5,
    height: 15,
    // resizeMode: 'center',
    marginLeft: 5,
  },
  facebook: {
    resizeMode: "center",
  },
  threeContainer: {
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
  image: {
    height: height / 3,
    alignSelf: "center",
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
  },
});
