import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Text from '../Text';
import { PROMO_GREEN } from './promoTheme';

/**
 * @param {{
 *   appliedCoupon?: object | null,
 *   onApply: (code: string) => void | Promise<void>,
 *   isApplying?: boolean,
 *   error?: string | null,
 * }} props
 */
export default function CouponEntrySection({
  appliedCoupon,
  onApply,
  isApplying = false,
  error = null,
}) {
  const [code, setCode] = useState('');
  const apply = () => {
    const c = code.trim();
    if (c) onApply(c);
  };

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Have a coupon?</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          placeholderTextColor="#9ca3af"
          autoCapitalize="characters"
          editable={!isApplying}
          value={code}
          onChangeText={setCode}
          onSubmitEditing={apply}
        />
        <Pressable
          onPress={apply}
          disabled={isApplying}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
        >
          {isApplying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.btnText}>Apply</Text>
          )}
        </Pressable>
      </View>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      {appliedCoupon?.coupon?.code ? (
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {appliedCoupon.coupon.code} applied
            {appliedCoupon.pricing?.formattedDiscount
              ? ` · ${appliedCoupon.pricing.formattedDiscount}`
              : ''}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  btn: {
    backgroundColor: PROMO_GREEN,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  err: {
    marginTop: 8,
    color: '#b91c1c',
    fontSize: 13,
  },
  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: PROMO_GREEN,
    fontWeight: '700',
    fontSize: 13,
  },
});
