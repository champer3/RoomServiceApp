import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
function RecieptScreen() {
   const mode  = [{mode: 'Faster (+$2)', time : '10-15\nMinutes', fastest: true}, {mode: 'Fast', time : '30-45 \nMinutes', fastest: false}, {mode: 'Schedule', time : 'Pick a \ndelivery time', fastest: false}]
   
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <SafeAreaView style ={{flex: 1}}>
       
        <View style={{paddingLeft: '5%', paddingVertical: '6%', flexDirection: 'row', alignItems: 'center', gap: 20}}>
        <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Ionicons name="md-arrow-back-outline" size={40} color="black" />
        </Pressable>
        <Text style ={{fontWeight: 'bold', fontSize: 20}}>Order Receipt</Text>
        </View>
        <View style={{flex: 0.5}}>
        <ScrollView>
        <View style={styles.recommendedView}>
            <View style={{gap: 20}}>
                <ProductAction><View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 80, alignSelf: 'flex-end'}}>
                    <Text style ={{fontWeight: 'bold', fontSize: 18}}
                    >1</Text>
                </View></ProductAction>
                <ProductAction><View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 80, alignSelf: 'flex-end'}}>
                    <Text style ={{fontWeight: 'bold', fontSize: 18}}
                    >1</Text>
                </View></ProductAction>
            </View>
        </View>
        
        </ScrollView>
        </View>
        <View style={{flex: 0.75}}>
            <ScrollView style= {{marginBottom: '25%'}}>
        <View style={[styles.recommendedView,{marginVertical: '10%', marginTop: '5%', marginHorizontal: '5%', paddingBottom: '2%',borderWidth: 2, borderColor: 'rgba(0,0,0,0.05)', borderRadius: 20,justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Items Amount</Text>
            <Text style={[styles.text, {color : 'black'}]}>$7.38</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Shipping</Text>
            <Text style={[styles.text, {color : 'black'}]}>$2.62</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Faster Delivery</Text>
            <Text style={[styles.text, {color : 'black'}]}>$2.00</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 20, paddingBottom: 30 }}>
            <Text style={styles.text}>Total Paid</Text>
            <Text style={[styles.text, {color : 'black'}]}>$12.00</Text>
            </View>
        </View>
        <View style={[styles.recommendedView,{marginVertical: '10%', marginTop: '5%', marginHorizontal: '5%', paddingBottom: '2%',borderWidth: 2, borderColor: 'rgba(0,0,0,0.05)', borderRadius: 20,justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Payment Method</Text>
            <Text style={[styles.text, {color : 'black'}]}>Mastercard 8745</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Order Id</Text>
            <Text style={[styles.text, {color : 'black'}]}>O673DGU</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Date</Text>
            <Text style={[styles.text, {color : 'black'}]}>06/11/2023</Text>
            </View>
        </View>
        </ScrollView>
        </View>
        
        <View style={{flex: 1, width: '100%', height: '16%', paddingHorizontal: '5%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' ,  justifyContent: "space-around",}}>
            
                <View style={[{height: '45%'}]}>
                    <FlexButton background={'#283618'}><FontAwesome name="send" size={24} color="white" /><Text style={{color: 'white', fontSize: 18}}> Share receipt</Text></FlexButton>
                </View>
                <View style={[{height: '45%'}]}>
                    <FlexButton color={'#B22334'}><MaterialCommunityIcons name="cancel" size={24} color="#B22334" /><Text style={{fontSize: 18, color: '#B22334'}}>Cancel Order</Text></FlexButton>
                </View>
            
                
        </View>
    </SafeAreaView>
  );
}
export default RecieptScreen

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20, color: '#aaa' },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%',
  }
})