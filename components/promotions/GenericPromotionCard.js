import { View, Pressable, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import Text from '../Text';
import { PROMO_CARD, PROMO_GREEN, toneToColor } from './promoTheme';
import { handlePromotionCtaPress } from '../../utils/promotionCtaNavigation';

const { width } = Dimensions.get('window');

/**
 * @param {{ promotion: object, onCtaPress?: () => void, navigation?: object, products?: object[] }} props
 */
export default function GenericPromotionCard({ promotion, onCtaPress, navigation, products }) {
  const badge = promotion?.badge;
  const cta = promotion?.cta;
  const img = promotion?.imageUrl || promotion?.mobileImageUrl;

  const fireCta = () => {
    if (onCtaPress) onCtaPress();
    else if (navigation) {
      handlePromotionCtaPress(navigation, promotion, { products });
    }
  };

  return (
    <View style={styles.card}>
      {!!img && (
        <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.body}>
        {badge?.label ? (
          <View style={[styles.badge, { backgroundColor: toneToColor(badge.tone) }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>{promotion?.title || ''}</Text>
        {promotion?.subtitle ? (
          <Text style={styles.subtitle}>{promotion.subtitle}</Text>
        ) : null}
        {cta?.label ? (
          <Pressable onPress={fireCta} style={styles.cta}>
            <Text style={styles.ctaText}>{cta.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PROMO_CARD,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: width - 24,
    height: 140,
    backgroundColor: '#e5e7eb',
  },
  body: {
    padding: 16,
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
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  cta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: PROMO_GREEN,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
