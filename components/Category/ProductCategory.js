import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import Product from "../Product/Product"



function ProductCategory({items}){

    return <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
        {items.map((index) => <Product key={index} />)}
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