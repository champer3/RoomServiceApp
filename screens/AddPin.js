import { StyleSheet, Image, Text, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import CodeInput from "../components/Inputs/CodeInput";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { RadioButton } from "react-native-paper";
import Info from "../components/Info";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";

function AddPin() {
  const [otp, setOtp] = useState([1,2,3,4,5,6])
  const route = useRoute()
  const phoneNumber = route.params?.phoneNumber || ""
  function getOtp(data){
    setOtp(data)
  }
  function handleScreenPress() {
    Keyboard.dismiss()
  }
  const navigation = useNavigation()
  function pressHandler (){
    verifyNumber(otp)
    navigation.navigate('CreatePassword')
  }
  const verifyNumber = async(code) =>{
    const response = await axios.get(`http://10.0.0.173:3000/verifyPhone/${phoneNumber}/${code}`);
    console.log("got here")
    // console.log(response.data)
  }
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
    <View style={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Almost there,</Text>
        <Text style={styles.text}>Verify Your Number😉</Text>
        <View style={styles.lineContainer}>
            <View style={styles.line}></View>
            <View style={styles.line} ></View>
            <View style={[styles.line, {backgroundColor: "#283618"}]}></View>
            <View style={styles.line}></View>
        </View>
      </View>
      <View style={{flex: 2}}>
        <CodeInput getOtpData={getOtp}  length={5} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{marginVertical: 20}}>Resend Code</Text>
          <Text style={{marginVertical: 20}}>00:59</Text>
        </View>
        <Info text="Enter the five-digit code that was sent to the mobile number you previously entered" />
      </View>
      <View style={{flex: 2, justifyContent: "flex-end"}}>
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
    </View>
    </TouchableWithoutFeedback>
  );
}

export default AddPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    // alignItems: "center",
    marginHorizontal: "5%",
    marginVertical: 80,
  },
  welcomeView: {
    flex: 1,
    marginBottom: 42,
    // marginTop: -70,
  },
  description: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    marginBottom: -20,
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
    marginTop: "5%",
    justifyContent: "space-between",
    height: "34%"
  },
  line: {
    height: "5%",
    width: "20%",
    backgroundColor: "#D9D9D9",
  }
});
