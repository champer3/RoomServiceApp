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
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const { width, height } = Dimensions.get("window");
function RecieptScreen() {
    const dispatch = useDispatch();
    const route = useRoute()
    
    
    const [cartItems, setCartItems] = useState([...route.params.items])
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
        dispatch(clearCart({id : cartItems}))
    }
    handleComplete()

    
    // Example usage:
    const todayFormatted = getFormattedDate();
    const newList = addQuantityToObjects(cartItems);
    let cnst = newList.map(({ title, quantity, oldPrice }) => `
    <tr>
      <td>${title}</td>
      <td>${quantity}</td>
      <td>$${oldPrice}</td>
      <td>$${oldPrice * quantity}</td>
    </tr>
  `)
    let content =  ''
    if (show){
        content = `<tr>
        <td colspan="3" class="sum-up">Faster Delivery</td>
        <td class="price">$2.00</td>
    </tr>`
    }
    const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'PT Sans', sans-serif;
        }

        @page {
            margin-top: 1cm;
            margin-left: 1cm;
            margin-right: 1cm;
        }

        table {
            width: 100%;
        }

        tr {
            width: 100%;

        }

        h1 {
            text-align: center;
            vertical-align: middle;
        }

        #logo {
            width: 60%;
            text-align: center;
            -webkit-align-content: center;
            align-content: center;
            padding: 5px;
            margin: 2px;
            display: block;
            margin: 0 auto;
        }

        header {
            width: 100%;
            text-align: center;
            -webkit-align-content: center;
            align-content: center;
            vertical-align: middle;
        }

        .items thead {
            text-align: center;
        }

        .center-align {
            text-align: center;
        }

        .bill-details td {
            font-size: 25px;
        }

        .receipt {
            font-size: medium;
        }

        .items .heading {
            font-size: 16px;
            text-transform: uppercase;
            border-top:1px solid black;
            margin-bottom: 4px;
            border-bottom: 1px solid black;
            vertical-align: middle;
        }

        .items thead tr th:first-child,
        .items tbody tr td:first-child {
            width: 47%;
            min-width: 47%;
            max-width: 47%;
            word-break: break-all;
            text-align: left;
        }

        .items td {
            font-size: 15px;
            text-align: right;
            vertical-align: bottom;
        }

        .price::before {
            font-family: Arial;
            text-align: right;
        }

        .sum-up {
            text-align: right !important;
        }
        .total {
            font-size: 17px;
            border-top:1px dashed black !important;
            border-bottom:1px dashed black !important;
        }
        .total.text, .total.price {
            text-align: right;
        }
        .line {
            border-top:1px solid black !important;
        }
        .heading.rate {
            width: 20%;
        }
        .heading.amount {
            width: 25%;
        }
        .heading.qty {
            width: 5%
        }
        p {
            padding: 1px;
            margin: 0;
        }
        section, footer {
            font-size: 16px;
        }
    </style>
</head>

<body>
    <header>
        <div id="logo" class="media" data-src="logo.png" src="./logo.png"></div>

    </header>
    <p>Order ID: O673DGU</p>
    <table class="bill-details">
        <tbody>
            <tr>
                <th class="center-align" colspan="2"><span class="receipt">Order Receipt</span></th>
            </tr>
        </tbody>
    </table>
    
    <table class="items">
        <thead>
            <tr>
                <th class="heading name">Item</th>
                <th class="heading qty">Qty</th>
                <th class="heading rate">Rate</th>
                <th class="heading amount">Amount</th>
            </tr>
        </thead>
       
        <tbody>
        ${cnst}
            <tr>
                <td colspan="3" class="sum-up line">Subtotal</td>
                <td class="line price">$${getTotalSum().toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3" class="sum-up">Shipping</td>
                <td class="price">$2.62</td>
            </tr>
            ${content}
            <tr>
                <th colspan="3" class="total text">Total</th>
                <th class="total price">$${route.params.total}</th>
            </tr>
        </tbody>
    </table>
    <section>
        <p style="text-align:center">
            Thank you for your visit!
        </p>
    </section>
    <footer style="text-align:center">
        <p>RoomService</p>
    </footer>
</body>

</html>
`;
    
const [selectedPrinter, setSelectedPrinter] = useState();

const print = async () => {
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  await Print.printAsync({
    html,
    printerUrl: selectedPrinter?.url, // iOS only
  });
};

const printToFile = async () => {
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  const { uri } = await Print.printToFileAsync({ html });
  console.log('File has been saved to:', uri);
  await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};

const selectPrinter = async () => {
  const printer = await Print.selectPrinterAsync(); // iOS only
  setSelectedPrinter(printer);
};
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
                    <FlexButton onPress={printToFile} background={'#283618'}><FontAwesome name="send" size={24} color="white" /><Text style={{color: 'white', fontSize: 18}}> Share receipt</Text></FlexButton>
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