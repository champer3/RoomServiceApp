import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import Product from "../Product/Product"



function ProductCategory({items, onPress, onTouch}){

    return <ScrollView onTouchStart={onTouch} style={{flex: 1}}>
        <View style={styles.container}>
        {items.map(({title, oldPrice, image,  reviews, category,instructions, addOn, description,nutrient, options, extras}, index) =><View key={index} style={{width: '50%', marginBottom: 15}}>
                    <Product reviews={reviews} nutrient = {nutrient} addOn={addOn} category={category} widths={200} description={description} options = {options} extras ={extras} instructions={instructions} title={title} oldPrice={oldPrice} image={image} onAdd ={onPress}/></View>)}
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