import { ScrollView, StyleSheet, Text, View } from "react-native"
import Item from "../Item/Item"


function ItemCategory({items, onPress, color, show}){

    return <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={styles.container}>
        {items.map(({text, image},index) => <Item key={index} color={color} text={text} image={image} show={show} onPress = {onPress}/>)}
        </View>
    </ScrollView>
}

export default ItemCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: "100%",
        // height: "45%",
        paddingRight: 10,
        marginLeft: 10,
        gap: 15
    }
})