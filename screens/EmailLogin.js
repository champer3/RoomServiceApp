import { StyleSheet, Image, Text, View, TouchableWithoutFeedback, Keyboard, Pressable, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EmailLogin() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const postData = {
    email,
    password,
  };
  const navigation = useNavigation()
  function handleScreenPress() {
    Keyboard.dismiss()
  }
  async function pressHandler (){
    const response = await createAccount()
    if(typeof response !== 'undefined'){
      dispatch(
        updateProfile({
          id: {
            firstName: response.firstName,
            lastName: response.lastName,
            phoneNumber: response.phoneNumber,
            email: response.email,
            password: response.password,
          },
        })
      );
      navigation.replace('HomeTabs')
    }else{
      Alert.alert("Invalid input", "check the email or password")
    }
  }
  function numberHandler (){
    navigation.navigate('NumberLogin')
  }
  function signUpHandler (){
    navigation.navigate('StartScreen')
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
        `http://10.0.0.173:3000/api/v1/users/login`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const authToken = response.data.token;
      console.log(response.data.data.user)
      await saveTokenToAsyncStorage(authToken)
      return response.data.data.user
    } catch (err) {
      console.log(err.error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Hello,</Text>
        <Text style={styles.text}>Welcome Back😍</Text>
      </View>
      <View
        style={{
          flex: 4,
        //   alignItems: "center",
          width: "100%",
        //   borderWidth: 2,
        //   borderColor: "black",
        }}
      >
        <Input
          type="email"
          text="Email"
          textInputConfig={{
            onChangeText: (text) => setEmail(text),
            value: email,
          }}
          icon={<MaterialIcons name="email" size={24} color="#aaa" />}
        />
        <Input
          type="password"
          text="Password"
          textInputConfig={{
            onChangeText: (text) => setPassword(text),
            value: password,
          }}
          secured ={true}
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
          Forgot Password?
        </Text>

      <View style={styles.buttonContainer}>
        <Button onPress={pressHandler}>
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
        <View style={styles.threeContainer}>
          <View style={styles.line}></View>
          <Text>or continue with</Text>
          <View style={styles.line}></View>
        </View>
        <View style={[styles.buttonContainer, {
            marginBottom: 16
        }]}>
          <BareButton borderRadius={24} color="#EEEEEE">
            <Image
              style={styles.facebook}
              source={require("../assets/facebook.png")}
            />
            <Text> Continue with facebook</Text>
          </BareButton>
        </View>
        <View style={[styles.buttonContainer, {
            marginBottom: 16
            }]}>
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

export default EmailLogin;

// const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginVertical: "10%",
    // marginTop: 200
  },
  welcomeView: {
    // borderWidth: 2,
    // borderColor: "black",
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 23,
  },
  description: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 10,
  },
  image: {
    // flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    marginBottom: 20,
  },
  vector: {
    width: "10%",
    resizeMode: "center",
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
