import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Info from "../components/Info";

function EmailLogin() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const postData = {
    email,
    password,
  };
  function validatePassword() {
    // At least 8 characters
    if (password.length < 8) {
        return false;
    }
    
    // Contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Contains at least one digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Contains at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return false;
    }

    return true;
}

  const [warning, setWarning] = useState();
  const navigation = useNavigation();
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

  
  async function pressHandler() {
    setIsLoading(true)
    let response = ''
    let storedToken = {address: [], orders:  [],}
      
     
    try {response = await createAccount();}
    catch(error){}
    
    if (typeof response !== "undefined") {
      try {
        
        await AsyncStorage.setItem("profile", JSON.stringify({
          firstName: response.firstName,
          lastName: response.lastName,
          phoneNumber: response.phoneNumber,
          email: response.email,
          password: response.password,
          address: storedToken.address
        },));
        console.log("Profile saved successfully.");
      } catch (error) {
        console.error("Error saving token:", error);
      }
      dispatch(
        updateProfile({
          id: {
            firstName: response.firstName,
            lastName: response.lastName,
            phoneNumber: response.phoneNumber,
            email: response.email,
            password: response.password,
            address: storedToken.address
          },
        })
      );
        navigation.replace('Loader'); // Set loading status to false after some time (simulating app loading)
    } else {
      setIsLoading(false)
      Alert.alert("Invalid input", "check the email or password");
    }
  }
  function numberHandler() {
    navigation.navigate("NumberLogin");
  }
  function signUpHandler() {
    navigation.navigate("StartScreen");
  }

  const saveTokenToAsyncStorage = async (authToken) => {
    try {
      await AsyncStorage.setItem("authToken", authToken);
      console.log("Token saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const createAccount = async () => {
    try {
      const response = await axios.post(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/login`,
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
  function handleEmailChange( value) {
      setEmail(value.trim())
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value.trim())) {
        setWarning("Provide a valid email address");
      } else {
        setWarning();
      }
  }
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
         <KeyboardAvoidingView onPress={handleScreenPress}  style={styles.container}>
         {isLoading ? (
        // Render loading indicator while loading
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (<>
        <StatusBar hidden={false} barStyle="dark-content" />
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Hello,</Text>
            <Text style={styles.text}>Welcome Back😍</Text>
          </View>
          <View
            style={{
              marginBottom: 26,
              //   alignItems: "center",
              width: "100%",
              //   borderWidth: 2,
              //   borderColor: "black",
            }}
          >
            <Input
              type="email"
              text="Email"
              keyboard="email-address"
              textInputConfig={{
                onChangeText: (text) => handleEmailChange(text),
                value: email,
                inputmode: email
              }}
              icon={<MaterialIcons name="email" size={24} color="#aaa" />}
            />
             {warning && (
              <Info
                text={`${warning}                                            `}
              />
            )}
            <Input
              type="password"
              text="Password"
              textInputConfig={{
                onChangeText: (text) => setPassword(text.trim()),
                value: password,
              }}
              secured={true}
              icon={<MaterialIcons name="lock" size={24} color="#aaa" />}
            />
           
          
            <Text
              style={{
                textAlign: "right",
                paddingRight: 8,
                marginVertical: 8,
                color: "#283618",
              }}
            >

            </Text>

            <View style={styles.buttonContainer}>
              <Button onPress={!(!warning && email) || !validatePassword() ? ()=>{}: pressHandler} color={!(!warning && email) || !validatePassword() ? '#aaa' : '' }>
                <Text style={{ fontSize: 16, color: "white" }}>Login </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
            <Pressable onPress={numberHandler}>
              <Text
                style={{
                  color: "#BC6C25",
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Login with your mobile number
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              //   borderWidth: 2,
              //   borderColor: "black",
            }}
          >
            {/* <View style={styles.threeContainer}>
              <View style={styles.line}></View>
              <Text>or continue with</Text>
              <View style={styles.line}></View>
            </View>
            <View
              style={[
                styles.buttonContainer,
                {
                },
              ]}
            >
              <BareButton borderRadius={24} color="#EEEEEE">
                <Image
                  style={styles.facebook}
                  source={require("../assets/facebook.png")}
                />
                <Text> Continue with facebook</Text>
              </BareButton>
            </View>
            <View
              style={[
                styles.buttonContainer,
                {
                },
              ]}
            >
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
    </TouchableWithoutFeedback>
  );
}

export default EmailLogin;

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
    // borderWidth: 2,
    // borderColor: "black",
    // flex: 0.6,
    justifyContent: "flex-start",
    marginBottom: 3,
  },
  description: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 10,
  },
  image: {
    // flex: 1,
    height: height/3
  },
  buttonContainer: {
    width: "100%",
    height: 55,
    marginBottom: 20,
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
    marginBottom: 16,
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
});
