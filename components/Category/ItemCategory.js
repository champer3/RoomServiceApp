import { ScrollView, StyleSheet, Text, View, Pressable, Dimensions } from "react-native"
import Item from "../Item/Item"
import Ionicons from '@expo/vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
function ItemCategory({items, onPress, color, show}){

    return <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={styles.container}>
        {items.map(({text, image},index) => <Item key={index} color={color} text={text} image={image} show={show} onPress = {onPress}/>)}
        <Pressable  style={ [styles.contain, ({ pressed }) => pressed && { opacity: 0.5 }]}>
            <View style={styles.image}>
            <Ionicons name="grid" size={34} color="#283618" />
            </View>
       
{show && <View><Text style={[styles.text, { color : "black"}]}>More</Text></View>}
</Pressable>
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
    }, contain: {
        alignItems: "center",
        // marginHorizontal: 10,
         alignItems: "center",
        // marginHorizontal: 10,
        height: height/10,
        // height: 200,
        width: width/6.2,
         paddingTop: 10,
        paddingBottom: 10,
        // backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 10,
      
      },
    text: {  fontSize: 10, textAlign: "center" }, image: { width: width/6.5, height: height/ 16, alignItems:'center' ,borderRadius: 10, paddingTop: 10,}
})