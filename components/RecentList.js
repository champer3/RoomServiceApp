import { ScrollView, StyleSheet, Text, View } from "react-native"
import Recent from "./Category/Recent"

function RecentList({items}){

    return <ScrollView style ={styles.container}>
        {items.map((item, ind)=> <Recent key={ind} text={item}/>)}
    </ScrollView>
}

export default RecentList

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    }
})