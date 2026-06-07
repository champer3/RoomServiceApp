import { createContext, useContext, useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import Text from "../components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NetworkContext = createContext({ isOffline: false });

export function useNetwork() {
  return useContext(NetworkContext);
}

export default function NetworkProvider({ children }) {
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets();
  const slideAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOffline, slideAnim]);

  const bannerHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <NetworkContext.Provider value={{ isOffline }}>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.banner,
            { height: bannerHeight, opacity, paddingTop: isOffline ? 0 : 0 },
          ]}
          pointerEvents={isOffline ? "auto" : "none"}
        >
          <Ionicons name="cloud-offline-outline" size={15} color="#fff" />
          <Text style={styles.bannerText}>No internet connection</Text>
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </View>
    </NetworkContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#B22334",
    overflow: "hidden",
  },
  bannerText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#fff",
  },
  content: { flex: 1 },
});
