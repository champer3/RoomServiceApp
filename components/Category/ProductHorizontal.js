import { ScrollView, StyleSheet, Text, View } from "react-native"
import Item from "../Item/Item"
import Product from "../Product/Product"


function ProductHorizontal({items}){

    return <ScrollView style={styles.container} horizontal={true}>
        {items.map((index) =><View  key={index}   style={{width: 300}} >
                <Product widths={500}  /> 
                </View>)}
    </ScrollView>
}

export default ProductHorizontal

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // height: "45%",
        paddingRight: 10,
    }
})