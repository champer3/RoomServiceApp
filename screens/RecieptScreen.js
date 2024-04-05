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
import {Mailer} from 'react-native-mail'

const { width, height } = Dimensions.get("window");
function RecieptScreen() {
    const dispatch = useDispatch();
    const route = useRoute()
    
    
    const [cartItems, setCartItems] = useState([...route.params.items])
    function getTotalSum() {
        var totalPrice = 0;
    cartItems.forEach(obj => {
      const title = Object.keys(obj)[0];
        const titleArray = Object.values(obj)[0];
        
        titleArray.forEach(item => {
            totalPrice += item.oldPrice;
        });
        cost[title] = totalPrice
    });
    return totalPrice
      } 
      const cost = {}
      function getItems(inputList){
        const titleCountMap = [];

        const result = {};
      inputList.forEach(obj => {
          const title = obj[Object.keys(obj)[0]];
         titleCountMap.push(...title)

      });
        // Loop through the inputList to count occurrences of each title
    //     inputList.forEach((obj) => {
    //         const title = obj.title;
  
    //         // Increment the count for the title or initialize to 1 if it doesn't exist
    //         titleCountMap[title] = (titleCountMap[title] || 0) + 1;
    //     });
        
        
    //   inputList.forEach(obj => {
    //     var totalPrice = 0;
    //     const title = Object.keys(obj)[0];
    //       const titleArray = Object.values(obj)[0];
          
    //       titleArray.forEach(item => {
    //           totalPrice += item.oldPrice;
    //       });
    //       cost[title] = totalPrice
    //   });
    //     // Loop through the inputList again to create a new list with quantity key
    //     const newList = inputList.map((obj) => {
    //         const title = Object.keys(obj)[0];
    //         const quantity = result[title];
  
    //         // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
    //         titleCountMap[title] = 0;
  
    //         return { ...obj[title][0], ['oldPrice'] : cost[title], quantity };
    //     });
    //     const filteredList = newList.filter((obj) => obj.quantity !== 0);
  
        return titleCountMap;
      }
      const order = getItems(cartItems)
      function addQuantityToObjects(inputList) {
        const titleCountMap = {};

        const result = {};
      inputList.forEach(obj => {
          const title = Object.keys(obj)[0];
          const arrayLength = obj[title].length;
          result[title] = arrayLength;
      });
        // Loop through the inputList to count occurrences of each title
        inputList.forEach((obj) => {
            const title = obj.title;
  
            // Increment the count for the title or initialize to 1 if it doesn't exist
            titleCountMap[title] = (titleCountMap[title] || 0) + 1;
        });
        
        
      inputList.forEach(obj => {
        var totalPrice = 0;
        const title = Object.keys(obj)[0];
          const titleArray = Object.values(obj)[0];
          
          titleArray.forEach(item => {
              totalPrice += item.oldPrice;
          });
          cost[title] = totalPrice
      });
        // Loop through the inputList again to create a new list with quantity key
        const newList = inputList.map((obj) => {
            const title = Object.keys(obj)[0];
            const quantity = result[title];
  
            // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
            titleCountMap[title] = 0;
  
            return { ...obj[title][0], ['oldPrice'] : cost[title], quantity };
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
    console.log(order)
    let cnst = order.map(({title,image, Sides, Flavour, extras, Picked, oldPrice}) => `
    <tr>
    <td>
            <div style="display: flex; align-items: start; flex-direction: column;">
            <img src=${image}>
                <h2 style="font-size: 25px; font-weight: bolder; font-family: Georgia, 'Times New Roman', Times, serif; font-style: oblique;">${title}</h2>
                ${Picked ? `<p>${Picked}</p>` : ''}
            </div>
        </td>
        <td style="padding-top: 20px;">
            ${Sides ? `
                <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 10px; padding-bottom: 20px;">
                    <p style="font-size: large; font-style: oblique; font-weight: 900; font-family: Georgia, 'Times New Roman', Times, serif; text-align: center; text-transform: uppercase;">Sides</p>
                    ${Sides.map(side => `<p style="font-size: large; font-weight: 200; text-align: center; font-style: oblique;">${side}</p>`).join('')}
                </div>
            ` : ''}
            ${Flavour ? `
                <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 10px; padding-bottom: 20px;">
                    <p style="font-size: large; font-style: oblique; font-weight: 900; font-family: Georgia, 'Times New Roman', Times, serif; text-align: center; text-transform: uppercase;">Flavours</p>
                    ${Flavour.map(flavour => `<p style="font-size: large; font-weight: 200; text-align: center; font-style: oblique;">${extras[flavour]}</p>`).join('')}
                </div>
            ` : ''}
        </td>
                <td style="display: flex; align-items: center; justify-content: center;padding-top: 20px;"><p style="font-size: large; font-style: oblique;font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;">$${oldPrice}</p></div></td>
              </tr>
                <td></td>
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
            display:flex;
            height: 100vh;
            width: 100vw;
            flex-direction: column;
            gap: 20px
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
            text-align: left;
        }

        .bill-details td {
            font-size: 25px;
        }


        .items .heading {
            font-size: 23px;
            /* text-transform: uppercase; */
            font-weight: 900;
            font-style: oblique;
            margin-bottom: 4px;
            border-bottom: 1px solid black;
            vertical-align: middle;
        }

        /* .items thead tr th:first-child,
        .items tbody tr td:first-child {
            width: 47%;
            min-width: 47%;
            max-width: 47%;
            word-break: break-all;
            text-align: left;
        } */

        .items td {
            font-size: 15px;
            /* text-align: right; */
            vertical-align: bottom;
        }

        .price {
            font-style: oblique;
            font-size: 26px; font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;
            text-align: right;
        }

        .sum-up {
            text-align: right !important;
            font-style: oblique;
            font-size: large; font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;
        }
        .total {
            font-size: 22px;
            font-style: oblique;
            font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;
            border-top:1px ridge black !important;
        }
        .total.text, .total.price {
            text-align: right;
        }
        .line {
            border-top: 1px solid black !important;
        }
        .heading.rate {
            width: 25%;
            text-align: center;
        }
        .heading.amount {
            width: 35%;
            text-align: center;
        }
        .heading.qty {
            width: 25%;
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
    <p style="font-size: large;margin-left: 5px; font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif; font-style: oblique;"> Order ID: ${route.params.id}</p>
    <table class="bill-details">
        <tbody>
            <tr>
                <th class="center-align" colspan="2"><span style="font-size: xx-large;font-style: oblique; font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;" class="receipt">Order Receipt</span></th>
            </tr>
        </tbody>
    </table>
    
    <table class="items" style="border: 2px  solid black; outline: 2px ridge  wheat; padding: 0 10px 0 10px;margin-right: 5px ;border-radius: 20px;">
        <thead>
            <tr>
                <th class="heading qty">Item</th>
                <th class="heading rate">Extras</th>
                <th class="heading name" style="text-align: 'center'"><p style="text-align: center;">Price</p></th>
                <th class="heading amount">Instruction</th>
                
            </tr>
        </thead>
       
        <tbody>
${cnst}
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
    <section >
        <p style="text-align:center ; font-style: oblique;font-size: large; font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;">
            Thank you for your visit!
        </p>
    </section>
    <footer style="font-style: oblique; font-size: 31px; font-weight: 900; font-family:Georgia, 'Times New Roman', Times, serif;text-align:center">
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
            {newList.map(({title, image, quantity, oldPrice}, idx)=><ProductAction key={idx} price={oldPrice} title={title} image={image}><View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 80, alignSelf: 'flex-end'}}>
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
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Order Id</Text>
            <Text style={[styles.text, {color : 'black'}]}>{route.params.id}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <Text style={styles.text}>Date</Text>
            <Text style={[styles.text, {color : 'black'}]}>{todayFormatted}</Text>
            </View>
        </View>
        </ScrollView>
        </View>
        
        <View style={{flex: 1, width: '100%', height: '10%', paddingHorizontal: '5%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' ,  justifyContent: "space-around",}}>
            
                <View style={[{height: '85%'}]}>
                    <FlexButton onPress={printToFile} background={'#283618'}><FontAwesome name="send" size={24} color="white" /><Text style={{color: 'white', fontSize: 18}}> Share receipt</Text></FlexButton>
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