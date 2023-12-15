import { StyleSheet, Image, Text, View } from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function NumberLogin() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <View style={styles.welcomeView}>
            <Text style={styles.text}>Hello,</Text>
            <Text style={styles.text}>Welcome Back😍</Text>
          </View>
        </View>
        <View style={styles.middleView}>
          <View style={{ marginBottom: "5%" }}>
            <Input type="email" />
          </View>
          <View style={styles.buttonContainer}>
            <Button>
              <Text style={{ fontSize: 16, color: "white" }}>Continue </Text>
              <Image
                style={styles.vector}
                source={require("../assets/Vector.png")}
              />
            </Button>
          </View>
          <View>
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
          </View>
        </View>
        <View style={styles.downView}>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default NumberLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginHorizontal: "5%",
    marginVertical: "20%",
  },
  topView: {
    height: "20%",
  },
  welcomeView: {},
  middleView: {
    height: "40%",
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    marginBottom: "5%",
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
  downView: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
