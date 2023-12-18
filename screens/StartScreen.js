import { Image, StyleSheet, Text, View } from "react-native";

import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";

function StartScreen() {
  return (
    <View style={styles.container}>
      <Text style={{color: "#333333", opacity: 0.7, fontSize: 16, fontWeight: "500", alignSelf: "flex-end"}}>Skip Registration</Text>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/startimage.png")}
        />
      </View>
      <View style={styles.description}>
        <Text style={{color: "#333333", fontSize: 24, fontWeight: "800", marginVertical: 4}}>Welcome to RoomService</Text>
        <Text style={{color: "#333333", fontSize: 14, fontWeight: "500", marginVertical: 8, textAlign: "center"}}>
          Enjoy the ease of ordering food, groceries, and related items from the
          comfort of your home
        </Text>
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
      <View style={styles.threeContainer}>
        <View style={styles.line}></View>
        <Text>or continue with</Text>
        <View style={styles.line}></View>
      </View>
      <View style={[styles.buttonContainer, {marginBottom: 8}]}>
        <BareButton borderRadius={24} color="#EEEEEE">
          <Image
            style={styles.facebook}
            source={require("../assets/facebook.png")}
          />
          <Text> Continue with facebook</Text>
        </BareButton>
      </View>
      <View style={[styles.buttonContainer, {marginBottom: 24}]}>
        <BareButton borderRadius={24} color="#EEEEEE">
          <Image
            style={styles.facebook}
            source={require("../assets/google.png")}
          />
          <Text> Continue with Google</Text>
        </BareButton>
      </View>
      <View style={styles.textContainer}>
        <Text style={{color: "#333333", opacity: 0.5}}>Already have an account?</Text>
        <Text style={{color: "#BC6C25", fontWeight: "700", opacity: 1}}> Sign In</Text>
      </View>
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "5%",
    marginTop: -50
  },
  imageContainer: {
    width: "100%",
    height: "30%",
    marginTop: 6,
    marginBottom: 32
  },
  description: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    height: 65,
    // marginBottom: 20
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
    marginVertical: 26
  },
  line: {
    height: 2,
    backgroundColor: "#EEEEEE",
    width: "30%",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center"
  }
});
