import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { Fontisto } from '@expo/vector-icons';
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
import { useNavigation } from "@react-navigation/native";
function CheckoutScreen() {
   const mode  = [{mode: 'Faster (+$2)', time : '10-15\nMinutes', fastest: true}, {mode: 'Fast', time : '30-45 \nMinutes', fastest: false}, {mode: 'Schedule', time : 'Pick a \ndelivery time', fastest: false}]
   
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Make Payment')
  }
  function addressHandler (){
    navigation.navigate('Confirm Address')
  }
  return (
    <View>
        <ScrollView style={{marginBottom: '19%' }}>
        <View style={styles.recommendedView}>
            <Text style={styles.text}>Shipping Address</Text>
            <View style={{flex: 1}}>
            <AddressEditable title='My apartment' address='123 Main Street, Apt 4B, Cityville, USA' onPress = {addressHandler}/>
            </View>
        </View>
        <View style={styles.recommendedView}>
            <Text style={styles.text}>Delivery Mode</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                {mode.map(({mode, time, fastest},idx) =>  <View key={idx} style ={{width: '30%'}}><Pressable onPressIn={() => handleSelect(idx)}><DeliveryMode  mode={mode} time={time} special={fastest} active={index === idx}/></Pressable></View>)}
            </View>
        </View>
        <View style={styles.recommendedView}>
            <Text style={styles.text}>Order Items</Text>
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
        <View style={[styles.recommendedView,{marginVertical: '10%', marginTop: '5%', marginHorizontal: '5%', paddingBottom: '2%',borderWidth: 2, borderColor: 'rgba(0,0,0,0.05)', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={styles.text}>Delivery Fee</Text>
            <Text style={styles.text}>+$2.62</Text>
        </View>
        </ScrollView>
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
                <FlexButton background={'#283618'} onPress={pressHandler}><Fontisto name="credit-card" size={24} color="white" /><Text style={{color: 'white'}}>Make Payment</Text></FlexButton>
            </View>
        </View>
    </View>
  );
}
export default CheckoutScreen

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