import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Input from "../components/Inputs/Input";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
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
import Text from '../components/Text';
import axios from "axios";
import { SERVER_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const height = Dimensions.get('screen').height
WebBrowser.maybeCompleteAuthSession();

function NumberLogin() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '1036326714736-ccfuoqkih54f50u5trqnffods76djkja.apps.googleusercontent.com',
  });

  const saveTokenToAsyncStorage = async (authToken) => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      console.log("Token saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const emailLogin = async (postData) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/users/loginWithEmail`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const authToken = response.data.token;
      console.log(authToken);
      await saveTokenToAsyncStorage(authToken);
      return response.data.data.user;
    } catch (err) {
      console.log(err.error);
    }
  };

  const getUsersProfile = async (token) => {
    if (!token) return null;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return await response.json();
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  async function checkEmail(email) {
    const userEmail = await axios.get(
      `${SERVER_URL}/api/v1/users/getEmail/${email}`
    );
    return userEmail.data.data.user.length
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const token = authentication?.accessToken ?? authentication?.refreshToken;

      (async () => {
        const user = await getUsersProfile(token);
        const postData = {
          email: user.email,
          googleID: user.id,
        };

        if (user && user.email) {
          const emailCheckResult = await checkEmail(user.email);

          if (emailCheckResult >= 1) {
            alert("I am present")
            let storedToken = { address: [], orders: [], }


            try {
              const userResponse = await emailLogin(postData);
              if (userResponse && userResponse.firstName && userResponse.email) {
                try {
                  const address = storedToken?.address || '';
                  await AsyncStorage.setItem(
                    "profile",
                    JSON.stringify({
                      firstName: userResponse.firstName,
                      lastName: userResponse.lastName,
                      phoneNumber: userResponse.phoneNumber,
                      email: userResponse.email,
                      password: userResponse.password,
                      address: address,
                    })
                  );
                  console.log("Profile saved successfully.");
                } catch (error) {
                  console.error("Error saving profile to AsyncStorage:", error);
                }
                Alert.alert("before dispatch")
                dispatch(
                  updateProfile({
                    id: {
                      firstName: userResponse.firstName,
                      lastName: userResponse.lastName,
                      phoneNumber: userResponse.phoneNumber,
                      email: userResponse.email,
                      password: userResponse.password,
                      address: storedToken?.address || '',
                    },
                  })
                );
                Alert.alert("after dispatch")
                navigation.replace('Loader');
                Alert.alert("after loader")
              } else {
                setIsLoading(false);
                Alert.alert("Invalid Input", "Check the email or password.");
              }
            } catch (error) {
              console.error("Error during email login:", error);
              setIsLoading(false);
              Alert.alert("Login Failed", "An unexpected error occurred.");
            }
          } else {
            Alert.alert("before dispatch II")
            dispatch(updateProfile({
              id: {
                firstName: user.family_name || "",
                lastName: user.given_name || "",
                email: user.email,
                googleID: user.id,
              },
            }));
            Alert.alert("after dispatch II")
            navigation.navigate("AddNumber");
            Alert.alert("after AddNumber")
          }
        } else {
          console.error("User profile or email is missing");
        }
      })();
    }
  }, [response]);
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState("");
  const phoneNumberString = number.replace(/[^0-9]/g, "");
  const phoneNumber = "+1" + phoneNumberString;
  console.log(number);
  async function pressHandler() {
    let response = ""
    try {
      response = await verifyNumber();
    }
    catch (error) {
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
        `${SERVER_URL}/api/v1/users/getNumber/${phoneNumber}`
      );
      if (checkNumber.data.data) {
        const response = await axios.get(
          `${SERVER_URL}/getCode/${phoneNumber}`
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
              keyboard="number-pad"
              textInputConfig={{
                onChangeText: (text) => formatPhoneNumber(text),
                value: number,
                autoComplete: 'tel',
                inputmode: 'tel'
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={number.length == 14 ? pressHandler : () => { }} color={number.length == 14 ? '' : '#aaa'}>
              <Text style={{ fontSize: 16, color: "white" }}>Continue</Text>
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
        <View style={[styles.buttonContainer]}>
          <BareButton onPress={() => { promptAsync() }} borderRadius={24} color="#EEEEEE">
            <Image
              style={styles.facebook}
              source={require("../assets/google.png")}
            />
            <Text> Continue with Google</Text>
          </BareButton>
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
    marginTop: height / 7,
  },
  topView: {
    height: height / 8,
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
    resizeMode: 'center',
    marginLeft: 5,
  },
  facebook: {
    width: "7%",
    resizeMode: "center",
    marginRight: 3,
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
