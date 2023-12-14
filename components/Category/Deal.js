import { ScrollView, StyleSheet, Text, View , Pressable} from "react-native"
import Item from "../Item/Item"
import Product from "../Product/Product"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


function Deal({text}){
    const items =[{title:'',oldPrice: 2.99, newPrice: 1.99, image: require("../../assets/snack.png")},{title:'',oldPrice: 2.99, newPrice: 1.99, image: require("../../assets/snack.png")}, {title:'',oldPrice: 2.99, newPrice: 1.99, image: require("../../assets/snack.png")}, {title:'',oldPrice: 2.99, newPrice: 1.99, image: require("../../assets/snack.png")},{title:'',oldPrice: 2.99, newPrice: 1.99, image: require("../../assets/snack.png")}]
    let odd = ''
    if (items.length % 2 == 1){
        odd = items.splice(0, 1)[0]
    }
    return <SafeAreaProvider>
    <SafeAreaView><ScrollView>
        <View  style={styles.container}>
            <View style={styles.catHead}>
                <Text style={styles.text}>{text}</Text>
                <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }} >
                <Text style={{color: "#BC6C25", fontSize: 12}}>More Deals</Text>
                </Pressable>
            </View>
            {odd && <Product/> }
            <View style={{flexDirection: 'row', flexWrap: 'wrap',}}>
            {items.map((item, index) => <View key={index} style={{width: '50%', marginBottom: 15}}>
                    <Product widths={200}/></View>)}
        </View>
        </View>
       
    </ScrollView>
    
     </SafeAreaView>
     </SafeAreaProvider>
}

export default Deal

const styles = StyleSheet.create({
    container: {
        flexWrap: 'nowrap',
        width: "100%",
        // height: "45%",
        gap: 15,
        paddingHorizontal: 15,
        paddingVertical: 30,
        backgroundColor: '#283618',
        borderRadius: 10,
        alignItems: 'center'
    },
    catHead: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '95%'
      },
      text: { fontWeight: 'bold', fontSize: 16, marginBottom: 20, color: 'white' },
})