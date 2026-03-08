import { Image, Pressable, Animated } from "react-native";
import { StyleSheet, View, Dimensions } from "react-native";
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
      style={[{

        opacity: fadeAnim, // Bind opacity to animated value
      }]}
    >
      {props.children}
    </Animated.View>
  );
};

function Item({ text, image, onPress, color, show = true }) {

  const navigation = useNavigation()
  function pressHandler() {
    navigation.navigate('Category', { cat: text })
  }
  // console.log(width)
  return (
    <FadeInView>
      <Pressable onPress={pressHandler} style={[styles.container, ({ pressed }) => pressed && { opacity: 0.5 }]}>

        <Image style={styles.image} source={image} />
        {show && <FadeInView><Text style={[styles.text, {
          color: "black",
          fontSize: 12,
          fontFamily: 'SFPRO-Bold',
          letterSpacing: 1,
          transform: [{ scaleY: 1.1 }]
        }]}>{text}</Text></FadeInView>}
        {!show && <FadeOutView><Text style={[styles.text, { color: "white" ? color : "black", }]}>{text}</Text></FadeOutView>}

      </Pressable>
    </FadeInView>
  );
}

export default Item;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignItems: "center",
    height: height / 10,
    width: width / 6.2,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },
  pressed: {
    // width: "86%",
    // height: "90%"
  },
  imageContainer: {
    height: height / 14,
    width: width / 6.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Add elevation for Android shadow
    marginVertical: 10,
    justifyContent: "center",
  },
  image: {
    width: width / 6.5, height: height / 16, resizeMode: 'cover',
    borderRadius: 10, paddingVertical: 2,
  },
  text: { fontSize: 10, textAlign: "center", },
});
