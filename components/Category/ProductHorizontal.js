import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native"
import Item from "../Item/Item"
import Product from "../Product/Product"

const { width, height } = Dimensions.get("window");


function ProductHorizontal({items, onPress}){

    return <ScrollView showsHorizontalScrollIndicator={false} style={styles.container} horizontal={true}>
        {items.map(({title, oldPrice, image, reviews, category, nutrient, instructions, description, addOn, options, extras}, index) =><View  key={index}  style={{width: width / 3}} >
                <Product reviews={reviews} options={options} nutrient ={nutrient} addOn={addOn} category={category} description={description} extras ={extras} instructions={instructions}  widths={width} title={title} oldPrice={oldPrice} image={image} onAdd = {onPress}/>
                </View>)}
    </ScrollView>
}

export default ProductHorizontal

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // height: "45%",
        position: 'absolute',
        top: 32,
        
    }
})