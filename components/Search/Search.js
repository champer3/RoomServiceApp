import { StyleSheet, Text, View } from "react-native"
import Pill from "../Pills/Pills"

function Search({items}){

    return <View style ={styles.container}>
        {items.map((item, ind)=> <Pill key={ind} text={item}/>)}
    </View>
}

export default Search

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // borderWidth: 10
    }
})