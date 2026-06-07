import { View, Pressable, Image, StyleSheet } from 'react-native';
import Text from '../Text';
import AppImage from '../AppImage';
import { PROMO_GREEN, toneToColor } from './promoTheme';
import { handlePromotionCtaPress } from '../../utils/promotionCtaNavigation';

/**
 * @param {{ promotion: object, navigation?: object, products?: object[] }} props
 */
export default function CategoryHeaderPromotion({ promotion, navigation, products }) {
  const img = promotion?.imageUrl || promotion?.mobileImageUrl;
  const badge = promotion?.badge;
  const cta = promotion?.cta;
  const discount = promotion?.pricing?.formattedDiscount;
  const onCta = () => handlePromotionCtaPress(navigation, promotion, { products });

  return (
    <View style={styles.banner}>
      <AppImage uri={img || null} style={[styles.bg, !img && { backgroundColor: '#354820' }]} resizeMode="cover" />
      <View style={styles.overlay}>
        {(badge?.label || discount) && (
          <View style={[styles.badge, { backgroundColor: toneToColor(badge?.tone || 'special') }]}>
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
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e7eb',
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    minHeight: 120,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  cta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaText: {
    color: PROMO_GREEN,
    fontWeight: '800',
    fontSize: 14,
  },
});
