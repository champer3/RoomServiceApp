import { StyleSheet, Image, Text, View, Pressable, ScrollView, TextInput, Dimensions } from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BottomSheet from '../components/Modals/BottomSheet';
import BareButton from "../components/Buttons/BareButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Info from "../components/Info";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductAction from "../components/Product/ProductAction";
import Pill from "../components/Pills/Pills";
import FlexButton from "../components/Buttons/FlexButton";
import { AntDesign } from '@expo/vector-icons';
import { RotateInDownLeft } from "react-native-reanimated";
import {useSelector, useDispatch} from 'react-redux'
import { addReview } from "../Data/Items";
import {clearCart, completeOrder} from '../Data/cart'
import OrderDescription from "../components/OrderDescription";


const { width, height } = Dimensions.get("window");
function OrderDisplay(){
  const orders = useSelector((state) => state.cartItems.order)
    const [index, setIndex] = useState(0);
    const [rating, setrating] = useState(0);
    const data = useSelector((state) => state.profileData.profile)
    const dispatch = useDispatch();
    const [form , setForm] = useState({title : '',
  reviews: {user: `${data.firstName} ${data.secondName}`, rating : rating, comment : '', days: '0 day ago'}})
    var rate = []
    for (var i = 0; i < 5; i++ ){
        if (i < rating){
            rate.push('star')
        }
        else{
            rate.push('staro')
        }
    }
    function formatDate(dateString) {
      const date = new Date(dateString);
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
      const day = date.getDate();
      const year = date.getFullYear();
      
      return `${month} ${day}, ${year} order`;
  }
  
    const cost = {}
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
    var newList;
    const ref = useRef(null);
    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        // ref?.current?.scrollTo(0);
        ref?.current?.scrollTo(-735);
      }, []);
    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };
    // for (var i =0 ; i < orders.length; i++ ){
    //   if (newList){
    //   newList = [...addQuantityToObjects(orders[i]), ...newList]}
    //   else{
    //     newList = [...addQuantityToObjects(orders[i])] 
    //   }
    // }
    function handleFormChange(value){
      setForm((prev) => {return { ...prev, ['reviews']: {...prev.reviews, ['comment'] : value}}});

    }
    function handleFormSubmit(){
      dispatch(addReview({id: form}))
      updateReviews(form.title)
      ref?.current?.scrollTo(0);
      setrating(0)
      setForm({title : '',
      reviews: {user: `${data.firstName} ${data.secondName}`, rating : rating, comment : '', days: '0 day ago'}})
    }
    function updateReviews(targetTitle) {
      const menuItems = orders.map(submenu => submenu.map(item => ({...item})));
      for (let menu of menuItems) {
        for (let item of menu) {
          if (item.title === targetTitle) {
            item.reviews = true;
          }
        }
      }
      dispatch(completeOrder({id: menuItems}))
    }
    console.log(orders)
    return  <GestureHandlerRootView style={{ flex: 1 }}><View style={{flex: 1}}>
    
    <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, marginHorizontal: '5%', gap: 20, borderBottomColor: 'rgba(0,0,0,0.075)'}]}>
        
        <View style={[{width: 'auto',alignItems: 'center', padding: '3%'}, index == 0 ? styles.active : undefined]}>
            <Pressable onPressIn={() => handleSelect(0)}>
            <Text style ={{fontWeight: 'bold', fontSize: 20, color : index == 0 ? 'black' : 'rgba(0,0,0,0.5)'}}>Active Orders</Text>
            </Pressable>
        </View>
        
        <View style={[{width: 'auto',alignItems: 'center', padding: '3%'}, index == 1 ? styles.active : undefined]}>
            <Pressable onPressIn={() => handleSelect(1)}>
                <Text style ={{fontWeight: 'bold', fontSize: 20, color : index == 1 ? 'black' : 'rgba(0,0,0,0.5)'}}>Completed Orders</Text>
            </Pressable>
        </View>
    </View>
    <ScrollView >
    <View style={{flex: 1}} >
    <View style={styles.recommendedView}>
        <Input icon={<Ionicons name="search-outline" size={24} color="#aaa" />} text={'Search orders'}/>
    </View>
    {index == 0 && orders.length == 0 && <View  style={{gap: 19, marginVertical: 45}}><View><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>Your order history is a bit too boring, why don’t you check out our amazing items!</Text><View style={[styles.recommendedView, {height: 75}]}><FlexButton background={'#283618'} onPress={()=>{}}><Text style={{fontSize: 18, color: 'white'}}>Start Shopping</Text></FlexButton></View></View>}
    {index == 1 &&  <View  style={{gap: 19, marginVertical: 45}}><View><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>Your order history is a bit too boring, why don’t you check out our amazing items!</Text><View style={[styles.recommendedView, {height: 75}]}><FlexButton background={'#283618'} onPress={()=>{}}><Text style={{fontSize: 18, color: 'white'}}>Start Shopping</Text></FlexButton></View></View>}
    {/* {index == 0 && <View style={{marginHorizontal: '6%', paddingVertical: '6%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
        <ProductAction quantity={1}><Pill text={"Delivering"} type="null"/></ProductAction>
        <ProductAction quantity={1}><Pill text={"Delivering"} type="null"/></ProductAction>
        <ProductAction quantity={1}><Pill text={"Delivering"} type="null"/></ProductAction>
    </View>} */}
    <View style={styles.recommendedView}>
    {index == 0 && orders.map(({address, date, id, order, price, status}, idx)=> <View style={{ flex: 1,  gap: 10 }}   key={id}><Text style={{fontWeight:900, fontSize: 12, }} >{formatDate(date)}</Text><OrderDescription status={status} price={price} address={address} order={order} id={id} date={date} /></View>)}
       
    </View>
    </View>
    </ScrollView>
    
   
    <BottomSheet ref={ref}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 10 }} >
            <View style ={{justifyContent: 'space-between', flexDirection: 'row', marginBottom: 25}}><Text style={{fontWeight: 'bold'}}>Leave A Review</Text></View>
            <Text style={{fontWeight:'bold', fontSize: 18, textAlign: 'center'}}>How did it go?</Text>
            <Text style={{ fontSize: 14, textAlign: 'center'}}>Give an honest rating for the just concluded order</Text>
            <View style={{ flexDirection: 'row', gap: 35, alignSelf: 'center', marginVertical: 28 }}>
            {rate.map((star, idx)=><Pressable key={idx} onPress={()=>{setrating(idx+1), setForm((prev) => {return { ...prev, ['reviews']: {...prev.reviews, ['rating'] : idx+1}}})}}><AntDesign name={star} size={30} color="black"/></Pressable>)}
            </View>
            <View
      style={{
        backgroundColor: '#FAFAFACC',
        borderBottomColor: '#000000',
        borderRadius: 12,
        marginBottom: 15
      }}>
      <TextInput
        multiline
        placeholder="Why?"
        cursorColor={'#aaa'}
        numberOfLines={6}
        clearButtonMode="always"
        style={{paddingHorizontal: 10}}
        value = {form.reviews.comment}
        onChangeText = {handleFormChange.bind(this)}
      />
    </View>
    <View style={[{height: '20%', paddingTop: '25%'}]}>
                <FlexButton onPress={handleFormSubmit} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Post Review</Text></FlexButton>
            </View>
          </View>
          
    </BottomSheet>

    </View>
    </GestureHandlerRootView>
}

export default OrderDisplay
const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%', gap: 20
  },
  active : {borderBottomWidth:2, 
    borderBottomColor: 'rgba(0,0,0,0.5)'
}, 
image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },
})