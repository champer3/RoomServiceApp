import { View, Pressable, StyleSheet } from 'react-native';
import Text from '../Text';
import { PROMO_GREEN } from './promoTheme';
import { handlePromotionCtaPress } from '../../utils/promotionCtaNavigation';

/**
 * @param {{ promotion: object, navigation?: object, products?: object[] }} props
 */
export default function ProductInlinePromotion({ promotion, navigation, products }) {
  const line =
    promotion?.deal?.summary ||
    promotion?.pricing?.formattedDiscount ||
    promotion?.subtitle ||
    '';
  const cta = promotion?.cta;
  const onCta = () => handlePromotionCtaPress(navigation, promotion, { products });

  if (!promotion?.title && !line) return null;

  return (
    <View style={styles.card}>
      {promotion?.title ? <Text style={styles.title}>{promotion.title}</Text> : null}
      {line ? <Text style={styles.line}>{line}</Text> : null}
      {cta?.label ? (
        <Pressable onPress={onCta} style={styles.cta}>
          <Text style={styles.ctaText}>{cta.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  line: {
    marginTop: 6,
    fontSize: 14,
    color: '#4b5563',
  },
  cta: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: PROMO_GREEN,
    fontWeight: '800',
    fontSize: 14,
  },
});
