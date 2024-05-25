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
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import Info from "../components/Info";
import PhoneIcon from "../components/PhoneIcon";
import { useSelector, useDispatch } from "react-redux";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { updateProfile } from "../Data/profile";
import axios from "axios";

function AddNumber() {
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  function pressHandler (){
    navigation.navigate('EmailSignUp')
  }
  function nextHandler(){
    handleSubmit()
  }
  const navigation = useNavigation();
  const [warning, setWarning] = useState();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);

  const [form, setForm] = useState(data);
  function handleUpdate() {
    dispatch(updateProfile({ id: form }));
  }
  const phoneNumberString = form.number !== undefined || null ? form.number.replace(/[^0-9]/g, '') : null;
  // const phoneNumberString = form.number;
  const phoneNumber = "+1" + phoneNumberString;
  const verifyNumber = async () => {
    console.log(phoneNumber)
    try {
      const response = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/getCode/${phoneNumber}`
      );
      console.log(response);
    } catch (err) {
      console.log(err.error);
    }
  };
  function handleFormChange(field, value) {
    if (field == "number") {
      // const cleanedInput = value;
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
      if (value.length == 14) {
        setWarning();
      }
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit() {
    
    if (form && form.number && form.number.length == 14) {
      try {
        console.log(phoneNumber)
        const checkNumber = await axios.get(
          `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/getNumber/${phoneNumber}`
        );
        console.log(checkNumber)
        if (checkNumber.data.data) {
          Alert.alert(
            "Phone Number already exist",
            "Go ahead and login with your Phone Number"
          );
        } else {
          console.log("bdhbsjbdv");
          handleUpdate();
          verifyNumber();
          navigation.navigate("AddPin", { phoneNumber });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setWarning("Provide a valid number");
    }
  }
  const [active, setActive] = useState(false);
  return (
    <KeyboardAvoidingView   style={{flex: 1}} >
       <Pressable onPress={handleScreenPress} style={styles.container} >
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Awesome,</Text>
            <Text style={styles.text}>Add Your Number😉</Text>
            <View style={styles.lineContainer}>
              <View style={styles.line}></View>
              <View
                style={[styles.line, { backgroundColor: "#283618" }]}
              ></View>
              <View style={styles.line}></View>
            </View>
            <View style={{ }}>
            <Input
              text={"Contact Number"}
              icon={<PhoneIcon />}
              keyboard="number-pad"
              length={14}
              textInputConfig={{
                cursorColor: "#aaa",
                autoComplete: 'tel',
                inputmode: 'tel',
                value: form.number,
                onChangeText: handleFormChange.bind(this, "number"),
              }}
            />
            {warning && (
              <Info
                text={`${warning}                                            `}
              />
            )}

            {/* {!warning && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Pressable onPress={() => setActive((prev) => !prev)}>
                    <Ionicons
                      name={`${
                        active ? "md-radio-button-on" : "md-radio-button-off"
                      }`}
                      size={24}
                      color="#aaa"
                    />
                  </Pressable>
                  <Text style={{ marginVertical: 24 , fontSize: 13 }}>
                    Send me promotional discount and promos via SMS
                  </Text>
                </View>
                <Info text="By selecting this option, you are agreeing to receive promotional discounts, exclusive offers, and marketing promotions via Short Message Service (SMS) to the mobile number provided. " />
              </>
            )} */}
          </View>
          </View>
            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit} color={(form && form.number && form.number.length == 14) ? '' : '#aaa'}>
                <Text style={{ fontSize: 16, color: "white" }}>Send Code </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
          </Pressable>
          </KeyboardAvoidingView>
  );
}

export default AddNumber;
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
    justifyContent: "flex-start",
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
    height: 50,
    marginBottom: 25,
    marginTop: 58,
    alignSelf: 'flex-end'
  },
  vector: {
    width: 21.5,
    height: 15,
    // resizeMode: 'center',
    marginLeft: 5,
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
  },
});
