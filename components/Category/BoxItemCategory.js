import { ScrollView, StyleSheet, Text, View } from "react-native"
import BoxedItem from "../Item/BoxedItem"
import { SafeAreaView } from "react-native-safe-area-context"



function BoxItemCategory({items}){

    return <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
            
        {items.map(({text, image},index) => <BoxedItem key={index} text={text} image={image}/>)}
    </ScrollView>
    </SafeAreaView>
}

export default BoxItemCategory

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    }
})