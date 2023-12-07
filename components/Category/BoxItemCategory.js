import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import { SafeAreaView } from "react-native-safe-area-context"



function BoxItemCategory({items}){

    return <SafeAreaView>
        <ScrollView>
        <View style={styles.container}>
        {items.map(({text, image},index) => <BoxedItem key={index} text={text} image={image}/>)}
    </View>
    </ScrollView>
    </SafeAreaView>
}

export default BoxItemCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    }
})