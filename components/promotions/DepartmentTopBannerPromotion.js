import { View, Pressable, Image, StyleSheet } from 'react-native';
import Text from '../Text';
import AppImage from '../AppImage';
import { PROMO_CARD, PROMO_GREEN, toneToColor } from './promoTheme';
import { handlePromotionCtaPress } from '../../utils/promotionCtaNavigation';

/**
 * @param {{ promotion: object, navigation?: object, products?: object[] }} props
 */
export default function DepartmentTopBannerPromotion({ promotion, navigation, products }) {
  const img = promotion?.imageUrl || promotion?.mobileImageUrl;
  const badge = promotion?.badge;
  const cta = promotion?.cta;
  const discount = promotion?.pricing?.formattedDiscount;
  const onCta = () => handlePromotionCtaPress(navigation, promotion, { products });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppImage uri={img || null} style={styles.thumb} />
        <View style={styles.textCol}>
          {(badge?.label || discount) && (
            <View style={[styles.badge, { backgroundColor: toneToColor(badge?.tone || 'sale') }]}>
              <Text style={styles.badgeText}>{badge?.label || discount}</Text>
            </View>
          )}
          <Text style={styles.title}>{promotion?.title}</Text>
          {promotion?.subtitle ? (
            <Text style={styles.subtitle}>{promotion.subtitle}</Text>
          ) : null}
          {cta?.label ? (
            <Pressable onPress={onCta} style={styles.cta}>
              <Text style={styles.ctaText}>{cta.label}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PROMO_CARD,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  cta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: PROMO_GREEN,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
