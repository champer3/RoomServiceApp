import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Buttons/Button";
import BareButton from "../../components/Buttons/BareButton";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function OnBoard1() {
  const navigation = useNavigation();
  function pressHandler (){
    navigation.navigate('OnBoard2')
  }
  function skipHandler (){
    navigation.navigate('Authentication')
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/onboard1.jpg")}
      >
        <View style={styles.first}>
          <View style={styles.inner}>
            <View style={styles.circleContainer}>
              <View style={[styles.circle, {backgroundColor: "#BC6C25"}]}></View>
              <View style={styles.circle}></View>
              <View style={styles.circle}></View>
            </View>
            <View>
              <Text style={styles.topText}>Welcome To RoomService</Text>
              <Text style={styles.downText}>
                {""}
                Discover a seamless shopping experience that brings your
                favorite foods and groceries to your doorstep.
              </Text>
            </View>
            <View style={styles.butContainer}>
              <View style={styles.buttonView}>
                <BareButton onPress = {skipHandler} ><Text>Skip</Text></BareButton>
              </View>
              <View style={styles.buttonView}>
                <Button onPress = {pressHandler}><Text style={{color: "white", fontSize: 16}}>Next</Text></Button>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <StatusBar style="dark" />
    </View>
  );
}

export default OnBoard1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 24,
    justifyContent: "flex-end",
  },
  first: {
    height: height / 3,
    // width: width * 1.05,
    // marginLeft: -30,
    backgroundColor: "#283618",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    justifyContent: "flex-end",
    opacity: 1,
    // transform: [{ skewY: '-10deg' }]
  },
  inner: {
    height: "97%",
    backgroundColor: "white",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    justifyContent: "space-around"
  },
  backgroundImage: {
    resizeMode: "cover",
    flex: 1,
    // margin: 24,
    justifyContent: "flex-end",
    opacity: 0.9,
  },
  buttonView: {
    height: 50,
    width: "46%"
  },
  butContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  circle: {
    height: 10,
    width: 10,
    backgroundColor: "#E4E4E4",
    borderRadius: 5,
    marginRight: 5
  },
  circleContainer: {
    flexDirection: "row",
    alignSelf: 'flex-start'
  },
  topText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8
  },
  downText: {
    fontSize: 16,
    fontWeight: "300",
    opacity: 0.7,
    paddingRight: 20
  }
});
