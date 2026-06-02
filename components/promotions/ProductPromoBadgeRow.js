import { View, ScrollView, StyleSheet } from 'react-native';
import Text from '../Text';
import { toneToColor } from './promoTheme';

/**
 * Compact badges for product detail (single promotion or aggregate).
 * @param {{ promotion: object }} props
 */
export default function ProductPromoBadgeRow({ promotion }) {
  const labels = [];
  if (promotion?.badge?.label) labels.push({ text: promotion.badge.label, tone: promotion.badge.tone });
  if (promotion?.pricing?.formattedDiscount && !labels.some((l) => l.text === promotion.pricing.formattedDiscount)) {
    labels.push({ text: promotion.pricing.formattedDiscount, tone: 'sale' });
  }
  if (promotion?.deal?.summary) {
    labels.push({ text: promotion.deal.summary.split('•')[0]?.trim() || promotion.deal.summary, tone: 'deal' });
  }

  if (labels.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {labels.map((l, i) => (
        <View key={i} style={[styles.pill, { borderColor: toneToColor(l.tone) }]}>
          <Text style={[styles.pillText, { color: toneToColor(l.tone) }]}>{l.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  pill: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
