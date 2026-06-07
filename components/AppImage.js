import { useState, useEffect, useRef } from "react";
import { Image, Animated, StyleSheet, View } from "react-native";

export default function AppImage({ uri, style, resizeMode, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loaded) {
      const loop = Animated.loop(
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: false })
      );
      loop.start();
      return () => loop.stop();
    }
  }, [loaded, shimmer]);

  const bg = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#ece9e4", "#f5f3ef", "#ece9e4"],
  });

  const radius = StyleSheet.flatten(style)?.borderRadius ?? 0;

  return (
    <View style={style} {...rest}>
      {!loaded && (
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: bg, borderRadius: radius }]}
        />
      )}
      {uri ? (
        <Image
          source={{ uri }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
          resizeMode={resizeMode}
          onLoad={() => setLoaded(true)}
        />
      ) : null}
    </View>
  );
}
