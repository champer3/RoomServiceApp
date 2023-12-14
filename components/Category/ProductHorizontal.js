import { ScrollView, StyleSheet, Text, View } from "react-native"
import Item from "../Item/Item"
import Product from "../Product/Product"


function ProductHorizontal({items}){

    return <ScrollView style={styles.container} horizontal={true}>
        {items.map((index) => <Product key={index} />)}
    </ScrollView>
}

export default ProductHorizontal

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: "100%",
        // height: "45%",
        paddingRight: 10,
    }
})