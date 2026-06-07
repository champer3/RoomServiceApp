import { View, Pressable, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import AppImage from '../AppImage';
import { PROMO_CARD, PROMO_GREEN, toneToColor } from './promoTheme';
import { handlePromotionCtaPress } from '../../utils/promotionCtaNavigation';

const DEFAULT_W = 220;

/**
 * @param {{ promotion: object, navigation?: object, products?: object[], cardWidth?: number, compact?: boolean }} props
 */
export default function HomeFeaturedStripPromotion({
  promotion,
  navigation,
  products,
  cardWidth,
  compact,
}) {
  const w = typeof cardWidth === 'number' && cardWidth > 0 ? cardWidth : DEFAULT_W;
  const img = promotion?.imageUrl || promotion?.mobileImageUrl;
  const badge = promotion?.badge;
  const cta = promotion?.cta;
  const onCta = () => handlePromotionCtaPress(navigation, promotion, { products });

  return (
    <View style={[styles.card, { width: w }]}>
      <AppImage uri={img || null} style={[styles.image, { width: w }]} resizeMode="cover" />
      <View style={[styles.body, compact && styles.bodyCompact]}>
        {badge?.label ? (
          <View style={[styles.badge, { backgroundColor: toneToColor(badge.tone) }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        ) : null}
        <Text numberOfLines={2} style={[styles.title, compact && styles.titleCompact]}>
          {promotion?.title}
        </Text>
        {promotion?.subtitle ? (
          <Text numberOfLines={compact ? 1 : 2} style={[styles.subtitle, compact && styles.subtitleCompact]}>
            {promotion.subtitle}
          </Text>
        ) : null}
        <Pressable onPress={onCta} style={styles.row}>
          <Text style={styles.cta}>{cta?.label || 'View'}</Text>
          <Ionicons name="chevron-forward" size={18} color={PROMO_GREEN} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PROMO_CARD,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    height: 100,
    backgroundColor: '#e5e7eb',
  },
  imagePlaceholder: {
    backgroundColor: '#d1d5db',
  },
  body: {
    padding: 12,
  },
  bodyCompact: {
    padding: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    fontFamily: "Poppins-Bold",
  },
  titleCompact: {
    fontSize: 14,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    fontFamily: "Poppins-Medium",
  },
  subtitleCompact: {
    fontSize: 11,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  cta: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: "Poppins-SemiBold",
    color: PROMO_GREEN,
  },
});
