import { Image, Pressable, Animated } from "react-native";
import { StyleSheet,  View, Dimensions } from "react-native";
import Text from '../Text';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get('window');
const FadeOutView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 1

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true, // Add this line to improve performance
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};
const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // Add this line to improve performance
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

function Item({ text, image , onPress, color, show = true}) {

const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Category', {cat: text})
  }
    // console.log(width)
  return (
    <FadeInView>
      <Pressable onPress={pressHandler} style={ ({ pressed }) => pressed && { opacity: 0.5 }}>

        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
        </View>
        {show && <FadeInView><Text style={[styles.text, {color: "white" ? color : "black"}]}>{text}</Text></FadeInView>}
        {!show && <FadeOutView><Text style={[styles.text, {color: "white" ? color : "black"}]}>{text}</Text></FadeOutView>}

      </Pressable>
      </FadeInView>
  );
}

export default Item;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // marginHorizontal: 10,
    height: height/2,
    // height: 200,
    width: width / 3.6,

  },
  pressed: {
    // width: "86%",
    // height: "90%"
  },
  imageContainer: {
    // backgroundColor: "#f9f3cf59",
    backgroundColor: "white",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    height: height/13,
    width: width/6.2,
  },
  image: { width: width/5.8, height: height/ 18, resizeMode: 'contain'  },
  text: {  fontSize: 13, textAlign: "center" },
});
