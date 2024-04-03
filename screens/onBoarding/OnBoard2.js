import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Text,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Buttons/Button";
import BareButton from "../../components/Buttons/BareButton";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { useState } from "react";

const { width, height } = Dimensions.get("window");

function OnBoard2() {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false);
  function pressHandler (){
    setIsLoading(true)
    setTimeout(() => {
      navigation.navigate('OnBoard3')
      setTimeout(()=>{setIsLoading(false)}, 200)
      // Set loading status to false after some time (simulating app loading)
    }, 400)
  }
  function skipHandler (){
    setIsLoading(true)
    setTimeout(() => {
      navigation.navigate('Authentication')
      setTimeout(()=>{setIsLoading(false)}, 200)
      // Set loading status to false after some time (simulating app loading)
    }, 400)
  }
  return (
    <GestureRecognizer onSwipeLeft={pressHandler}  onSwipeRight={()=> navigation.navigate('OnBoard1')} style={styles.container}>
      {false ? (
        // Render loading indicator while loading
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/onboard2.jpg")}
      >
        <View style={styles.first}>
          <View style={styles.inner}>
            <View style={styles.circleContainer}>
              <View style={styles.circle}></View>
              <View
                style={[styles.circle, { backgroundColor: "#BC6C25" }]}
              ></View>
              <View style={styles.circle}></View>
            </View>
            <View>
              <Text style={styles.topText}>Elevate Your Culinary Journey</Text>
              <Text style={styles.downText}>
                {""}
                Explore a curated selection of premium ingredients, fresh
                produce, and delightful treats, all available at your
                fingertips.
              </Text>
            </View>
            <View style={styles.butContainer}>
              <View style={styles.buttonView}>
                <BareButton onPress = {skipHandler}>
                  <Text>Skip</Text>
                </BareButton>
              </View>
              <View style={styles.buttonView}>
                <Button onPress = {pressHandler}>
                  <Text style={{ color: "white", fontSize: 16 }}>Next</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>)}
      <StatusBar style="dark" />
      </GestureRecognizer>
  );
}

export default OnBoard2;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 24,
    justifyContent: "flex-end",
  },
  first: {
    height: height / 3.2,
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
    paddingVertical: height/25,
    paddingHorizontal: "5%",
    justifyContent: "space-around",
  },
  backgroundImage: {
    resizeMode: "cover",
    flex: 1,
    // margin: 24,
    justifyContent: "flex-end",
    // opacity: 0.9,
  },
  buttonView: {
    height: 50,
    width: "46%",
  },
  butContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    height: 10,
    width: 10,
    backgroundColor: "#E4E4E4",
    borderRadius: 5,
    marginRight: 5,
  },
  circleContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  topText: {
    fontSize: height/45,
    fontWeight: "600",
    marginVertical: 12,
  },
  downText: {
    fontSize:  height/58,
    fontWeight: "400",
    opacity: 0.7,
    paddingRight: 20,
    marginBottom: 15,
  },
});
