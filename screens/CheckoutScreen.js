import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { Fontisto } from '@expo/vector-icons';
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {useStripe} from '@stripe/stripe-react-native'
import axios from "axios";
import { clearCart } from '../Data/cart'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjUzYjk1OTE5MGY4ZjEyOWU4YjUzYiIsImlhdCI6MTcwNjM3NjA4NywiZXhwIjoxNzA3MjQwMDg3fQ.gWzYLe7TbEQNKphx2Pccyu7bvLy-AMdCHUqTOtSz3r0"

function CheckoutScreen() {
   const mode  = [{mode: 'Faster (+$2)', time : '10-15\nMinutes', fastest: true}, {mode: 'Fast', time : '30-45 \nMinutes', fastest: false}, {mode: 'Schedule', time : 'Pick a \ndelivery time', fastest: false}]
   const cartItems = useSelector((state) => state.cartItems.ids)
   const dispatch = useDispatch();

  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Make Payment', {total: getTotalSum().toFixed(2)})
    // navigation.navigate('Make Payment')
    console.log("Make payment button pressed")
  }
  const {initPaymentSheet, presentPaymentSheet} = useStripe()
  const checkOut = async () =>{
    const response = await axios.post("http://10.0.0.173:3000/api/v1/payments/checkout-session", null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',  // adjust the content type based on your API requirements
      },
    });
    console.log("got here")
    console.log(response.data)
    const initPayment = await initPaymentSheet({
      merchantDisplayName: 'RoomService',
      paymentIntentClientSecret: response.data.clientSecret,
      customerEphemeralKeySecret: response.data.ephemeralKey,
      customerId: response.data.customer,
      // defaultBillingDetails: {
      //   name: 'Jane Doe',
      // }
    })

    const { error } = await presentPaymentSheet()
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      dispatch(clearCart())
      Alert.alert('Success', 'Your order is confirmed!');
      navigation.navigate('Home')
    }
    // console.log("async nigga pressed")
  }

  function addressHandler (){
    navigation.navigate('Confirm Address')
  }
  function getTotalSum() {
    return cartItems.reduce((sum, obj) => sum + obj.oldPrice, 0) +2.62 +(index == 0 ? 2 : 0) ;
  }
  function addQuantityToObjects(inputList) {
    const titleCountMap = {};

    // Loop through the inputList to count occurrences of each title
    inputList.forEach((obj) => {
        const title = obj.title;

        // Increment the count for the title or initialize to 1 if it doesn't exist
        titleCountMap[title] = (titleCountMap[title] || 0) + 1;
    });

    // Loop through the inputList again to create a new list with quantity key
    const newList = inputList.map((obj) => {
        const title = obj.title;
        const quantity = titleCountMap[title];

        // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
        titleCountMap[title] = 0;

        return { ...obj, quantity };
    });
    const filteredList = newList.filter((obj) => obj.quantity !== 0);

    return filteredList;
}

// Example usage:

const newList = addQuantityToObjects(cartItems);
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
                {newList.map(({title, image, quantity, oldPrice}, idx)=><ProductAction key={idx} price={oldPrice*quantity} title={title} image={image}><View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 80, alignSelf: 'flex-end'}}>
                    <Text style ={{fontWeight: 'bold', fontSize: 18}}
                    >{quantity}</Text>
                </View></ProductAction>)}

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
                    > {`$${getTotalSum().toFixed(2)  }`}
                    </Text>
            </View>
            <View style ={{width: '40%', height: '130%'}}>
                <FlexButton background={'#283618'} onPress={checkOut}><Fontisto name="credit-card" size={24} color="white" /><Text style={{color: 'white'}}>Make Payment</Text></FlexButton>
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