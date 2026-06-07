import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Placeholder from './Placeholder';

const { width } = Dimensions.get('window');
const CARD_W = width / 2.25;

const ProductCardSkeleton = () => (
  <View style={styles.productCard}>
    <Placeholder style={styles.productImage} />
    <Placeholder style={styles.productTitleLine} />
    <Placeholder style={styles.productPriceLine} />
  </View>
);

const SectionSkeleton = () => (
  <View style={styles.section}>
    <Placeholder style={styles.sectionTitle} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.productRow}
    >
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </ScrollView>
  </View>
);

export default function SkeletonDepartment() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header: back button + title */}
        <View style={styles.headerRow}>
          <Placeholder style={styles.backButton} />
          <Placeholder style={styles.titleBlock} />
          <View style={styles.spacer} />
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Placeholder style={styles.searchBar} />
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.tabsRow}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Placeholder
              key={i}
              style={[styles.tab, { width: 60 + (i % 3) * 20 }]}
            />
          ))}
        </ScrollView>

        {/* Hero banner */}
        <View style={styles.heroWrap}>
          <Placeholder style={styles.heroBanner} />
        </View>

        {/* Product sections */}
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f6f2',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 999,
  },
  titleBlock: {
    height: 22,
    width: 120,
    borderRadius: 6,
  },
  spacer: {
    width: 35,
  },
  searchWrap: {
    paddingHorizontal: 26,
    paddingTop: 10,
    paddingBottom: 12,
  },
  searchBar: {
    height: 48,
    width: '100%',
    borderRadius: 15,
  },
  tabsRow: {
    paddingHorizontal: 22,
    gap: 20,
    marginBottom: 20,
  },
  tab: {
    height: 16,
    borderRadius: 4,
  },
  heroWrap: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroBanner: {
    height: 140,
    width: '100%',
    borderRadius: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    height: 18,
    width: 130,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  productRow: {
    paddingHorizontal: 20,
    gap: 12,
  },
  productCard: {
    width: CARD_W,
    gap: 8,
  },
  productImage: {
    width: CARD_W,
    height: 150,
    borderRadius: 12,
  },
  productTitleLine: {
    height: 14,
    width: CARD_W * 0.75,
    borderRadius: 4,
  },
  productPriceLine: {
    height: 12,
    width: CARD_W * 0.4,
    borderRadius: 4,
  },
});
