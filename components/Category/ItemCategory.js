import { ScrollView, StyleSheet, Text, View } from "react-native"
import Item from "../Item/Item"


function ItemCategory({items, onPress}){

    return <ScrollView  horizontal={true}>
        <View style={styles.container}>
        {items.map(({text, image},index) => <Item key={index} text={text} image={image} onPress = {onPress}/>)}
        </View>
    </ScrollView>
}

export default ItemCategory

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: "100%",
        // height: "45%",
        paddingRight: 10,
        gap: 15
    }
})