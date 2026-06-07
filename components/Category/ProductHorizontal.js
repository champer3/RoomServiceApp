import React, { memo } from "react";
import { FlatList, StyleSheet, View, Dimensions } from "react-native";
import Text from "../Text";
import Product from "../Product/Product";

const { width: SCREEN_W } = Dimensions.get("window");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function computeDefaultColumns() {
  if (SCREEN_W >= 420) return 5;
  if (SCREEN_W >= 380) return 4;
  return 3;
}

const MemoProduct = memo(({ product, layout }) => (
  <Product product={product} layout={layout} />
));

function ProductHorizontal({
  items,
  categoryName,
  titleOverride,
  columnsPerRow,
  productLayout = "rail",
}) {
  const cols = clamp(columnsPerRow ?? computeDefaultColumns(), 3, 5);
  const safeItems = (Array.isArray(items) ? items : []).filter(
    (p) => p?.availability !== false
  );

  const rows = [];
  for (let i = 0; i < safeItems.length; i += cols) {
    rows.push(safeItems.slice(i, i + cols));
  }

  const renderRow = ({ item: row, index: rowIndex }) => (
    <FlatList
      data={row}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      keyExtractor={(product, index) =>
        product._id != null
          ? String(product._id)
          : product.id != null
            ? String(product.id)
            : `p-${rowIndex}-${index}`
      }
      renderItem={({ item: product }) => (
        <MemoProduct product={product} layout={productLayout} />
      )}
      initialNumToRender={cols}
      maxToRenderPerBatch={cols}
      windowSize={2}
      removeClippedSubviews
    />
  );

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{titleOverride || categoryName}</Text>

      <FlatList
        data={rows}
        renderItem={renderRow}
        keyExtractor={(_, index) => `row-${index}`}
        scrollEnabled={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
      />
    </View>
  );
}

export default memo(ProductHorizontal);

const styles = StyleSheet.create({
  sectionWrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 12,
    fontSize: 20,
    color: '#111827',
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.2,
  },
  listContainer: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 12,
  },
});