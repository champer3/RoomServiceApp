import React, { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Product from "../Product/Product";

function ProductCategory({ items, onTouch, bottomPadding = 0, scrollEnabled = true }) {
  const available = (Array.isArray(items) ? items : []).filter(
    (p) => p?.availability !== false
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemWrap}>
        <Product product={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item, index) =>
      item._id != null ? String(item._id) : item.id != null ? String(item.id) : `pc-${index}`,
    []
  );

  return (
    <FlatList
      data={available}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      onTouchStart={onTouch}
      scrollEnabled={scrollEnabled}
      style={styles.list}
      contentContainerStyle={[styles.container, bottomPadding > 0 && { paddingBottom: bottomPadding }]}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

export default memo(ProductCategory);

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  container: {
    paddingBottom: 15,
  },
  itemWrap: {
    width: "50%",
    marginBottom: 15,
  },
});