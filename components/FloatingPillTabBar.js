import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";

const ACTIVE_PILL = "rgba(188, 108, 37, 0.94)";
const ICON_INACTIVE = "#425928";
const ICON_ON_WHITE = "#425928";

function TabIcon({ routeName, focused, size = 20, color }) {
  switch (routeName) {
    case "Home":
      return (
        <Ionicons
          name={focused ? "storefront" : "storefront-outline"}
          size={size}
          color={color}
        />
      );
    case "Browse":
      return (
        <Ionicons
          name={focused ? "grid" : "grid-outline"}
          size={size}
          color={color}
        />
      );
    case "Orders":
      return (
        <Ionicons
          name={focused ? "receipt" : "receipt-outline"}
          size={size}
          color={color}
        />
      );
    case "Account":
      return (
        <Ionicons
          name={focused ? "person" : "person-outline"}
          size={size}
          color={color}
        />
      );
    default:
      return null;
  }
}

function tabLabel(routeName) {
  switch (routeName) {
    case "Home":
      return "Home";
    case "Browse":
      return "Browse";
    case "Orders":
      return "Orders";
    case "Account":
      return "Account";
    default:
      return routeName;
  }
}

/**
 * Floating pill tab bar: inactive = white circle + line icon;
 * active = warm accent pill + white circle + icon + label.
 */
export default function FloatingPillTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const bottomPad = insets.bottom + 12;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.screenPad, { paddingBottom: bottomPad }]}
    >
      <View style={[styles.barOuter, isDark && { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(30,30,30,0.92)" }]}>
        {!isDark && (
          <>
            <BlurView
              intensity={Platform.OS === "ios" ? 82 : 58}
              tint="light"
              style={styles.barBlur}
            />
            <LinearGradient
              pointerEvents="none"
              colors={[
                "rgba(255, 255, 255, 0.78)",
                "rgba(252, 252, 251, 0.52)",
                "rgba(248, 249, 246, 0.44)",
              ]}
              locations={[0, 0.45, 1]}
              style={styles.barGradientWash}
            />
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(255, 255, 255, 0.35)", "transparent"]}
              style={styles.barGradientHighlight}
            />
          </>
        )}
        <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : tabLabel(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabSlot}
            >
              {isFocused ? (
                <View style={styles.activePill}>
                  <View style={styles.activeIconCircle}>
                    <TabIcon
                      routeName={route.name}
                      focused
                      size={17}
                      color={isDark ? "#1E1E1E" : ICON_ON_WHITE}
                    />
                  </View>
                  <Text style={styles.activeLabel} numberOfLines={1}>
                    {label}
                  </Text>
                </View>
              ) : (
                <View style={[styles.inactiveCircle, isDark && { backgroundColor: "rgba(255,255,255,0.08)" }]}>
                  <TabIcon
                    routeName={route.name}
                    focused={false}
                    size={22}
                    color={isDark ? colors.textSecondary : ICON_INACTIVE}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
        </View>
      </View>
    </View>
  );
}

const INACTIVE_SIZE = 44;
const ACTIVE_CIRCLE = 30;

const styles = StyleSheet.create({
  screenPad: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -30,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barOuter: {
    alignSelf: "stretch",
    marginHorizontal: 58,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 14,
  },
  barBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  barGradientWash: {
    ...StyleSheet.absoluteFillObject,
  },
  barGradientHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
  tabSlot: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    flexShrink: 0,
  },
  inactiveCircle: {
    width: INACTIVE_SIZE,
    height: INACTIVE_SIZE,
    borderRadius: INACTIVE_SIZE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACTIVE_PILL,
    borderRadius: 999,
    paddingLeft: 3,
    paddingRight: 10,
    paddingVertical: 4,
    flexShrink: 0,
    transform: [{ scale: 0.92 }],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    ...Platform.select({
      ios: {
        shadowColor: "#BC6C25",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  activeIconCircle: {
    width: ACTIVE_CIRCLE,
    height: ACTIVE_CIRCLE,
    borderRadius: ACTIVE_CIRCLE / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  activeLabel: {
    marginLeft: 5,
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.15,
    flexShrink: 0,
    includeFontPadding: false,
  },
});
