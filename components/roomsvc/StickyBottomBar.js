import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../Text';
import { colors, radii, shadows, spacing } from './tokens';

/**
 * Sticky total + primary CTA for product detail / decision screens.
 */
export default function StickyBottomBar({
  totalLabel,
  primaryLabel,
  onPrimaryPress,
  disabled,
  children,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.row}>
        <View style={styles.totalCol}>
          <Text style={styles.totalHint}>Total</Text>
          <Text style={styles.total}>{totalLabel}</Text>
        </View>
        <Pressable
          onPress={onPrimaryPress}
          disabled={disabled}
          style={[styles.cta, disabled && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>{primaryLabel}</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    ...shadows.tabBar,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  totalCol: { flex: 1 },
  totalHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  total: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    minWidth: 160,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
