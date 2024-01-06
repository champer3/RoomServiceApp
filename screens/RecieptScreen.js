import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
import {useSelector, useDispatch} from 'react-redux'
import {clearCart, completeOrder} from '../Data/cart'
import { useNavigation , useRoute} from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
function RecieptScreen() {
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState([...useSelector((state) => state.cartItems.ids)])
    
    const route = useRoute()
    function getTotalSum() {
        return cartItems.reduce((sum, obj) => sum + obj.oldPrice, 0);
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
    function getFormattedDate() {
        const today = new Date();
    
        // Extract year, month, and day
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
    
        // Format the date as mm/dd/yyyy
        const formattedDate = `${month}/${day}/${year}`;
    
        return formattedDate;
    }
    let show = false
    if (route.params.total - getTotalSum() > 3){
        show = true

    }
    function handleClearCart(){
        dispatch(clearCart({id : cartItems}))
        setCartItems([])
    }
    function handleComplete(){
        dispatch(completeOrder({id: cartItems}))
        dispatch(clearCart({id : cartItems}))
    }
    handleComplete()

    
    // Example usage:
    const todayFormatted = getFormattedDate();
    const newList = addQuantityToObjects(cartItems);
  return (
    <View style ={{flex: 1}}>
        {cartItems.length == 0 && <View  style={[styles.recommendedView,{gap: 50, marginVertical: 45}]}><View><Image style={styles.image} source={require('../assets/cartEmpty.png')}/></View><Text style={{textAlign: 'center'}}>Your cart is currently empty, Check out people’s favorite items!</Text></View>}
        {cartItems.length > 0 && <><View style={{flex: 0.5}}>
        <ScrollView>
        <View style={styles.recommendedView}>
            <View style={{gap: 20}}>
            {newList.map(({title, image, quantity, oldPrice}, idx)=><ProductAction key={idx} price={oldPrice*quantity} title={title} image={image}><View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 80, alignSelf: 'flex-end'}}>
                    <Text style ={{fontWeight: 'bold', fontSize: 18}}
                    >{quantity}</Text>
                </View></ProductAction>)}
            </View>
        </View>
        
        </ScrollView>
        </View>
        <View style={{flex: 0.75}}>
            <ScrollView style= {{marginBottom: '25%'}}>
        <View style={[styles.recommendedView,{marginVertical: '10%', marginTop: '5%', marginHorizontal: '5%', paddingBottom: '2%',borderWidth: 2, borderColor: 'rgba(0,0,0,0.05)', borderRadius: 20,justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Items Amount</Text>
            <Text style={[styles.text, {color : 'black'}]}>{`$${getTotalSum().toFixed(2)}`}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Shipping</Text>
            <Text style={[styles.text, {color : 'black'}]}>$2.62</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            {show && <><Text style={styles.text}>Faster Delivery</Text>
            <Text style={[styles.text, {color : 'black'}]}>$2.00</Text></>}
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 20, paddingBottom: 30 }}>
            <Text style={styles.text}>Total Paid</Text>
            <Text style={[styles.text, {color : 'black'}]}>{route.params.total}</Text>
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
            <Text style={[styles.text, {color : 'black'}]}>{todayFormatted}</Text>
            </View>
        </View>
        </ScrollView>
        </View>
        
        <View style={{flex: 1, width: '100%', height: '16%', paddingHorizontal: '5%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' ,  justifyContent: "space-around",}}>
            
                <View style={[{height: '45%'}]}>
                    <FlexButton background={'#283618'}><FontAwesome name="send" size={24} color="white" /><Text style={{color: 'white', fontSize: 18}}> Share receipt</Text></FlexButton>
                </View>
                <View style={[{height: '45%'}]}>
                    <FlexButton onPress={handleClearCart} color={'#B22334'}><MaterialCommunityIcons name="cancel" size={24} color="#B22334" /><Text style={{fontSize: 18, color: '#B22334'}}>Cancel Order</Text></FlexButton>
                </View>
            
                
        </View></>}
    </View>
  );
}
export default RecieptScreen

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      
      image: {
        height: height / 3,
        alignSelf: "center",
        resizeMode: 'contain'
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20, color: '#aaa' },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%',
  }
})