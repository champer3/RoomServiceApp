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
import { useNavigation , useRoute} from "@react-navigation/native";
import {clearCart, completeOrder} from '../Data/cart'
import {useSelector, useDispatch} from 'react-redux'
import { updateProfile } from "../Data/profile";
import OrderSuccess from "../components/Modals/OrderSuccess";

function PaymentScreen() {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile)
  const orders = useSelector((state) => state.cartItems.order)
  const cards = [...data.payments]
  const [cartItems, setCartItems] = useState([...useSelector((state) => state.cartItems.ids)])
  const temp = [...cartItems]
  const navigation = useNavigation()
  const route = useRoute()
  function pressHandler (){
    const row = [...cartItems]
    for (var i =0 ; i < cartItems.length; i++ ){
      row[i] = {...cartItems[i], ['reviews']: false} 
    }
    console.log(row)
    dispatch(completeOrder({id: [...orders, row]}))
    dispatch(clearCart({id : cartItems}))
    setVisible(true)
  }
  function cardHandler (){
    navigation.navigate('Manage Payment')
  }
  function onPress(){
    navigation.navigate('Payment')
  }
  function press(){
    navigation.navigate('Order Receipt', {total : route.params.total, items: temp})
}
  function move(){
    navigation.navigate('Order History')
}
  return (
    <View style = {{flex: 1}}>
        <View>
        <View style={styles.recommendedView}>
            <Text style={styles.text}>Payment Method</Text>
            {cards.length > 0 && <CreditCard onPress={cardHandler} card={cards[0].card} number={cards[0].number.slice(0, 4)} image={cards[0].image}/>}
            {!cards.length && <View style={[{height: 55, paddingHorizontal: 40}]}>
                <FlexButton onPress={onPress}><Text style={{fontSize: 18}}>Add Payment Method</Text></FlexButton>
            </View>}
        </View>
        <View style={styles.recommendedView}>
            <Info text={"Pay securely using your saved card details or add a different card to finish purchase."}/>

        </View>
        </View>
        <View style={{flex: 1, width: "100%", paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 1, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
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
                    > {`$${route.params.total}`}
                    </Text>
            </View>
            <View style ={{width: '45%', height: '130%'}}>
                <FlexButton onPress={pressHandler} background={'#283618'}><Fontisto name="credit-card" size={24} color="white" /><Text style={{color: 'white'}}>Make Payment</Text></FlexButton>
            </View>
        </View>
        {visible && <View style ={{flex: 1,padding: 20, alignItems: 'center', justifyContent: 'center', justifyContent: 'center', zIndex: 3, position: "absolute", height: '100%', backgroundColor: 'rgba(0,0,0,0.9)'}}>
          <OrderSuccess onPress={press} onMove={move}/>
        </View>}
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