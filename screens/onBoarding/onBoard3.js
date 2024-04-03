import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Text,
  ActivityIndicator
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/Buttons/Button";
import BareButton from "../../components/Buttons/BareButton";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { useState } from "react";
const { width, height } = Dimensions.get("window");

function OnBoard3() {
  const navigation = useNavigation()
  function pressHandler (){
    setIsLoading(true)
    setTimeout(() => {
      navigation.replace('Authentication')
      setTimeout(()=>{setIsLoading(false)}, 200)
      // Set loading status to false after some time (simulating app loading)
    }, 400)
  }
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GestureRecognizer onSwipeLeft={pressHandler}  onSwipeRight={()=> navigation.navigate('OnBoard2')} style={styles.container}>
     {false ? (
        // Render loading indicator while loading
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : ( <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/onboard3.jpg")}
      >
        <View style={styles.first}>
          <View style={styles.inner}>
            <View style={styles.circleContainer}>
              <View style={styles.circle}></View>
              <View style={styles.circle}></View>
              <View
                style={[styles.circle, { backgroundColor: "#BC6C25" }]}
              ></View>
            </View>
            <View>
              <Text style={styles.topText}>Convenience Redefined</Text>
              <Text style={styles.downText}>
                From pantry staples to delectable delights, we bring you
                convenience without compromise. Sign up now and redefine the way
                you shop.
              </Text>
            </View>
            <View style={styles.butContainer}>
              <View style={styles.buttonView}>
                <BareButton onPress = {pressHandler}>
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
      <StatusBar style="light" />
      </GestureRecognizer>
  );
}

export default OnBoard3;

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
