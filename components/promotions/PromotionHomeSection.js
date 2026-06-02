import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import HomeHeroPromotion from './HomeHeroPromotion';
import HomeFeaturedStripPromotion from './HomeFeaturedStripPromotion';
import GenericPromotionCard from './GenericPromotionCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_SIDE_PADDING = 10;

/**
 * Renders API `/app/home` promotion buckets on the home screen.
 * All buckets are horizontal-scroll rails.
 * @param {{ promotionsOverride?: { hero?: any[], featuredStrip?: any[], tiles?: any[] }, heroVariant?: string }} props
 */
export default function PromotionHomeSection({
  homeData,
  navigation,
  products = [],
  buckets = ['hero', 'featuredStrip', 'tiles'],
  promotionsOverride,
  heroVariant = 'default',
  featuredCardWidth,
  featuredCompact,
}) {
  const promos = promotionsOverride || homeData?.promotions || {};
  const { hero = [], featuredStrip = [], tiles = [] } = promos;

  const showHero = buckets.includes('hero') && hero.length > 0;
  const showFeatured = buckets.includes('featuredStrip') && featuredStrip.length > 0;
  const showTiles = buckets.includes('tiles') && tiles.length > 0;

  const heroListRef = useRef(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroScrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showHero || hero.length <= 1) return undefined;

    const timer = setInterval(() => {
      const nextIndex = (heroIndex + 1) % hero.length;
      heroListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setHeroIndex(nextIndex);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroIndex, hero.length, showHero]);

  if (!showHero && !showFeatured && !showTiles) return null;

  return (
    <View style={styles.wrap}>
      {showHero ? (
        <View>
          <Animated.FlatList
            ref={heroListRef}
            data={hero}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.heroRail}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            pagingEnabled
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="start"
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const next = Math.round(x / SCREEN_WIDTH);
              setHeroIndex(next);
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: heroScrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={styles.heroPage}>
                <HomeHeroPromotion
                  promotion={item}
                  navigation={navigation}
                  products={products}
                />
              </View>
            )}
          />
          {hero.length > 1 ? (
            <View style={styles.indicatorRow}>
              {hero.map((item, index) => {
                const inputRange = [
                  (index - 1) * SCREEN_WIDTH,
                  index * SCREEN_WIDTH,
                  (index + 1) * SCREEN_WIDTH,
                ];
                const width = heroScrollX.interpolate({
                  inputRange,
                  outputRange: [8, 22, 8],
                  extrapolate: 'clamp',
                });
                const opacity = heroScrollX.interpolate({
                  inputRange,
                  outputRange: [0.35, 1, 0.35],
                  extrapolate: 'clamp',
                });

                return <Animated.View key={`${item.id}-dot`} style={[styles.indicatorDot, { width, opacity }]} />;
              })}
            </View>
          ) : null}
        </View>
      ) : null}

      {showFeatured ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
        >
          {featuredStrip.map((p) => (
            <HomeFeaturedStripPromotion
              key={p.id}
              promotion={p}
              navigation={navigation}
              products={products}
            />
          ))}
        </ScrollView>
      ) : null}

      {showTiles ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
        >
          {tiles.map((p) => (
            <View key={p.id} style={styles.tileCard}>
              <GenericPromotionCard
                promotion={p}
                navigation={navigation}
                products={products}
              />
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 5,
  },
  heroRail: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  rail: {
    paddingLeft: 10,
    paddingVertical: 8,
    paddingRight: 8,
  },
  heroPage: {
    width: SCREEN_WIDTH,
    paddingHorizontal: HERO_SIDE_PADDING,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 5,
    gap: 6,
  },
  indicatorDot: {
    height: 5,
    borderRadius: 999,
    backgroundColor: '#BC6C25',
  },
  tileCard: {
    width: 320,
    marginRight: 8,
  },
});
