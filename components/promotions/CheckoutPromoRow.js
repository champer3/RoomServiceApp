import { View, StyleSheet } from 'react-native';
import Text from '../Text';
import { PROMO_GREEN } from './promoTheme';

/**
 * Single discount line on checkout summary.
 * @param {{ title: string, subtitle?: string, amount?: number }} props
 */
export default function CheckoutPromoRow({ title, subtitle, amount }) {
  if (!title) return null;
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {amount != null && amount !== 0 ? (
        <Text style={styles.amt}>
          {amount < 0 ? '' : '-'}
          {Math.abs(Number(amount)).toFixed(2)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  sub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  amt: {
    fontSize: 15,
    fontWeight: '800',
    color: PROMO_GREEN,
    marginLeft: 12,
  },
});
