import { StyleSheet, Image, Text, View } from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { RadioButton } from "react-native-paper";
import Info from "../components/Info";

function AddNumber() {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Awesome,</Text>
        <Text style={styles.text}>Add Your Number😉</Text>
        <View style={styles.lineContainer}>
            <View style={styles.line}></View>
            <View style={[styles.line, {backgroundColor: "#283618"}]}></View>
            <View style={styles.line}></View>
            <View style={styles.line}></View>
        </View>
      </View>
      <View style={{flex: 2}}>
        <Input type="email" />
        <View style={{ flexDirection: "row", alignItems: "center", }}>
          <RadioButton
            value="option1"
            color="blue"
          />
          <Text style={{marginVertical: 24}}>Send me promotional discount and promos via SMS</Text>
        </View>
        <Info text="By selecting this option, you are agreeing to receive promotional discounts, exclusive offers, and marketing promotions via Short Message Service (SMS) to the mobile number provided. " />
      </View>
      <View style={{flex: 2, justifyContent: "flex-end"}}>
      <View style={styles.buttonContainer}>
        <Button>
          <Text style={{ fontSize: 16, color: "white" }}>Send Code </Text>
          <Image
            style={styles.vector}
            source={require("../assets/Vector.png")}
            />
        </Button>
      </View>
            </View>
    </View>
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
    width: "22%",
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
