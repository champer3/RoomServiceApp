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
    const response = await verifyNumber();
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
        `http://10.0.0.173:3000/api/v1/users/getNumber/${phoneNumber}`
      );
      if (checkNumber.data.data) {
        const response = await axios.get(
          `http://10.0.0.173:3000/getCode/${phoneNumber}`
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
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar hidden={false} barStyle="dark-content" />
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
              <Button onPress={pressHandler}>
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
    marginVertical: "20%",
  },
  topView: {
    height: "20%",
  },
  welcomeView: {},
  middleView: {
    height: "40%",
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
    flex: 1,
    justifyContent: "flex-end",
  },
});
