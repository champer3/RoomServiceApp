import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { Fontisto } from '@expo/vector-icons';
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
import CreditCard from "../components/CreditCard";
import Info from "../components/Info";
function PaymentScreen() {
   const mode  = [{mode: 'Faster (+$2)', time : '10-15\nMinutes', fastest: true}, {mode: 'Fast', time : '30-45 \nMinutes', fastest: false}, {mode: 'Schedule', time : 'Pick a \ndelivery time', fastest: false}]
   
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <SafeAreaView style = {{flex: 1}}>
        <View>
        <View style={{paddingLeft: '5%', paddingVertical: '6%', flexDirection: 'row', alignItems: 'center', gap: 20}}>
        <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Ionicons name="md-arrow-back-outline" size={40} color="black" />
        </Pressable>
        <Text style ={{fontWeight: 'bold', fontSize: 20}}>Make Payment</Text>
        </View>
        <View style={styles.recommendedView}>
            <Text style={styles.text}>Payment Method</Text>
            <CreditCard card={'Mastercard'} number={5382}/>
        </View>
        <View style={styles.recommendedView}>
            <Info text={"Pay securely using your saved card details or add a different card to finish purchase."}/>
            
        </View>
        </View>
        <View style={{flex: 1, width: "100%", paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
            <View style={{height: '150%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Text
                style={{
                    color: "#aaa",
                    fontWeight: "bold",
                    fontSize: 20,
                }}
                > Total Payment</Text>
                <Text
                    style={{
                        color: "black",
                        fontWeight: "600",
                        fontSize: 20,
                        
                    }}
                    > $12.00
                    </Text>
            </View>
            <View style ={{width: '40%', height: '130%'}}>
                <FlexButton background={'#283618'}><Fontisto name="credit-card" size={24} color="white" /><Text style={{color: 'white'}}>Make Payment</Text></FlexButton>
            </View>
        </View>
    </SafeAreaView>
  );
}
export default PaymentScreen

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%',
  }
})