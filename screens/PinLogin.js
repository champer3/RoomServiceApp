import { StyleSheet, Image, Text, View } from "react-native";
import CodeInput from "../components/Inputs/CodeInput";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import Info from "../components/Info";

function PinLogin() {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Hello,</Text>
        <Text style={styles.text}>Welcome Back😍</Text>
      </View>
      <View style={{marginBottom: 32}}></View>
      <CodeInput length={6} />
      <View style={[styles.buttonContainer, {marginTop: 20, marginBottom: 16}]}>
        <Button>
          <Text style={{ fontSize: 16, color: "white" }}>Login </Text>
          <Image
            style={styles.vector}
            source={require("../assets/Vector.png")}
          />
        </Button>
      </View>
      <Info text="Enter the five-digit code that was sent to your registered phone number." />
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
        <Text style={{ color: "#BC6C25", fontWeight: "700", opacity: 1 }}>
          {" "}
          Sign Up
        </Text>
      </View>
    </View>
  );
}

export default PinLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    // alignItems: "center",
    marginHorizontal: "5%",
    marginVertical: 80,
    marginTop: 200
  },
  welcomeView: {
    marginBottom: 42,
    marginTop: -70,
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
    marginTop: 70

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
