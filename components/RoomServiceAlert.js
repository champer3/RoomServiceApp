import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Text from "./Text";

export const ROOM_SERVICE_ALERT_TYPES = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

const ALERT_STYLES = {
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

const TYPE_DEFAULTS = {
  success: {
    autoDismissDuration: 5000,
    dismissible: false,
    showProgressBar: true,
  },
  error: { autoDismissDuration: null, dismissible: true, showProgressBar: false },
  warning: {
    autoDismissDuration: null,
    dismissible: true,
    showProgressBar: false,
  },
  info: {
    autoDismissDuration: null,
    dismissible: false,
    showProgressBar: false,
  },
};

function RoomServiceAlert({
  type = ROOM_SERVICE_ALERT_TYPES.info,
  title,
  message,
  icon,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  dismissible,
  autoDismissDuration,
  persistent = false,
  showProgressBar,
  onDismissed,
}) {
  const resolvedType = typeof type === "string" ? type : ROOM_SERVICE_ALERT_TYPES.info;
  const defaults = TYPE_DEFAULTS[resolvedType] || TYPE_DEFAULTS.info;
  const resolvedDismissible = dismissible ?? defaults.dismissible;
  const resolvedAutoDismiss =
    autoDismissDuration ?? defaults.autoDismissDuration;
  const resolvedShowProgressBar =
    showProgressBar ?? (resolvedAutoDismiss ? defaults.showProgressBar : false);

  const theme = ALERT_STYLES[resolvedType] || ALERT_STYLES.info;
  const iconName = icon || DEFAULT_ICONS[resolvedType] || "info";

  const timerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const dismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onDismissed?.();
  };

  useEffect(() => {
    if (
      resolvedAutoDismiss != null &&
      resolvedAutoDismiss > 0 &&
      !persistent
    ) {
      timerRef.current = setTimeout(dismiss, resolvedAutoDismiss);
      if (resolvedShowProgressBar) {
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: resolvedAutoDismiss,
          useNativeDriver: false,
        }).start();
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [resolvedAutoDismiss, persistent]);

  const handlePrimaryAction = () => {
    onPrimaryAction?.();
    if (!persistent) dismiss();
  };

  const handleSecondaryAction = () => {
    onSecondaryAction?.();
    if (!persistent) dismiss();
  };

  const hasActions =
    primaryActionLabel || secondaryActionLabel;

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftWidth: 4,
          borderLeftColor: theme.accentColor,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: { elevation: 4 },
          }),
        },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconPill,
            { backgroundColor: theme.tintColor, borderColor: theme.accentColor },
          ]}
        >
          <MaterialIcons
            name={iconName}
            size={24}
            color={theme.accentColor}
          />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}
        </View>
        {resolvedDismissible ? (
          <Pressable
            onPress={dismiss}
            style={styles.closeButton}
            hitSlop={12}
          >
            <MaterialIcons name="close" size={22} color="#6b7280" />
          </Pressable>
        ) : null}
      </View>

      {hasActions ? (
        <View style={styles.actionsRow}>
          {primaryActionLabel ? (
            <Pressable
              onPress={handlePrimaryAction}
              style={[
                styles.primaryButton,
                { backgroundColor: theme.accentColor },
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {primaryActionLabel}
              </Text>
            </Pressable>
          ) : null}
          {secondaryActionLabel ? (
            <Pressable
              onPress={handleSecondaryAction}
              style={[
                styles.secondaryButton,
                { borderColor: theme.accentColor },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.accentColor }]}>
                {secondaryActionLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {resolvedShowProgressBar && resolvedAutoDismiss != null ? (
        <View style={[styles.progressTrack, { backgroundColor: theme.tintColor }]}>
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
      ) : null}
    </View>
  );
}

export default RoomServiceAlert;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
    flexWrap: "wrap",
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
