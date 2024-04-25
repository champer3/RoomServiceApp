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
  ActivityIndicator
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import Info from "../components/Info";
import BareButton from "../components/Buttons/BareButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import axios from "axios";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

function EmailSignUp() {
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

  
  const navigation = useNavigation();
  function signInHandler() {
    navigation.navigate("NumberLogin");
  }
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);

  const [warning, setWarning] = useState();
  const [form, setForm] = useState(data);
  function handleUpdate() {
    dispatch(updateProfile({ id: form }));
  }
  function pressHandler (){
    handleSubmit()
  }
  function handleFormChange(field, value) {
    if (field == "number") {
      // const cleanedInput = value.replace(/\D/g, '');
      const cleanedInput = value.replace(/\D/g, "");

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
      value = formattedNumber;
    }
    if (field == "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value.trim())) {
        setWarning("Provide a valid email address");
      } else {
        setWarning();
      }
    }
    setForm((prev) => ({ ...prev, [field]: value.trim() }));
  }
  async function handleSubmit() {
    handleScreenPress()
    if (!warning && form.email && form.firstName && form.lastName) {
      // console.log(form);
      try {
        const checkEmail = await axios.get(
          `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/getEmail/${form.email}`
        );
        setIsLoading(true)
        setTimeout(() => {
          if ( checkEmail.data.data.user.length > 0) {
            Alert.alert(
              "Email already exist",
              "Go ahead and login with your email address"
            );
          } else {
            console.log("bdhbsjbdv");
            handleUpdate();
            navigation.navigate("AddNumber");
          }
          setTimeout(()=>{ setIsLoading(false)}, 200)
          // Set loading status to false after some time (simulating app loading)
        }, 1000)
       
      } catch (err) {
        console.log(err);
      }
    }
  }
  console.log(form)
  return (
    <KeyboardAvoidingView onPress={handleScreenPress}    style={{flex: 1}} >
      {isLoading ? (
        // Render loading indicator while loading
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (
     <Pressable onPress={handleScreenPress}  style={styles.container}>
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Hello,</Text>
            <Text style={styles.text}>Create An Account🤩</Text>
            <View style={styles.lineContainer}>
              <View
                style={[styles.line, { backgroundColor: "#283618" }]}
              ></View>
              <View style={[styles.line]}></View>
              <View style={styles.line}></View>
            </View>
          </View>
          <View
            style={{
              //   flex: 4,
              //   alignItems: "center",
              width: "100%",
              justifyContent: "start",
              //   borderWidth: 2,
              //   borderColor: "black",
              marginTop: 35,
            }}
          >
            <Input
              text={"Email Address"}
              icon={<MaterialIcons name="email" size={24} color="#aaa" />}
              textInputConfig={{
                cursorColor: "#aaa",
                value: form.email,
                onChangeText: handleFormChange.bind(this, "email"),
              }}
            />
            
            {warning && (
              <Info
                text={`${warning}                                            `}
              />
            )}
            <Input
              text={"First Name"}
              icon={<Ionicons name="person" size={24} color={"#aaa"} />}
              textInputConfig={{
                cursorColor: "#aaa",
                value: form.firstName,
                onChangeText: handleFormChange.bind(this, "firstName"),
              }}
            />
            <Input
              text={"Last Name"}
              icon={<Ionicons name="person" size={24} color={"#aaa"} />}
              textInputConfig={{
                cursorColor: "#aaa",
                value: form.lastName,
                onChangeText: handleFormChange.bind(this, "lastName"),
              }}
            />

            {/* <Text
              style={{
                textAlign: "right",
                paddingRight: 8,
                marginVertical: 8,
                color: "#283618",
              }}
            >
              Forgot Password?
            </Text> */}

            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit} color={!(!warning && form.email && form.firstName && form.lastName) ? '#aaa' : '' }  >
                <Text style={{ fontSize: 16, color: "white" }}>Continue </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
            {/*
            <Text
              style={{
                color: "#BC6C25",
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Login with your mobile number
            </Text> */}
          </View>

          <View
            style={{
              //   flex:2,
              justifyContent: "flex-start",
              height: "33%",
              //   borderWidth: 2,
              //   borderColor: "black",
            }}
          >
            <View style={styles.threeContainer}>
              <View style={{height: 2,
    backgroundColor: "#EEEEEE",
    width: "90%",}}></View>
            </View>
            {/* <View
              style={[
                styles.buttonContainer,
                {
                  marginBottom: 16,
                },
              ]}
            >
              <BareButton borderRadius={24} color="#EEEEEE">
                <Image
                  style={[styles.facebook, { resizeMode: "center" }]}
                  source={require("../assets/facebook.png")}
                />
                <Text> Continue with facebook</Text>
              </BareButton>
            </View>
            <View style={[styles.buttonContainer]}>
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
                Already have an account?
              </Text>
              <Pressable onPress={signInHandler}>
                <Text
                  style={{ color: "#BC6C25", fontWeight: "700", opacity: 1 }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>)}
        </KeyboardAvoidingView>
  );
}

export default EmailSignUp;

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
    // flex: 1,
    justifyContent: "flex-start",
    height: height/10,
    // marginBottom: 42,
    // marginTop: 40,
  },
  description: {
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
    height: 55,
    marginBottom: 20,
    marginTop: 18,
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
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 26
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 26
  },
});
