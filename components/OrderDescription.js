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


function OrderDescription({address, date, id,order, price, status = 'Ordered', press, onPickedUp, orderType = 'Delivery' }) {
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

    const normalizedStatus = (status || '').toLowerCase();
    const isPickupOrder = (orderType || '').toLowerCase() === 'pickup';
    const isReadyForPickup =
      normalizedStatus === 'ready for pickup' ||
      normalizedStatus === 'ready for pick up' ||
      normalizedStatus === 'ready';
    const isCompleted =
      normalizedStatus === 'delivered' ||
      normalizedStatus === 'completed' ||
      status === 'Delivered' ||
      status === 'Completed' ||
      (isPickupOrder && normalizedStatus === 'picked_up');

    function formatDate(dateString) {
        const date = new Date(dateString);
        const currentDate = new Date();
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
   
        if (date.toDateString() === currentDate.toDateString()) {
            const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return isCompleted ?  `Delivered today at ${hours}:${minutes}` : `Ordered today at ${hours}:${minutes}`;        } 
        else if (date.getDate() === currentDate.getDate() - 1) {
            return isCompleted ? 'Delivered yesterday' : 'Ordered yesterday';
        } else {
            return isCompleted ? `Delivered on ${month} ${day}` : `Ordered on ${month} ${day}`;
        }
    }
    const statuses = isPickupOrder
      ? ['Ordered', 'Ready for Pickup', 'Delivered']
      : ['Ordered', 'Ready for Delivery', 'Out for Delivery', 'Delivered'];

    const mapStatusToTimeline = (raw) => {
      const s = String(raw || '').toLowerCase();
      if (isPickupOrder) {
        if (s === 'placed' || s === 'ordered' || s === 'preparing') return 'Ordered';
        if (s === 'ready' || s === 'ready for pickup' || s === 'ready for delivery')
          return 'Ready for Pickup';
        if (s === 'picked_up' || s === 'delivered' || s === 'completed') return 'Delivered';
        return 'Ordered';
      }
      if (s === 'placed' || s === 'ordered' || s === 'preparing') return 'Ordered';
      if (s === 'ready' || s === 'ready for delivery' || s === 'ready for pickup')
        return 'Ready for Delivery';
      if (s === 'assigned' || s === 'picked_up' || s === 'out for delivery')
        return 'Out for Delivery';
      if (s === 'delivered' || s === 'completed') return 'Delivered';
      return typeof raw === 'string' && raw ? raw : 'Ordered';
    };

    const timelineStatus = mapStatusToTimeline(status);
    const cost = {}
    let total = order.reduce((total, item)=> total + item.products.length , 0)
    const currentStatusIndex = Math.max(0, statuses.indexOf(timelineStatus));
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
    const formattedDate = formatDate(date);
  return (
    <View style={[styles.container]}>
        <View style={styles.recommendedView}>

     <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
        <Text style={{ fontSize: 16}}>{formattedDate}</Text>
        <Text style={{ fontSize: 17}}>{price}</Text>
     </View>
     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  {statuses.map((step, idx) => {
    const isLast = idx === statuses.length - 1;
    const isDone = idx < currentStatusIndex;
    const isCurrent = idx === currentStatusIndex;
    return (
      <React.Fragment key={`${step}-${idx}`}>
        {isCurrent ? (
          <Fontisto name="radio-btn-active" size={24} color="#BC6C25" />
        ) : (
          <Octicons
            name={isDone ? 'dot-fill' : 'dot'}
            size={24}
            color={isDone ? '#BC6C25' : 'rgba(0,0,0,0.5)'}
          />
        )}
        {!isLast && (
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: idx < currentStatusIndex ? '#BC6C25' : 'rgba(0,0,0,0.5)'
            }}
          />
        )}
      </React.Fragment>
    );
  })}
</View>

     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {statuses.map((step, idx) => (
          <Text key={`${step}-label-${idx}`} style={{ fontSize: 9}}>{step}</Text>
        ))}
     </View>
     <View style={{height : 1,width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center'}}></View>
    {isReadyForPickup && <Text style={{ fontSize: 15, color: '#283618', fontWeight: '700' }}>Ready for Pickup</Text>}
    {(normalizedStatus === 'assigned' || normalizedStatus === 'picked_up' || status == 'Out for Delivery') && <View style={{height: 45}}><FlexButton onPress={pressHandler} background={'#283618'} ><Text style={{ fontSize: 16, color: 'white',textAlign: 'center'}}>Track Order</Text></FlexButton></View>}
    {isReadyForPickup && <View style={{height: 45}}><FlexButton onPress={() => onPickedUp?.(id)} background={'#283618'} ><Text style={{ fontSize: 16, color: 'white',textAlign: 'center'}}>Picked Up</Text></FlexButton></View>}
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
         <View >{time && (normalizedStatus === 'assigned' || normalizedStatus === 'picked_up' || status == 'Out for Delivery') && <View style={{flexDirection: "row", alignItems:'flex-end'}}><Text style={{ fontSize: 14}} >{`Driver is `}</Text><Text style={{ fontSize: 19, color: '#4F6B30'}}>{getTimeLeft(date, time)}</Text><Text style={{ fontSize: 14}}></Text></View>}<View style={{height: 45,  alignSelf: 'flex-end'}} ><FlexButton onPress={()=>press(order, id, price)}><Text style={{ fontSize: 13, textAlign: 'center'}}>View order</Text></FlexButton></View></View>
        
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
