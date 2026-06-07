import { Image, Pressable, Animated } from "react-native";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import Text from '../Text';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

const { width } = Dimensions.get('window');

const IMAGE_SIZE = 30;

const PLACEHOLDER = require("../../assets/food.png");

function normalizeImageSource(image) {
  if (image == null) return PLACEHOLDER;
 
  return image;
}

const FadeOutView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};
const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={[{
        opacity: fadeAnim,
      }]}
    >
      {props.children}
    </Animated.View>
  );
};

function Item({ text, image, onPress, color, show = true, itemWidth }) {
  const navigation = useNavigation();
  const imageSource = normalizeImageSource(image);

  function pressHandler() {
    if (typeof onPress === 'function') {
      onPress();
      return;
    }
    navigation.navigate('Category', { cat: text });
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={pressHandler}
        style={({ pressed }) => [
          styles.pill,
          pressed && styles.pillPressed,
        ]}
      >
        <View style={styles.imageRing}>
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode="cover"
          />
        </View>
        {show ? (
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {text}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

export default Item;

const styles = StyleSheet.create({
  wrap: {
    flexShrink: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F3F0",
    borderRadius: 999,
    paddingLeft: 2,
    paddingRight: 16,
    paddingVertical: 2,
    maxWidth: width * 0.64,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    ...Platform.select({
      ios: { elevation: 4 },
      android: { elevation: 2 },
    }),
  },
  pillPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageRing: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#e8ebe6",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 0,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  label: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#111827",
    flexShrink: 1,
    letterSpacing: 0.15,
  },
});
