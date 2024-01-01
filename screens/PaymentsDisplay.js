import { Image, StyleSheet, Text, View, Pressable, Dimensions, ScrollView, Keyboard } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Review from "../components/Reviews/Review"
import Rating from "../components/Reviews/Rating"
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import { EvilIcons } from '@expo/vector-icons';
import ProductAction from "../components/Product/ProductAction";
import Input from "../components/Inputs/Input";
import Deal from "../components/Category/Deal";
import { Fontisto } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import Address from "../components/Address";
import CreditCardSelect from "../components/CreditCardSelect";
import CreditCard from "../components/CreditCard";
import BottomSheet from '../components/Modals/BottomSheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useCallback, useRef } from 'react';
import CardCat from "../components/CardCat";
import { Entypo } from '@expo/vector-icons';
import Info from "../components/Info";

const { width, height } = Dimensions.get("window");
function PaymentsDisplay() {
  const [cards, setCard]  = useState([])
  const [form, setForm] = useState({name: '', number: '', cvv : '' , exp : '', card : '', id : cards.length})
  const [scrollHeight, setScrollHeight] = useState(-450) 
  const [index, setIndex] = useState(null);
  const [active, setActive] = useState(false)
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  }; 
  const ref = useRef(null);
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    // ref?.current?.scrollTo(0);
      ref?.current?.scrollTo(-450);
      setScrollHeight(-450)
      setForm({name: '', number: '', cvv : '' , exp : '', card : '', id: cards.length})
  })
  const onEditing = useCallback(() => {
      ref?.current?.scrollTo(-650);
      setScrollHeight(-650)
  })
  
  const methods = ['Paypal', 'Debit Card', 
  'Credit Card',
]
  function onPressHandler(){ 
    if (index != null) {
    setScrollHeight((prev) => prev == -450 ? -550 : -450)
    ref?.current?.scrollTo(scrollHeight)
    }
  }
  const onDone = useCallback (()=>{
    setScrollHeight((prev) => prev == -450 ? -550 : -450)
    setCard((prev)=>[...prev,{...form, card :'MasterCard'}])
    setForm({name: '', number: '', cvv : '' , exp : '', card : '', id:  cards.length})
    setIndex()
    ref?.current?.scrollTo(0)
  })
  const onEdit = useCallback (()=>{
    setScrollHeight((prev) => prev == -450 ? -550 : -450)
    setCard((prev)=>{const newCard = [...prev];
      newCard[form.id] = {...form};
      return newCard
})
    setForm({name: '', number: '', cvv : '' , exp : '', card : '', id: cards.length})
    setIndex()
    ref?.current?.scrollTo(0)
  })
  function deleteAndUpdate(indexToDelete) {
    
    const newCards = [...cards]
    console.log(newCards)
    // Delete the object at the specified index
    newCards.splice(indexToDelete, 1);
  
    // Update the id property of other objects
    for (let i = indexToDelete; i < newCards.length; i++) {
      newCards[i].id -= 1;
    }
    ref?.current?.scrollTo(0)
    setScrollHeight(-450)
    setForm({name: '', number: '', cvv : '' , exp : '', card : '', id: cards.length})
    setIndex()
    console.log("Updated List:", newCards);
    setCard(newCards)
  }
  function handleFormChange(field, value) {
    if (field == 'number'){
      
      const cleanedInput = value.replace(/\D/g, '');
    // Add brackets dynamically based on entered digits
    let formattedNumber = '';
    for (let i = 0; i <  cleanedInput.length; i++) {
      if (i === 4) {
        formattedNumber += ' ';
      } else if (i === 8) {
        formattedNumber += ' ';
      } else if (i === 12) {
        formattedNumber += ' ';
      }
      formattedNumber +=  cleanedInput[i];
    }
    value = formattedNumber
    }
    if (field == 'exp'){
      const cleanedInput = value.replace(/\D/g, '');
      let formattedNumber = '';
      for (let i = 0; i <  cleanedInput.length; i++) {
        if (i === 2) {
          formattedNumber += '/';
        } 
        formattedNumber +=  cleanedInput[i];
      }
      value = formattedNumber
    }
    setForm((prev) => ({...prev, [field]: value}));
    
  }
   
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Pressable style = {{flex: 1}} onPress={Keyboard.dismiss}>
        <View>
        
        <ScrollView>
        
        <View style={[styles.recommendedView, {paddingBottom: '50%' }]}>
           {cards.length > 0 && cards.map(({card, number}, idx) => <View  key={idx}><Pressable><CreditCard onPress={()=>{onEditing(); setForm({...cards[idx]})}} card={card} number={number.slice(0, 4)}/></Pressable></View>)}
           {!cards.length && <View  style={{gap: 19, marginBottom: 45}}><View><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>You currently have no saved payment method, add one to ease your checkout.</Text></View>}
           <View style={[{height: 75}]}>
                <FlexButton onPress={onPress}><Text style={{fontSize: 18}}>Add payment method</Text></FlexButton>
            </View>
          </View>
            
        
        </ScrollView>
        
       
        </View>
        <BottomSheet ref={ref}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%' }} >
         {scrollHeight == -450 && <><View style ={{justifyContent: 'space-between', flexDirection: 'row', marginVertical: 20}}><Text style={{fontWeight: 'bold'}}>Select Method</Text></View>
    <View style ={{flex : 1}}>
    <View style={{flex : 0.34, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 35, justifyContent: 'center'}}>
        {methods.map((item, id)=><View key={id} style={{width : '45%'}}><Pressable onPress={()=>{handleSelect(id)}}>
        <CardCat active={index == id}>{item}</CardCat>
        </Pressable></View>)}
      
      </View>
      <View style={[{height: 65}]}>
          <FlexButton onPress={onPressHandler} background={index == null ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontSize: 18}}>Select</Text></FlexButton>
      </View>
      </View></>}
      {scrollHeight == -550 && <><View style ={{justifyContent: 'space-between', flexDirection: 'row', marginVertical: 20}}><Text style={{fontWeight: 'bold'}}>Add Card</Text></View>
     
     <View style={{flex: 1,}}>
     <Input text={'Card Holder Name'} textInputConfig={{cursorColor: '#aaa',value: form.name, onChangeText: handleFormChange.bind(this, 'name')}}/>
     <Input text={'Card Number'} length={19} keyboard="number-pad" textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}} />
     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
       <View style={{flex: 0.5}}>
     <Input text={'CVV'} length={3} secured={true} keyboard="number-pad" textInputConfig={{cursorColor: '#aaa',value: form.cvv, onChangeText: handleFormChange.bind(this, 'cvv')}}/>
     </View>
     <View style={{flex: 0.48}}>
     <Input text={'Expiry Date'} length={5} keyboard="number-pad" textInputConfig={{cursorColor: '#aaa',value: form.exp, onChangeText: handleFormChange.bind(this, 'exp')}}/>
     </View>
     
     </View>
     <View style ={{marginVertical: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default payment</Text>
              </View>
    <Info text={'By adding this card you can easily complete purchases securely with it.'}/>
     <View style={[{height: 65, marginTop: 40}]}>
         <FlexButton onPress={onDone} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
     </View>
     </View></>}
      {scrollHeight == -650 && <><View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>{`${form.card} ${form.number.slice(0, 4)}*`}</Text><Pressable onPress={()=>deleteAndUpdate(form.id)} style={({pressed}) => pressed && {opacity: 0.5}}><View style ={{flexDirection: 'row', gap:6, alignItems: 'center'}}><Octicons name="trash" size={24} color="#B22334" /><Text style={{fontWeight: 'bold', color: '#B22334'}}>Delete Card</Text></View></Pressable></View>
     
<View style={{flex: 1,}}>
     <Input text={'Card Holder Name'} textInputConfig={{cursorColor: '#aaa',value: form.name, onChangeText: handleFormChange.bind(this, 'name')}}/>
     <Input text={'Card Number'} length={19} keyboard="number-pad" textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}} />
     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
       <View style={{flex: 0.5}}>
     <Input text={'CVV'} length={3} secured={true} keyboard="number-pad" textInputConfig={{cursorColor: '#aaa',value: form.cvv, onChangeText: handleFormChange.bind(this, 'cvv')}}/>
     </View>
     <View style={{flex: 0.48}}>
     <Input text={'Expiry Date'} length={5} keyboard="number-pad" textInputConfig={{cursorColor: '#aaa',value: form.exp, onChangeText: handleFormChange.bind(this, 'exp')}}/>
     </View>
     
     </View>
     <View style ={{marginVertical: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default payment</Text>
              </View>
    <Info text={'By adding this card you can easily complete purchases securely with it.'}/>
     <View style={[{height: 65, marginTop: 40}]}>
         <FlexButton onPress={onEdit} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
     </View>
     </View></>}
        </View>
            
        </BottomSheet>
      </Pressable>

    </GestureHandlerRootView>
  );
}
export default PaymentsDisplay;



const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "bold", fontSize: 20 },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%', gap: 20
  },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    // borderWidth: 2
  }
})