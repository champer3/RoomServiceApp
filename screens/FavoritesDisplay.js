import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/Text";
import Product from "../components/Product/Product";
import { useTheme } from "../theme/ThemeContext";

const { width } = Dimensions.get("window");

function FavoritesDisplay() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const favoriteIds = useSelector((state) => state.favorites.ids);
  const allProducts = useSelector((state) => state.productItems.ids);

  const favoriteProducts = allProducts.filter(
    (p) => favoriteIds.includes(p._id || p.id)
  );

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeTabs");
  }

  const renderItem = useCallback(({ item }) => (
    <View style={styles.gridItem}>
      <Product product={item} layout="grid" />
    </View>
  ), []);

  const keyExtractor = useCallback((item) => item._id || item.id || item.title, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable onPress={goBack} style={styles.backOuter} hitSlop={8}>
            <BlurView intensity={Platform.OS === "ios" ? 82 : 58} tint="light" style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.78)", "rgba(252,252,251,0.52)", "rgba(248,249,246,0.44)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
            <LinearGradient pointerEvents="none" colors={["rgba(255,255,255,0.35)", "transparent"]} style={styles.backHighlight} />
            <View style={styles.backIconWrap} pointerEvents="none">
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={[styles.navTitleText, { color: colors.text }]} numberOfLines={1}>My Favorites</Text>
        </View>
        <View style={styles.navSide} />
      </View>

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="heart-outline" size={56} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorites yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Tap the heart on any product to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default FavoritesDisplay;

const styles = StyleSheet.create({
  container: { flex: 1 },

  navRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingBottom: 10 },
  navSide: { width: 44, alignItems: "center", justifyContent: "center" },
  navTitleCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  navTitleText: { fontFamily: "Poppins-SemiBold", fontSize: 17, letterSpacing: 0.2 },
  backOuter: { width: 35, height: 35, borderRadius: 999, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.9)", shadowColor: "#1f2937", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 22, elevation: 14 },
  backHighlight: { position: "absolute", top: 0, left: 0, right: 0, height: 12, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  backIconWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridItem: {
    width: (width - 48) / 2,
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
