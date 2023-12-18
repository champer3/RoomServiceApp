import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native"
import Item from "../Item/Item"
import Product from "../Product/Product"

const { width, height } = Dimensions.get("window");


function ProductHorizontal({items}){

    return <ScrollView style={styles.container} horizontal={true}>
        {items.map(({title, oldPrice, image}, index) =><View  key={index}   style={{width: width / 2}} >
                <Product widths={width} title={title} oldPrice={oldPrice} image={image}/>
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