import { Image, Pressable, Dimensions, ScrollView } from "react-native";
import { StyleSheet,  View } from "react-native";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { Octicons } from '@expo/vector-icons';
import Text from "./Text";
import { Fontisto } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {updateOrder } from "../Data/order";
import { EvilIcons } from '@expo/vector-icons';
import FlexButton from "./Buttons/FlexButton";
import { getAddress, getPosition, searchAddress, getDuration } from "../util/location";


function OrderDescription({address, date, id,order, price, status = 'Ordered', press }) {
    const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Delivery Status', {address: address})
  }
  const encodedAddress = encodeURIComponent('501 Main Street Nashville, TN 37206')

  const [time, setTime] = useState();
  
  const [position , setPosition] = useState(null)
  const [driver, setDriver] = useState(null)
  useEffect(() => {
    //fetch the coordinates and then store its value into the coords Hook.
    if(position && driver){
    getDuration(`${position.latitude},${position.longitude}`, `${driver.latitude},${driver.longitude}`)
      .then(coords => setTime(coords))
      .catch(err => console.log("Something went wrong"));}
  }, [ position,driver]);
  useEffect(() => {
    (async () => {

      let location = await await getPosition(encodedAddress);
      if (location) {
        setDriver({latitude: location.lat,
          longitude: location.lng})
      }
      
        
    })();
  }, []);
  function getTimeLeft(date, duration) {
    const durationInMinutes = parseInt(duration); // Extract the number of minutes from the duration
    const durationInMilliseconds = durationInMinutes * 60 * 1000; // Convert minutes to milliseconds
  
    const currentTime = new Date(); // Get current time
    const pastTime = new Date(date); // The start time (from the provided date)
  
    // Calculate the time difference in milliseconds
    const timeElapsed = currentTime - pastTime; // Time elapsed in milliseconds
  
    // Calculate the remaining time
    const timeLeft = durationInMilliseconds - timeElapsed;
  
    // If time left is less than or equal to 0, the person is running late
    if (timeLeft <= 0) {
      return "Running late";
    } else {
      // Convert remaining time back to minutes
      const minutesLeft = Math.floor(timeLeft / (60 * 1000));
      return `${minutesLeft} minutes away`;
    }
  }
  
  useEffect(() => {
    (async () => {
      
      let locationT = await getPosition(address);
      if (locationT) {
        setPosition({latitude: locationT.lat,
          longitude: locationT.lng })
      }
    })();
  }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const currentDate = new Date();
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
   
        if (date.toDateString() === currentDate.toDateString()) {
            const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return status == 'Delivered' ?  `Delivered today at ${hours}:${minutes}` : `Ordered today at ${hours}:${minutes}`;        } 
        else if (date.getDate() === currentDate.getDate() - 1) {
            return status == 'Delivered' ? 'Delivered yesterday' : 'Ordered yesterday';
        } else {
            return status == 'Delivered' ? `Delivered on ${month} ${day}` : `Ordered on ${month} ${day}`;
        }
    }
    const statuses = ['Ordered', 'Ready for Delivery', 'Out for Delivery', 'Delivered']
    const cost = {}
    let total = order.reduce((total, item)=> total + item.products.length , 0)
    var rater = []
    for (var i = 0; i < 3; i++ ){
        if (i < statuses.indexOf(status)){
            rater.push({'rate':'dot-fill', id:i})
        }
        else{
            rater.push({'rate':'dot', id:i})
        }
    }
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
            total += result[title]
  
            // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
            titleCountMap[title] = 0;
  
            return { ...obj[title][0], ['oldPrice'] : cost[title], quantity };
        });
        const filteredList = newList.filter((obj) => obj.quantity !== 0);
  
        return filteredList;
    }
    let lastStatus = <></>
    if(statuses.indexOf(status) !== 3){lastStatus = <Octicons name={`dot`} size={24} color={ 'rgba(0,0,0,0.5)'} />
   }else{ lastStatus = <Fontisto name="radio-btn-active" size={24} color= "#BC6C25" />} 
    const formattedDate = formatDate(date);
  return (
    <View style={[styles.container]}>
        <View style={styles.recommendedView}>

     <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
        <Text style={{ fontSize: 16}}>{formattedDate}</Text>
        <Text style={{ fontSize: 17}}>{price}</Text>
     </View>
     <View style={{ flexDirection: 'row' }}>
  {rater.map(({ rate, id }, idx) => {
    // Determine if the current status matches or not
    if (statuses.indexOf(status) !== id) {
      return (
        <View key={`${id}-${idx}`} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
          <Octicons 
            name={`${rate}`} 
            size={24} 
            color={rate === 'dot-fill' ? "#BC6C25" : 'rgba(0,0,0,0.5)'} 
          />
          <View 
            style={{
              height: 2,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: rate === 'dot-fill' ? "#BC6C25" : 'rgba(0,0,0,0.5)'
            }}
          />
        </View>
      );
    } else {
      return (
        <View key={`${id}-${idx}-active`} style={{ flexDirection: 'row', width: '27.3%' }}>
          <Fontisto name="radio-btn-active" size={24} color="#BC6C25" />
          <View 
            style={{
              height: 2,
              width: '72%',
              alignSelf: 'center',
              backgroundColor: "#BC6C25"
            }} 
          />
        </View>
      );
    }
  })}
  {lastStatus}
</View>

     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontSize: 9}}>Ordered</Text>
        <Text style={{ fontSize: 9}}>Ready for Delivery</Text>
        <Text style={{ fontSize: 9}}>Out for Delivery</Text>
        <Text style={{ fontSize: 9}}>Delivered</Text>
     </View>
     <View style={{height : 1,width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center'}}></View>
    {status == 'Out for Delivery' && <View style={{height: 45}}><FlexButton onPress={pressHandler} background={'#283618'} ><Text style={{ fontSize: 16, color: 'white',textAlign: 'center'}}>Track Order</Text></FlexButton></View>}
     <Text style={{ fontSize: 13}}>{total} {`${total > 1 ? 'Items': 'Item'}`}</Text>
    
     <ScrollView horizontal>{order.map((item, idx)=><View key={idx} style={{marginRight: 3}} ><Image source={{uri: item.products[0].images[0]}} style={{width: 55, height: 55, borderRadius: 30}}/>{item.products.length > 1 && <View  style={{
                  height: '27%',
                  minWidth: '25%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 2,
                  top: 0,
                  right: 0,
                  borderRadius: 100,
                  borderWidth: 1,
                  fontSize: 14,
                  backgroundColor: 'white'
                }}><Text style={{ fontSize: 10}} >{item.products.length}</Text></View>}
                </View>)
                }</ScrollView>
         <View style={{height : 1,width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center'}}></View>
         <View >{time && status == 'Out for Delivery' && <View style={{flexDirection: "row", alignItems:'flex-end'}}><Text style={{ fontSize: 14}} >{`Driver is `}</Text><Text style={{ fontSize: 19, color: '#4F6B30'}}>{getTimeLeft(date, time)}</Text><Text style={{ fontSize: 14}}></Text></View>}<View style={{height: 45,  alignSelf: 'flex-end'}} ><FlexButton onPress={()=>press(order, id, price)}><Text style={{ fontSize: 13, textAlign: 'center'}}>View order</Text></FlexButton></View></View>
        
     </View>
     
    </View>
  );
}
export default OrderDescription;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 4,
    borderTopWidth : 0,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: "rgba(0,0,0,0.03)",
    borderRightColor:"rgba(0,0,0,0.03)",

    // borderColor: "rgba(0,0,0,0.05)",
    borderBottomColor: 'rgba(0,0,0,0.08)',
    borderRadius: 25,
    // marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
    // borderWidth: 2
  },
  textContainer: {flexDirection: 'row',justifyContent: 'space-between'},
  image: {
    maxWidth: width / 5,
    height: height / 10,
  },
  text: { fontSize: 16,  lineHeight: 25, },
  priceView: {
    position: "absolute",
    top: 15,
    zIndex: 2,
    left: 15,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "#283618",
    padding: 0.5,
    paddingHorizontal: 6,
    borderRadius: 30,
    zIndex: 1,
  },
  priceText: {
    color: "white",
    fontStyle: "italic",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  }, recommendedView: {
    paddingHorizontal: '2.5%', paddingTop: '3%', gap: 15
  },
});
