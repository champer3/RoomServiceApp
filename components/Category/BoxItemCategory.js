import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import { SafeAreaView } from "react-native-safe-area-context"



function BoxItemCategory({items}){

    return <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
        {items.map(({text, image},index) => <BoxedItem key={index} text={text} image={image}/>)}
    </ScrollView>
}

export default BoxItemCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
<<<<<<< HEAD
=======
        // alignItems: "flex-start",
        flexWrap: 'wrap',
>>>>>>> fd8cd90f1f57c3f29f5cf967488ff61e2cc85a21
    }
})