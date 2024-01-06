import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import Product from "../Product/Product"



function ProductCategory({items, onPress}){

    return <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
        {items.map(({title, oldPrice, image,  reviews, category}, index) =><View key={index} style={{width: '50%', marginBottom: 15}}>
                    <Product reviews={reviews}  category={category} widths={200}  title={title} oldPrice={oldPrice} image={image} onAdd ={onPress}/></View>)}
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