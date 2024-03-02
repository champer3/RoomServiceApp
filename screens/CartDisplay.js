import { Image, StyleSheet, Text, TextInput, View, Pressable, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef , useEffect} from 'react';
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
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart, deleteFromCart, addOptions, deleteItem, updateCart} from '../Data/cart'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '../components/Modals/BottomSheet';
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import ProductDescription from "../components/Product/ProductDescription";
const { width, height } = Dimensions.get("window");
function CartDisplay() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  const [extra, setExtra] = useState()
  const [plus, setPlus] = useState([])
  function findPrice(foodName) {
    for (let i = 0; i < pro.extras.length; i++) {
      if (pro.extras[i][0] === foodName) {
        return pro.extras[i][1];
      }
    }
    return "Item not found in the menu";
  }

const [option, setOption] = useState()
const ref = useRef(null);
function createFoodDictionary(foodArray) {
  let foodDictionary = {};
  for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
  }
  return foodDictionary;
}
function countFoodDictionary(foodArray, index) {
  let foodDictionary = {};
  for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
  }
  if (display[index].Sides){
  for (let i = 0; i < display[index].Sides.length; i++){
    foodDictionary[display[index].Sides[i]]++;
  }
}
  return foodDictionary;
}

// Example usage:
let [foodStore, setFood] = useState({})
const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro , setPro] = useState({})
  const [selected, setSelected] = useState([])
  const productItems = useSelector((state) => state.productItems.ids);
  
  function handleAddToCart(name) {
    let product = []
    productItems.forEach((item) => {if(item.title == name ){product = item}})
    setPro(product)
    if (product.extras){
      setExtra(product.extras)
      setFoodDictionary(createFoodDictionary(product.extras))
  
  }
  if (product.extras || product.options ){
    ref2?.current?.scrollTo(0)
    ref?.current?.scrollTo(-570);}else{
    dispatch(addToCart({ id: product }));}
  }
  function handleRemoveFromCart(product){
    dispatch(removeFromCart({id : product}))
  }
  function handleDeleteFromCart(product){
    dispatch(deleteFromCart({id : product}))
  }
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
  const [display, setDisplay] = useState([])
  const ref2 = useRef(null)
  function handleSelect(name){
    const indexToUpdate = cartItems.findIndex(obj => Object.keys(obj)[0] === name);
    setDisplay(cartItems[indexToUpdate][name])
  }
  const [plus1, setSides] = useState([])
  const [instruction, setInstruction] = useState('')
  const [addOn1, setAddOn] = useState([])
  const [option1, setOption1] = useState(null)
  const [index, setIndex] = useState()

  function handleEdit(name, index){
    ref3?.current?.scrollTo(-570); ref2?.current?.scrollTo(0); 
    let product = []
    productItems.forEach((item) => {if(item.title == name ){product = item}})
    if (product.extras){
    setFoodDictionary(countFoodDictionary(product.extras, index))
    }
    setIndex(index)
    setPro(product)
    setSides(display[index].Sides)
    if (display[index].Flavour){
    setAddOn(display[index].Flavour)}
    else{
      setAddOn([])
    }
    setOption1(display[index].Picked)
    setInstruction(display[index].instruction)
  }
  // Example usage:

  const newList = addQuantityToObjects(cartItems);
    const navigation = useNavigation()
    function pressHandler (){
      if (cartItems.length > 0){
        navigation.navigate('Checkout')}
    }
    function dealHandler (){
        navigation.navigate('All Deals')
      }
      function toggleNumberInArray(number) {
        setSelected((prev)=> {
            const array = [...prev]
            const index = array.indexOf(number);
        if (index === -1) {
            // Number is not in the array, so add it
            array.push(number);
        } else {
            // Number is already in the array, so remove it
            array.splice(index, 1);
        }
        return array
        })
      }
      function toggleNumberInArray1(number) {
        setAddOn((prev)=> {
            const array = [...prev]
            const index = array.indexOf(number);
        if (index === -1) {
            // Number is not in the array, so add it
            array.push(number);
        } else {
            // Number is already in the array, so remove it
            array.splice(index, 1);
        }
        return array
        })
      }
      function handleAdd(){
        let price = 0;
        let newItem ={}
        console.log(selected)
        if (plus && plus.length > 0){
        for (var i = 0; i < plus.length; i ++){
            price += findPrice(plus[i])
          }
          newItem = {...newItem, ...{ 'Sides' : plus}}
        }
        if (option != undefined){
          newItem = {...newItem, ... {'Picked' : pro.options[option]}}
        }
        if (selected && selected.length > 0){
          newItem = {...newItem, ... {'Flavour' : selected}}
        }
        setPlus([])
        setOption()
        
        ref?.current?.scrollTo(0)
        setFoodDictionary(foodStore)
        dispatch(addToCart({id : {title: pro.title, ...{...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
      }
    function handleUpdate(){
      let price = 0;
      let newItem ={}
      if (plus1){
      for (var i = 0; i < plus1.length; i ++){
          price += findPrice(plus1[i])
        }
        newItem = {...newItem, ...{ 'Sides' : plus1}}
      }
      if (option1){
        newItem = {...newItem, ... {'Picked' : option1}}
      }
      if (addOn1 && addOn1.length > 0){
        newItem = {...newItem, ... {'Flavour' : addOn1}}
      }
      ref3?.current?.scrollTo(0); ref2?.current?.scrollTo(0);
      dispatch(updateCart({id : {title: pro.title, index: index, newItem: {...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
    }
    function getFlavors(flavor){
      if (flavor){
      var res = []
      for (var i = 0; i < flavor.length; i++ ){
        res.push(display[0].extras[flavor[i]])
      }
      return res
    }
    return []
    }
    console.log(display)
    const ref3 = useRef()
  return (
    <GestureHandlerRootView  style = {{flex: 1, paddingTop: 20}}>
      <Pressable onPress={()=>{ref2?.current?.scrollTo(0);ref?.current?.scrollTo(0); ref3?.current?.scrollTo(0); }}>
        <ScrollView  style={{marginBottom: '19%' }}>

        {cartItems.length == 0 && <View  style={[styles.recommendedView,{gap: 50, marginVertical: 45}]}><View><Image style={styles.image} source={require('../assets/cartEmpty.png')}/></View><Text style={{textAlign: 'center'}}>Your cart is currently empty, Check out people’s favorite items!</Text></View>}
        {cartItems.length > 0 && <><View style={{marginHorizontal: '10%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
            {newList.map(({title, oldPrice,image, quantity}, idx)=>  <ProductAction onTap={()=>{ref2?.current?.scrollTo(-570); handleSelect(newList[idx].title)}} key={idx} title={title} price={cost[title]} image={image} quantity={quantity} action={<Pressable onPress={()=>handleDeleteFromCart(newList[idx])} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={45} color="#B22334" /></Pressable>}><IncrementDecrementBtn minValue={quantity} onIncrease={()=>{handleAddToCart(newList[idx].title)}} onDecrease ={()=>{handleRemoveFromCart(newList[idx])}}/></ProductAction>)}

        </View>
        <View  style={{paddingHorizontal: '5%', paddingVertical: '10%'}}>
            <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }}>Have a coupon code?</Text>
            <Input text={'Enter Coupon'} buttonText={'Apply code'}/>
        </View></>}
        <View style={{paddingHorizontal: '5%', paddingVertical: '10%'}}>
        <Deal text={"Best Grocery Deals!"} onPress={dealHandler} item={[
    {
      title: "Woodstock Organic Frozen Broccoli Florets 10oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/cr3.png"),
    },
    {
      title: "Woodstock Frozen Organic Mixed Berries 10oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/cr2.png"),
    },
    {
      title: "Sambazon Original Blend Smoothie Superfruit Pack",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/cr1.png"),
    }
  ]} color = '#039F03' />
        </View>
        </ScrollView>
        </Pressable>
        <BottomSheet ref={ref}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 590}}>
          {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                            </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=>toggleNumberInArray(idx)}>
                                <MaterialCommunityIcons name={`${selected.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${selected.length < 2 || selected.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
                                </Pressable>
                            </View>)}

                        </View>}
              {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',  borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, alignItems: 'center'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                                <View style ={{width: width/3.7, height: '170%'}}>
                                    <FlexButton onPress = {option >= 0 ? handleAdd : ()=>{}} background={option == undefined  ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
                                </View>
                            </View>
                            <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
              {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=> {setOption(idx)}}>
                                <Ionicons name={`${idx == option ? "md-radio-button-on" : "md-radio-button-off"  }`} size={24} color="black" />
                                </Pressable>
                            </View>)}</View>}
              {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
                                <View style ={{width: width/4.7, height: '170%'}}>
                                    <FlexButton onPress = {plus.length == 2 ? handleAdd : ()=>{}} background={plus.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
                                </View>
                                
                            </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
                            <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
                                    <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
                                </View>
                                {(plus.length < 2 || (plus.length && plus.indexOf(item[0]) !== -1)) && <View>
                                  <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setPlus((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setPlus((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
                                </View>}
                            </View>)}

                        </View>}
                    {pro.instructions && <View 
        style ={{color: 'white', backgroundColor : 'rgba(0,0,0,0.05)'}}><TextInput
        multiline
        placeholder="Special Instructions?"
        cursorColor={'#aaa'}
        numberOfLines={6}
        clearButtonMode="always"
        style={{paddingHorizontal: 10}}
      /></View>
      }</View>
        </ScrollView>
        </BottomSheet>
        <BottomSheet ref={ref2}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 590, gap: 30}}>
            {display.map(({Flavour, instruction, Sides, Picked, title,image, oldPrice}, idx)=><View key={idx}><ProductDescription onPress={()=>handleEdit(title, idx)} action={()=>{dispatch(deleteItem({id : {title: title, index: idx}}));  ref2?.current?.scrollTo(0)}} option={Picked} instruction={instruction} flavour={getFlavors(Flavour)} side={Sides} price={oldPrice} image={image} title={title}/></View>)}
            </View>
        </ScrollView>
        </BottomSheet>
        <BottomSheet ref={ref3}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 590}}>
        {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                            </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=>{addOn1.length < 2 || addOn1.indexOf(idx) !== - 1 ? toggleNumberInArray1(idx): {}}}>
                                <MaterialCommunityIcons name={`${addOn1.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${addOn1.length < 2 || addOn1.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
                                </Pressable>
                            </View>)}

                        </View>}
              {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center', marginTop: 15, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15,}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
                                <View style ={{width: width/3.7, height: '170%'}}>
                                    <FlexButton onPress = {option1 ? handleUpdate : ()=>{}} background={option1 < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 15}}>Update</Text></FlexButton>
                                </View>
                            </View>
                            <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                            {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=> {setOption1(pro.options[idx])}}>
                                <Ionicons name={`${pro.options[idx] == option1 ? "md-radio-button-on" : "md-radio-button-off"  }`} size={24} color="black" />
                                </Pressable>
                            </View>)}</View>}
              {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
                                <View style ={{width: width/3.7, height: '170%'}}>
                                    <FlexButton onPress = {plus1.length == 2 ? handleUpdate : ()=>{}} background={plus1.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 15}}>Update</Text></FlexButton>
                                </View>
                                </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
                            <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                            
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
                                    <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
                                </View>
                                {(plus1.length < 2 || (plus1.length && plus1.indexOf(item[0]) !== -1)) && <View>
                                  <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus1.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setSides((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus1.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setSides((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
                                </View>}
                            </View>)}

                        </View>}
                    {pro.instructions && <View 
        style ={{color: 'white', backgroundColor : 'rgba(0,0,0,0.05)'}}><TextInput
        multiline
        placeholder="Special Instructions?"
        cursorColor={'#aaa'}
        numberOfLines={6}
        clearButtonMode="always"
        style={{paddingHorizontal: 10}}
      /></View>
      }</View>
        </ScrollView>
        </BottomSheet>
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
                    > {`$${getTotalSum().toFixed(2)}`}
                    </Text>
            </View>
            <View style ={{width: '40%', height: '130%'}}>
                <FlexButton onPress = {pressHandler} background={cartItems.length == 0 ? "rgba(0,0,0,0.5)" :  '#283618'}><FontAwesome name="shopping-bag" size={24} color="white" /><Text style={{color: 'white'}}>Checkout</Text></FlexButton>
            </View>
        </View>

    </GestureHandlerRootView>
  );
}

export default CartDisplay

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
      recommendedView: {
        paddingHorizontal: '5%', paddingTop: '5%', gap: 20
      },
})