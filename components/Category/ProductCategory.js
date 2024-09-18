import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import Product from "../Product/Product"



function ProductCategory({items,  onTouch}){

    return <ScrollView onTouchStart={onTouch} style={{flex: 1}}>
        <View style={styles.container}>
        {items.map((product, index) =><View key={index} style={{width: '50%', marginBottom: 15}}>
        <Product key={product.id} product={product} /></View>)}
    </View>
    </ScrollView>
}

export default ProductCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // alignItems: "flex-start",
        flexWrap: 'wrap',
    }
})