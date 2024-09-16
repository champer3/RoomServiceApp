import { ScrollView, StyleSheet, View, Pressable, Dimensions, Image } from "react-native"
import Item from "../Item/Item"
import Ionicons from '@expo/vector-icons/Ionicons';
import Text from "../Text";
const { width, height } = Dimensions.get('window');
function ItemSmallCategory({items, onPress, color, show}){

    return <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={styles.container}>
        {items.map(({text, image},index) => <Pressable  style={ [styles.contain, ({ pressed }) => pressed && { opacity: 0.5 }]} onPress={onPress} key={index} ><View style={{width: 25, alignItems: "center",
        // marginHorizontal: 10,
        height: 25,  
        // backgroundColor: "white",
        paddingTop: 3,
        // borderRadius: 30,
        overflow: 'hidden'
        }}><Image style={styles.image} source={image}/></View>
        <Text style={{color: '#BC6C25', fontSize: 10}}>{text}</Text>
        </Pressable>)}

        </View>
    </ScrollView>
}

export default ItemSmallCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // width: width,
        gap:5,
        paddingLeft: 2,
        // height: "45%",
    }, contain: {
        alignItems: "flex-end",
        // marginHorizontal: 10,
        height: 25,
        // height: 200,
        flexDirection: 'row',
        backgroundColor: "white",
        paddingRight: 15,
        borderRadius: 30,
        overflow: 'hidden'
      
      },
    text: {  fontSize: 10, textAlign: "center" }, 
    image: { width: 25, height: 25, alignItems:'center' ,borderRadius: 10}
})