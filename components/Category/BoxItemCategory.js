import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import { SafeAreaView } from "react-native-safe-area-context"



function BoxItemCategory({items}){

    return <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
        {items.map(({text, image},index) => <BoxedItem key={index} text={text} image={image}/>)}
        </View>
    </ScrollView>
}

export default BoxItemCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // alignItems: "flex-start",
        flexWrap: 'wrap',
    }
})