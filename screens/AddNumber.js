import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { RadioButton } from "react-native-paper";
import Info from "../components/Info";
import PhoneIcon from "../components/PhoneIcon";

function AddNumber() {
  function handleScreenPress() {
    Keyboard.dismiss()
  }
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('AddPin')
  }
  const [active, setActive] = useState(false)
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Awesome,</Text>
            <Text style={styles.text}>Add Your Number😉</Text>
            <View style={styles.lineContainer}>
              <View style={styles.line}></View>
              <View
                style={[styles.line, { backgroundColor: "#283618" }]}
              ></View>
              <View style={styles.line}></View>
              <View style={styles.line}></View>
            </View>
          </View>
          <View style={{ flex: 5 }}>
          <Input icon={<PhoneIcon />} keyboard="numeric" />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Pressable onPress={() => setActive((prev) => !prev )}><Ionicons name={`${active ? "md-radio-button-on" : "md-radio-button-off"  }`} size={24} color="#aaa" /></Pressable>
              <Text style={{ marginVertical: 24 }}>
                Send me promotional discount and promos via SMS
              </Text>
            </View>
            <Info text="By selecting this option, you are agreeing to receive promotional discounts, exclusive offers, and marketing promotions via Short Message Service (SMS) to the mobile number provided. " />
          </View>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <View style={styles.buttonContainer}>
              <Button onPress={pressHandler}>
                <Text style={{ fontSize: 16, color: "white" }}>Send Code </Text>
                <Image
                  style={styles.vector}
                  source={require("../assets/Vector.png")}
                />
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
}

export default AddNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    // alignItems: "center",
    marginHorizontal: "5%",
    marginVertical: 40,
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
    height: "34%",
  },
  line: {
    height: 2,
    width: "20%",
    backgroundColor: "#D9D9D9",
  },
});
