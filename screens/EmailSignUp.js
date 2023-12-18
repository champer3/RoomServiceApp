import { StyleSheet, Image, Text, View } from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

function EmailSignUp() {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeView}>
        <Text style={styles.text}>Hello,</Text>
        <Text style={styles.text}>Create An Account😍</Text>
      </View>
      <View
        style={{
          //   flex: 4,
          //   alignItems: "center",
          width: "100%",
          height: "57%",
          justifyContent: "flex-start",
          //   borderWidth: 2,
          //   borderColor: "black",
        }}
      >
        <Input
          type="email"
          text="Email"
          icon={<MaterialIcons name="email" size={24} color="#aaa" />}
        />
        <Input
          type="password"
          text="First Name"
          icon={<Ionicons name="person" size={24} color="black" />}
        />
        <Input
          text="Last Name"
          icon={<Ionicons name="person" size={24} color="black" />}
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
          <Button>
            <Text style={{ fontSize: 16, color: "white" }}>Login </Text>
            <Image
              style={styles.vector}
              source={require("../assets/Vector.png")}
            />
          </Button>
        </View>

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
          <View style={styles.line}></View>
          <Text>or continue with</Text>
          <View style={styles.line}></View>
        </View>
        <View
          style={[
            styles.buttonContainer,
            {
              marginBottom: 16,
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
              marginBottom: 16,
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
        </View>
        <View style={styles.textContainer}>
          <Text style={{ color: "#333333", opacity: 0.5 }}>
            Already have an account?
          </Text>
          <Text style={{ color: "#BC6C25", fontWeight: "700", opacity: 1 }}>
            Sign In
          </Text>
        </View>
      </View>
    </View>
  );
}

export default EmailSignUp;

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
    // flex: 1,
    justifyContent: "flex-start",
    height: "10%",
    // marginBottom: 42,
    marginTop: 40,
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
