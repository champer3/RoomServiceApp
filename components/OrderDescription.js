import { Image, Pressable, Dimensions, ScrollView } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { Octicons } from '@expo/vector-icons';

import { Fontisto } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {updateOrder } from "../Data/cart";
import { EvilIcons } from '@expo/vector-icons';
import FlexButton from "./Buttons/FlexButton";
import { getAddress, getPosition, searchAddress, getDuration } from "../util/location";


function OrderDescription({address, date, id,order, price, status = 'Delivering', press }) {
    const navigation = useNavigation()
  function pressHandler (){
    navigation.navigate('Delivery Status', {address: address})
  }
  const [time, setTime] = useState();
  const [position , setPosition] = useState(null)
  const [driver, setDriver] = useState(null)
  useEffect(() => {
    //fetch the coordinates and then store its value into the coords Hook.
    if(position && driver){
    getDuration(`${position.latitude},${position.longitude}`, `${driver.latitude},${driver.longitude}`)
      .then(coords => setTime(coords))
      .catch(err => console.log("Something went wrong"));}
  }, [time, position,driver]);
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setDriver({latitude: location.coords.latitude,
          longitude: location.coords.longitude ,})
      }
      
        
    })();
  }, []);
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
    const statuses = ['Placed', 'Preparing', 'Delivering', 'Delivered']
    const cost = {}
    let total = 0
    var rater = []
    for (var i = 0; i < 3; i++ ){
        if (i < statuses.indexOf(status)){
            rater.push({'rate':'dot-fill', id:i})
        }
        else{
            rater.push({'rate':'dot', id:i})
        }
    }
    console.log(rater)
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
    const newList = addQuantityToObjects(order)
    let lastStatus = <></>
    if(statuses.indexOf(status) !== 3){lastStatus = <Octicons name={`dot`} size={24} color={ 'rgba(0,0,0,0.5)'} />
   }else{ lastStatus = <Fontisto name="radio-btn-active" size={24} color= "#BC6C25" />} 
    const formattedDate = formatDate(date);
  return (
    <View style={[styles.container]}>
        <View style={styles.recommendedView}>

     <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
        <Text style={{fontWeight: 900, fontSize: 16}}>{formattedDate}</Text>
        <Text style={{fontWeight: 'bold', fontSize: 17}}>{price}</Text>
     </View>
     <View style={{flexDirection: 'row'}}>
        {rater.map(({rate,id},idx)=>{if(statuses.indexOf(status) !== id){console.log(id);return <View style={{flex:1, alignItems: 'center',flexDirection:'row'}} key={id}><Octicons name={`${rate}`} size={24} color={ rate == 'dot-fill' ? "#BC6C25": 'rgba(0,0,0,0.5)'} />
     <View style={{height : 2, width: '90%', alignSelf: 'center', backgroundColor: rate == 'dot-fill' ? "#BC6C25": 'rgba(0,0,0,0.5)'}}></View>
     </View>}else{return <View  key={id} style={{flexDirection: 'row', width: '27.3%'}}><Fontisto name="radio-btn-active" size={24} color= "#BC6C25" /><View key={6} style={{height : 2, width: '72%', alignSelf: 'center', backgroundColor: "#BC6C25"}}></View></View>}})}
     {lastStatus}
     </View>
     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontWeight: 300, fontSize: 12}}>Placed</Text>
        <Text style={{fontWeight: 300, fontSize: 12}}>Preparing</Text>
        <Text style={{fontWeight: 300, fontSize: 12}}>Delivering</Text>
        <Text style={{fontWeight: 300, fontSize: 12}}>Delivered</Text>
     </View>
     <View style={{height : 1,width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center'}}></View>
    {status == 'Delivering' && <View style={{height: 45}}><FlexButton onPress={pressHandler} background={'#283618'} ><Text style={{fontWeight:'bold', fontSize: 16, color: 'white',textAlign: 'center'}}>Track Order</Text></FlexButton></View>}
     <Text style={{fontWeight: 900, fontSize: 13}}>{total} {`${total > 1 ? 'Items': 'Item'}`}</Text>
    
     <ScrollView horizontal>{newList.map(({title, oldPrice,image, quantity}, idx)=><View key={title} style={{marginRight: 3}} ><Image style={styles.image}  source={image}/>{quantity > 1 && <View  style={{
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
                }}><Text style={{fontWeight: 900, fontSize: 10}} >{quantity}</Text></View>}</View>)}</ScrollView>
         <View style={{height : 1,width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center'}}></View>
         <View >{time && status == 'Delivering' && <View style={{flexDirection: "row", alignItems:'flex-end'}}><Text style={{fontWeight: 900, fontSize: 14}} >{`Driver is `}</Text><Text style={{fontWeight: 900, fontSize: 19, color: '#4F6B30'}}>{time}</Text><Text style={{fontWeight: 900, fontSize: 14}}> away</Text></View>}<View style={{height: 45,  alignSelf: 'flex-end'}} ><FlexButton onPress={()=>press(order, id, price)}><Text style={{fontWeight: 900, fontSize: 13, textAlign: 'center'}}>View order</Text></FlexButton></View></View>
        
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
  text: { fontSize: 16, fontWeight: 900, lineHeight: 25, },
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
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  }, recommendedView: {
    paddingHorizontal: '2.5%', paddingTop: '3%', gap: 15
  },
});
