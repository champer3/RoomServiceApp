import { View, StyleSheet } from 'react-native';
import Text from '../Text';
import { PROMO_GREEN } from './promoTheme';

/**
 * @param {{
 *   appliedLines?: Array<{ id?: string, title: string, subtitle?: string, appliedAmount?: number }>,
 * }} props
 */
export default function CartPromotionSummary({ appliedLines = [] }) {
  if (!appliedLines.length) return null;

  return (
    <View style={styles.box}>
      <Text style={styles.heading}>Promotions</Text>
      {appliedLines.map((line, i) => (
        <View key={line.id || String(i)} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{line.title}</Text>
            {line.subtitle ? <Text style={styles.sub}>{line.subtitle}</Text> : null}
          </View>
          {line.appliedAmount != null && line.appliedAmount > 0 ? (
            <Text style={styles.amount}>-{Number(line.appliedAmount).toFixed(2)}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  heading: {
    fontSize: 14,
    fontWeight: '800',
    color: PROMO_GREEN,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  sub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: PROMO_GREEN,
    marginLeft: 8,
  },
});
