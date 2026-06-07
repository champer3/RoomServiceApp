import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Placeholder from './Placeholder';

const { width } = Dimensions.get('window');

const DepartmentGroupSkeleton = () => (
  <View style={styles.group}>
    <View style={styles.groupHeader}>
      <Placeholder style={styles.groupTitle} />
      <Placeholder style={styles.chevron} />
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.categoryRow}
    >
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.categoryItem}>
          <Placeholder style={styles.categoryCircle} />
          <Placeholder style={styles.categoryLabel} />
        </View>
      ))}
    </ScrollView>
  </View>
);

export default function SkeletonBrowse() {
  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Popular right now */}
        <View style={styles.section}>
          <Placeholder style={styles.sectionTitle} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.quickRow}
          >
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.quickItem}>
                <Placeholder style={styles.quickCircle} />
                <Placeholder style={styles.quickLabel} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* All categories */}
        <View style={styles.section}>
          <Placeholder style={styles.sectionTitle} />
          <DepartmentGroupSkeleton />
          <DepartmentGroupSkeleton />
          <DepartmentGroupSkeleton />
        </View>

        {/* Trending searches */}
        <View style={styles.section}>
          <Placeholder style={styles.sectionTitle} />
          <View style={styles.chipsRow}>
            {[72, 90, 60, 80, 68, 85].map((w, i) => (
              <Placeholder key={i} style={[styles.chip, { width: w }]} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    height: 18,
    width: 150,
    borderRadius: 4,
    marginBottom: 14,
  },
  quickRow: {
    gap: 14,
  },
  quickItem: {
    alignItems: 'center',
    gap: 6,
  },
  quickCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  quickLabel: {
    width: 46,
    height: 10,
    borderRadius: 5,
  },
  group: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  groupTitle: {
    height: 18,
    width: 120,
    borderRadius: 4,
  },
  chevron: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  categoryRow: {
    gap: 16,
    paddingRight: 8,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
  },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  categoryLabel: {
    width: 42,
    height: 10,
    borderRadius: 5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    height: 40,
    borderRadius: 999,
  },
});
