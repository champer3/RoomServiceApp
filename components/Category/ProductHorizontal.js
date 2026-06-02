import { ScrollView, StyleSheet, View, Dimensions } from "react-native";
import Text from "../Text";
import Product from "../Product/Product";

const { width: SCREEN_W } = Dimensions.get("window");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function computeDefaultColumns() {
  // Keeps "3-5 columns" behavior stable across devices.
  if (SCREEN_W >= 420) return 5;
  if (SCREEN_W >= 380) return 4;
  return 3;
}

function ProductHorizontal({
  items,
  categoryName,
  titleOverride,
  columnsPerRow,
  productLayout = "rail",
}) {
  const cols = clamp(columnsPerRow ?? computeDefaultColumns(), 3, 5);
  const safeItems = Array.isArray(items) ? items : [];

  // Split the items into rows with N items each.
  const rows = [];
  for (let i = 0; i < safeItems.length; i += cols) {
    rows.push(safeItems.slice(i, i + cols));
  }

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{titleOverride || categoryName}</Text>

      <View style={styles.railWrap}>
        {rows.map((row, rowIndex) => (
          <ScrollView
            key={rowIndex}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            horizontal
          >
            <View key={rowIndex} style={styles.rowContainer}>
              {row.map((product, index) => (
                <Product
                  key={
                    product._id != null
                      ? String(product._id)
                      : product.id != null
                        ? String(product.id)
                        : `p-${rowIndex}-${index}`
                  }
                  product={product}
                  layout={productLayout}
                />
              ))}
            </View>
          </ScrollView>
        ))}
      </View>
    </View>
  );
}

export default ProductHorizontal
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
  railWrap: {
    backgroundColor: 'transparent',
  },
  listContainer: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
});

{/* <ScrollView showsHorizontalScrollIndicator={false} style={styles.container} horizontal={true}>
{items?.map((item, index) =><View  key={index}  style={{width: width / 3}} >
        <Product product={item} onAdd = {onPress}/>
        </View>)}
</ScrollView> */}