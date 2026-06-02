import React from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from './tokens';

export default function ActiveOrderBar({ count = 0, onPressTrack, bottomOffset = 56 }) {
  if (count < 1) return null;
  return (
    <Pressable
      onPress={onPressTrack}
      style={[styles.bar, { bottom: bottomOffset }]}
      accessibilityRole="button"
      accessibilityLabel="Track your order"
    >
      <Ionicons name="car-sport" size={20} color="#fff" />
      <Text style={styles.text} numberOfLines={1}>
        {count > 1
          ? `${count} orders on the way — Track`
          : 'Your order is on the way — Track'}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
