import { StyleSheet, Image, View } from "react-native";
import CodeInput from "../components/Inputs/CodeInput";
import Button from "../components/Buttons/Button";
import Info from "../components/Info";
import Text from '../components/Text';
function RecoveryPin() {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Oops,</Text>
        <Text style={styles.text}>Recover Your Account😇</Text>

      </View>
      <View style={{flex: 2}}>
        <CodeInput length={6} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{marginVertical: 20}}>Resend Code</Text>
          <Text style={{marginVertical: 20}}>00:59</Text>
        </View>
        <Info text="Enter the six-digit code that was sent to the mobile number you previously entered" />
      </View>
      <View style={{flex: 2, justifyContent: "flex-end"}}>
      <View style={styles.buttonContainer}>
        <Button>
          <Text style={{ fontSize: 18, color: "white" }}>Verify Email </Text>
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

export default RecoveryPin;

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
    justifyContent: "center",
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
    width: "16%",
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
    fontSize: 30,
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
