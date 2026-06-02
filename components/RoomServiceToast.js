import React, { useEffect, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Text from "./Text";

export const ROOM_SERVICE_TOAST_TYPES = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

const TOAST_STYLES = {
  success: { accentColor: "#16A34A", tintColor: "#ECFDF5" },
  error: { accentColor: "#DC2626", tintColor: "#FEF2F2" },
  warning: { accentColor: "#F59E0B", tintColor: "#FFFBEB" },
  info: { accentColor: "#3B82F6", tintColor: "#EFF6FF" },
};

const DEFAULT_ICONS = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

const DEFAULT_DURATIONS = {
  success: 2500,
  error: 3000,
  warning: 3000,
  info: 3000,
};

const ENTRY_DURATION = 200;

function RoomServiceToast({
  type = ROOM_SERVICE_TOAST_TYPES.info,
  title,
  message,
  actionLabel,
  onAction,
  duration,
  onDismissed,
}) {
  const resolvedType =
    typeof type === "string" ? type : ROOM_SERVICE_TOAST_TYPES.info;
  const resolvedDuration =
    duration ?? DEFAULT_DURATIONS[resolvedType] ?? 3000;
  const theme = TOAST_STYLES[resolvedType] || TOAST_STYLES.info;
  const iconName = DEFAULT_ICONS[resolvedType] || "info";

  const timerRef = useRef(null);
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const dismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onDismissed?.();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ENTRY_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ENTRY_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(dismiss, resolvedDuration);

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: resolvedDuration,
      useNativeDriver: false,
    }).start();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resolvedDuration]);

  const handleAction = () => {
    onAction?.();
    dismiss();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            borderLeftColor: theme.accentColor,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.08,
                shadowRadius: 25,
              },
              android: { elevation: 6 },
            }),
          },
        ]}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconPill,
              {
                backgroundColor: theme.tintColor,
                borderColor: theme.accentColor,
              },
            ]}
          >
            <MaterialIcons
              name={iconName}
              size={22}
              color={theme.accentColor}
            />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            {message ? (
              <Text style={styles.message}>{message}</Text>
            ) : null}
          </View>
          {actionLabel ? (
            <Pressable
              onPress={handleAction}
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.tintColor,
                },
              ]}
            >
              <Text
                style={[styles.actionButtonText, { color: theme.accentColor }]}
              >
                {actionLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.tintColor },
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: theme.accentColor,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

export default RoomServiceToast;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "Poppins-Regular",
    lineHeight: 18,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
