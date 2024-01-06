import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native"
import Item from "../Item/Item"
import Product from "../Product/Product"

const { width, height } = Dimensions.get("window");


function ProductHorizontal({items, onPress}){

    return <ScrollView style={styles.container} horizontal={true}>
        {items.map(({title, oldPrice, image, reviews, category}, index) =><View  key={index}  style={{width: width / 2}} >
                <Product reviews={reviews}  category={category} widths={width} title={title} oldPrice={oldPrice} image={image} onAdd = {onPress}/>
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