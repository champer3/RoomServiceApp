import { View, Pressable, ImageBackground, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../Text';
import { PROMO_ACCENT, PROMO_GREEN, toneToColor } from './promoTheme';
import { handlePromotionCtaPress } from '../../utils/promotionCtaNavigation';

const { width } = Dimensions.get('window');

/**
 * @param {{ promotion: object, navigation?: object, products?: object[], variant?: 'default' | 'departmentLarge' | 'departmentSlim' }} props
 */
export default function HomeHeroPromotion({ promotion, navigation, products, variant = 'default' }) {
  const img = promotion?.imageUrl || promotion?.mobileImageUrl;
  const badge = promotion?.badge;
  const cta = promotion?.cta;
  const discount = promotion?.pricing?.formattedDiscount;

  const onCta = () => handlePromotionCtaPress(navigation, promotion, { products });

  const wrapStyle = [
    styles.wrap,
    variant === 'departmentLarge' && styles.wrapDeptLarge,
    variant === 'departmentSlim' && styles.wrapDeptSlim,
  ];
  const bgStyle = [
    styles.bg,
    variant === 'departmentLarge' && styles.bgDeptLarge,
    variant === 'departmentSlim' && styles.bgDeptSlim,
  ];
  const gradStyle = [
    styles.gradient,
    variant === 'departmentLarge' && styles.gradientDeptLarge,
    variant === 'departmentSlim' && styles.gradientDeptSlim,
  ];
  const titleStyle = [styles.title, variant === 'departmentSlim' && styles.titleSlim];
  const subtitleStyle = [styles.subtitle, variant === 'departmentSlim' && styles.subtitleSlim];

  return (
    <View style={wrapStyle}>
      {img ? (
        <ImageBackground source={{ uri: img }} style={bgStyle} imageStyle={[styles.bgImage, variant === 'departmentLarge' && styles.bgImageDeptLarge]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.28)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.82)', 'rgba(15,22,10,0.92)']}
            locations={[0, 0.35, 0.72, 1]}
            style={gradStyle}
          >
            <View style={styles.content}>
              <View style={styles.brandAccent} pointerEvents="none" />
              {(badge?.label || discount) && (
                <View style={[styles.badge, { backgroundColor: toneToColor(badge?.tone || 'sale') }]}>
                  <Text style={styles.badgeText}>{badge?.label || discount}</Text>
                </View>
              )}
              <Text style={titleStyle}>{promotion?.title}</Text>
              {promotion?.subtitle ? (
                <Text style={subtitleStyle} numberOfLines={variant === 'departmentSlim' ? 1 : undefined}>
                  {promotion.subtitle}
                </Text>
              ) : null}
              {cta?.label ? (
                <Pressable onPress={onCta} style={({ pressed }) => [styles.cta, variant === 'departmentSlim' && styles.ctaSlim, pressed && styles.ctaPressed]}>
                  <Text style={styles.ctaText}>{cta.label}</Text>
                </Pressable>
              ) : null}
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient colors={['#354820', '#425928', '#4F6B30']} style={bgStyle}>
          <View style={styles.content}>
            {(badge?.label || discount) && (
              <View style={[styles.badge, { backgroundColor: PROMO_ACCENT }]}>
                <Text style={styles.badgeText}>{badge?.label || discount}</Text>
              </View>
            )}
            <Text style={titleStyle}>{promotion?.title}</Text>
            {promotion?.subtitle ? (
              <Text style={subtitleStyle} numberOfLines={variant === 'departmentSlim' ? 1 : undefined}>
                {promotion.subtitle}
              </Text>
            ) : null}
            {cta?.label ? (
              <Pressable onPress={onCta} style={({ pressed }) => [styles.cta, styles.ctaOnBrand, variant === 'departmentSlim' && styles.ctaSlim, pressed && styles.ctaPressed]}>
                <Text style={[styles.ctaText, styles.ctaTextOnBrand]}>{cta.label}</Text>
              </Pressable>
            ) : null}
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 0,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 18,
    overflow: 'hidden',
    maxHeight: 168,
  },
  wrapDeptLarge: {
    borderRadius: 20,
    maxHeight: 210,
  },
  wrapDeptSlim: {
    borderRadius: 16,
    maxHeight: 148,
  },
  bg: {
    width: width - 20,
    minHeight: 138,
    justifyContent: 'flex-end',
  },
  bgDeptLarge: {
    width: width - 40,
    minHeight: 168,
  },
  bgDeptSlim: {
    width: width - 40,
    minHeight: 96,
  },
  bgImage: {
    borderRadius: 18,
  },
  bgImageDeptLarge: {
    borderRadius: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    borderRadius: 18,
  },
  gradientDeptLarge: {
    borderRadius: 20,
  },
  gradientDeptSlim: {
    padding: 12,
    borderRadius: 16,
  },
  titleSlim: {
    fontSize: 15,
    lineHeight: 18,
  },
  subtitleSlim: {
    fontSize: 11,
    lineHeight: 13,
  },
  ctaSlim: {
    marginTop: 4,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  content: {
    gap: 6,
    position: 'relative',
  },
  // brandAccent: {
  //   position: 'absolute',
  //   left: -16,
  //   top: 0,
  //   bottom: 0,
  //   width: 3,
  //   borderRadius: 2,
  //   backgroundColor: PROMO_ACCENT,
  //   opacity: 0.85,
  // },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 8,
    letterSpacing: 0.3,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '900',
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.35,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    marginTop: 1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    fontWeight: '400',
    maxWidth: '96%',
    fontFamily: "Poppins-Medium",
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  cta: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: PROMO_ACCENT,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    ...Platform.select({
      ios: {
        shadowColor: PROMO_ACCENT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.55,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ctaOnBrand: {
    backgroundColor: '#fff',
    borderColor: 'rgba(255,255,255,0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  ctaPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
  ctaTextOnBrand: {
    color: PROMO_GREEN,
  },
});
