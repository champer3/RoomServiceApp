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
import { useNavigation } from "@react-navigation/native";
function PaymentScreen() {
  
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Order Receipt')
  }
  function cardHandler (){
    navigation.navigate('Manage Payment')
  }
  return (
    <View style = {{flex: 1}}>
        <View>
        <View style={styles.recommendedView}>
            <Text style={styles.text}>Payment Method</Text>
            <CreditCard onPress={cardHandler} card={'Mastercard'} number={5382}/>
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
                <FlexButton onPress={pressHandler} background={'#283618'}><Fontisto name="credit-card" size={24} color="white" /><Text style={{color: 'white'}}>Make Payment</Text></FlexButton>
            </View>
        </View>
    </View>
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