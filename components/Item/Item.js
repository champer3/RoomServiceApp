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
      style={[ {
        
        opacity: fadeAnim, // Bind opacity to animated value
      }]}
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
      <Pressable onPress={pressHandler} style={ [styles.container, ({ pressed }) => pressed && { opacity: 0.5 }]}>

          <Image style={styles.image} source={image} />
        {show && <FadeInView><Text style={[styles.text, { color : "black"}]}>{text}</Text></FadeInView>}
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
     alignItems: "center",
    // marginHorizontal: 10,
    height: height/10,
    // height: 200,
    width: width/6.2,
     paddingTop: 10,
    paddingBottom: 10,
    // backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
  
  },
  pressed: {
    // width: "86%",
    // height: "90%"
  },
  imageContainer: {
    // backgroundColor: "#f9f3cf59",
     height: height/14,
    // height: 200,
    width: width/6.5,
    //  paddingTop: 10,
     shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
     marginVertical: 10,
    // paddingBottom: 10,
    
   
   
    alignItems: "center",
    justifyContent: "center",
    
    
  },
  image: { width: width/6.5, height: height/ 16, resizeMode: 'cover' ,
  borderRadius: 10, paddingVertical: 10,
 },
  text: {  fontSize: 10, textAlign: "center" },
});
