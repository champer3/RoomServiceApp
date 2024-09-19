import { ScrollView, StyleSheet, View, Dimensions, FlatList } from "react-native"
import Item from "../Item/Item"
import Text from "../Text";
import Product from "../Product/Product"

const { width, height } = Dimensions.get("window");

function ProductHorizontal({ items,categoryName}) {
  // Split the items into rows with 5 items each
  const rows = [];
  for (let i = 0; i < items?.length; i += 5) {
    rows.push(items.slice(i, i + 5)); // Slice items into chunks of 5
  }

  return (
    <View style={{marginBottom: 15, overflow: 'hidden', backgroundColor: '#F0F0F0', 
 }}>
    <Text style={{ paddingLeft: '3%',      fontSize: 28,
          color: '#BC6C25',
          // borderLeftWidth: 5,
          textDecorationLine: 'underline',
          textDecorationStyle: "solid",
          textDecorationColor: "#BC6C25",
          fontFamily: 'Poppins-Bold',
          // borderLeftColor: '#BC6C25', // Distinct accent color
          paddingVertical: 5,
          // backgroundColor: '#BC6C25', // Light background to make it stand out
          paddingLeft: 15 }}>
        {categoryName}
      </Text>
      <View style={{  backgroundColor: '#F0F0F0'  }}>
      {rows.map((row, rowIndex) => (
        <ScrollView key={rowIndex} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer} horizontal={true}>
        <View key={rowIndex} style={styles.rowContainer}>
          {row.map((product, index) => (
            <Product key={product.id} product={product} />
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
  listContainer: {
    // paddingRight: 10,
    backgroundColor: '#F0F0F0', 
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