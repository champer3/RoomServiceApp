import { Image, StyleSheet, TextInput, View, Pressable, Dimensions, TouchableOpacity, ScrollView } from "react-native";
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
import Svg, {Path} from 'react-native-svg';
import Input from "../components/Inputs/Input";
import Deal from "../components/Category/Deal";
import Text from '../components/Text';
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart, deleteFromCart, addOptions, addItem, updateCart} from '../Data/cart'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '../components/Modals/BottomSheet';
// import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import ProductDescription from "../components/Product/ProductDescription";
import IncrementDecrementBton from "../components/Buttons/IncrementDecrementBtn copy";
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
  
  function handleAddToCart(index) {
    dispatch(addItem({ id: {'index': index} }));
  }
  function handleRemoveFromCart(index) {
    dispatch(removeFromCart({ id: {'index': index} }));
  }
  function handleDeleteFromCart(index) {
    dispatch(deleteFromCart({ id: {'index': index} }));
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
  const calculateTotalPrice = (formObject) => {
    const productQuantity = formObject.products.length; // The quantity of the main product
    let totalPrice = formObject.products[0].price * productQuantity; // Start with the base product price times the quantity
  
    // Calculate the total price of extra items
    formObject.extra?.forEach((extraItem) => {
      totalPrice += extraItem.price * productQuantity;
    });
  
    // Calculate the total price of selected options
    formObject.options.forEach((optionCategory) => {
      if (optionCategory.required) {
        // If the option category is required, multiply the price of each selected option by the product quantity
        optionCategory.values.forEach((selectedOption) => {
          totalPrice += selectedOption.price * productQuantity;
      });
      } else {
        // If the option category is not required, just add the price of each selected option
        optionCategory.values.forEach((selectedOption) => {
            totalPrice += selectedOption.price;
        });
      }
    });
  
    return totalPrice;
  };
  const cost = {}
  function addQuantityToObjects(inputList) {
      const titleCountMap = {};

      const result = {};
    inputList.forEach(obj => {
        const title = Object.keys(obj)[0];
        let count = 0;
        const arrayLength = obj[title].forEach(item => count += item.products.length);
        result[title] = count;
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
            totalPrice += calculateTotalPrice(item)
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
   // Helper function to calculate the subtotal for all items
   const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => {
      const productPrice = calculateTotalPrice(item)
      return total + productPrice 
    }, 0);
  };
  function handleProductClick(item, index){
    let product = item.products[0]
    dispatch(deleteFromCart({ id: {'index': index} }));
    navigation.navigate('Product',{product, productData: item})
  }
  // Render each product in the cart
  const renderCartItem = ({ item, index }) => {
    const product = item.products[0]; // Assuming only one product per cart entry
    return (
      <ProductAction component={item.components}  onTap={()=> handleProductClick(item, index)} title={product.title} options={item.options} instruction={item.instructions} side={item.extra} image={product.images[0]} quantity={item.products.length} price={calculateTotalPrice(item)} action={<Pressable onPress={()=>handleDeleteFromCart(index)} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={35} color="#B22334" /></Pressable>}><IncrementDecrementBton minValue={item.products.length} onIncrease={()=>{handleAddToCart(index)}} onDecrease ={()=>{handleRemoveFromCart(index)}}/></ProductAction>
    );
  };
  function pressHandler (){
    if (cartItems.length > 0){
      navigation.navigate('Checkout', cartItems)}
  }
  // Calculate total
  const subtotal = calculateSubtotal();
  const taxesAndFees = 0.3 * subtotal;
  const deliveryFee = 5.00;
  const total = subtotal + taxesAndFees + deliveryFee;

  return (
    <View style={styles.container}>
           <View style={{marginTop: 45, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={navigation.goBack}><Svg width={43} height={43} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path class="fa-secondary" fill={'#425928'} opacity=".4" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm112 0c0-6.1 2.3-12.3 7-17L231 127c4.7-4.7 10.8-7 17-7s12.3 2.3 17 7c9.4 9.4 9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9c-4.7 4.7-10.8 7-17 7s-12.3-2.3-17-7L119 273c-4.7-4.7-7-10.8-7-17z"/><Path fill={'#425928'} class="fa-primary" d="M119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273z"/></Svg>
        </TouchableOpacity>
    <Text style={{ fontSize: 20, textAlign: 'center', width: '80%'}}>My Cart</Text>
     </View>
    {cartItems.length == 0 && <View  style={[styles.recommendedView,{gap: 50, marginVertical: 45}]}><View><Image style={styles.image} source={require('../assets/cartEmpty.png')}/></View><Text style={{textAlign: 'center'}}>Your cart is currently empty, Check out people’s favorite items!</Text></View>}
     {cartItems.length > 0 && <>
     <View style={{marginTop: 20}}></View>
      {cartItems.map((item, index) => (
        <View key={index.toString()}>
          {renderCartItem({ item, index })}
        </View>
      ))}

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text>Sub total</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Taxes & Fees</Text>
          <Text>${taxesAndFees.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity onPress={pressHandler} style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity></>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: "8%"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    // flex: 1,
  },
  productName: {
    fontSize: 16,
  },
  orderSummary: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderStyle: 'dashed'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 18,
  },
  checkoutButton: {
    backgroundColor: '#283618',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
export default CartDisplay



// <ScrollView onTouchStart={()=>{ref2?.current?.scrollTo(0);ref?.current?.scrollTo(0); ref3?.current?.scrollTo(0); }} style={{marginBottom: '19%' , paddingTop: 20 }}>

// {cartItems.length == 0 && <View  style={[styles.recommendedView,{gap: 50, marginVertical: 45}]}><View><Image style={styles.image} source={require('../assets/cartEmpty.png')}/></View><Text style={{textAlign: 'center'}}>Your cart is currently empty, Check out people’s favorite items!</Text></View>}
// {cartItems.length > 0 && <><View style={{marginHorizontal: '10%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
//     {cartItems.map((item, idx)=>  <ProductAction onTap={()=>{ref2?.current?.scrollTo(-570); }} key={idx} title={item.products[0].title} price={calculateTotalPrice(item)} image={item.products[0].images[0]} quantity={item.products.length} action={<Pressable onPress={()=>handleDeleteFromCart()} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={45} color="#B22334" /></Pressable>}><IncrementDecrementBtn minValue={item.products.length} onIncrease={()=>{handleAddToCart()}} onDecrease ={()=>{handleRemoveFromCart()}}/></ProductAction>)}
// </View>
// <View  style={{paddingHorizontal: '5%', paddingVertical: '10%'}}>
//     <Text style={{
//                 color: "black",
//                 fontSize: 16,
//             }}>Have a coupon code?</Text>
//     <Input text={'Enter Coupon'} buttonText={'Apply code'}/>
// </View></>}
// <View style={{paddingHorizontal: '1%', paddingVertical: '10%'}}>
// <Deal text={"Best Grocery Deals!"} onPress={dealHandler} 
// onAdd={handleAddCart}
// item={[
// { title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', newPrice: 4.99, oldPrice: 1.99, image: require('../assets/snacks1.png'), reviews: [], category: 'snacks' },
// { title: 'Kit Kat Candy Bar King Size 3oz', newPrice: 3.69, oldPrice: 1.99, image: require('../assets/snacks3.png'), reviews: [], category: 'snacks' },
// { title: 'Tiger Eye Iced Coconut Latte 8.5oz', newPrice: 3.79, oldPrice: 1.99, image: require('../assets/drink4.png'), reviews: [], category: 'drink' },

// ]} color = '#039F03' />
// </View>
// </ScrollView>
// <BottomSheet ref={ref}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 590}}>
//   {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
//                         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//                     </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=>toggleNumberInArray(idx)}>
//                         <MaterialCommunityIcons name={`${selected.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${selected.length < 2 || selected.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
//                         </Pressable>
//                     </View>)}

//                 </View>}
//       {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',  borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, alignItems: 'center'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
//                         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//                         <View style ={{width: width/3.7, height: '170%'}}>
//                             <FlexButton onPress = {option >= 0 ? handleAdd : ()=>{}} background={option == undefined  ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
//                         </View>
//                     </View>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
//       {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=> {setOption(idx)}}>
//                         <Ionicons name={`${idx == option ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" />
//                         </Pressable>
//                     </View>)}</View>}
//       {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
//                         <View style ={{width: width/4.7, height: '170%'}}>
//                             <FlexButton onPress = {plus.length == 2 ? handleAdd : ()=>{}} background={plus.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
//                         </View>
                        
//                     </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
//                             <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
//                         </View>
//                         {(plus.length < 2 || (plus.length && plus.indexOf(item[0]) !== -1)) && <View>
//                           <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setPlus((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setPlus((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
//                         </View>}
//                     </View>)}

//                 </View>}
//             {pro.instructions && <View 
// style ={{color: 'white', backgroundColor : 'rgba(0,0,0,0.05)'}}><TextInput
// multiline
// placeholder="Special Instructions?"
// cursorColor={'#aaa'}
// numberOfLines={6}
// clearButtonMode="always"
// style={{paddingHorizontal: 10}}
// /></View>
// }</View>
// </ScrollView>
// </BottomSheet>
// <BottomSheet ref={ref2}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 590, gap: 30}}>
//     {display.map(({Flavour, instruction, Sides, Picked, title,images, oldPrice}, idx)=><View key={idx}><ProductDescription onPress={()=>handleEdit(title, idx)} action={()=>{dispatch(deleteItem({id : {title: title, index: idx}}));  ref2?.current?.scrollTo(0)}} option={Picked} instruction={instruction} flavour={getFlavors(Flavour)} side={Sides} price={oldPrice} image={images[0]} title={title}/></View>)}
//     </View>
// </ScrollView>
// </BottomSheet>
// <BottomSheet ref={ref3}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 590}}>
// {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
//                         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//                     </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=>{addOn1.length < 2 || addOn1.indexOf(idx) !== - 1 ? toggleNumberInArray1(idx): {}}}>
//                         <MaterialCommunityIcons name={`${addOn1.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${addOn1.length < 2 || addOn1.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
//                         </Pressable>
//                     </View>)}

//                 </View>}
//       {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center', marginTop: 15, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15,}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
//                         <View style ={{width: width/3.7, height: '170%'}}>
//                             <FlexButton onPress = {option1 ? handleUpdate : ()=>{}} background={option1 < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 15}}>Update</Text></FlexButton>
//                         </View>
//                     </View>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
//                     {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=> {setOption1(pro.options[idx])}}>
//                         <Ionicons name={`${pro.options[idx] == option1 ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" />
//                         </Pressable>
//                     </View>)}</View>}
//       {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
//                         <View style ={{width: width/3.7, height: '170%'}}>
//                             <FlexButton onPress = {plus1.length == 2 ? handleUpdate : ()=>{}} background={plus1.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 15}}>Update</Text></FlexButton>
//                         </View>
//                         </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                    
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
//                             <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
//                         </View>
//                         {(plus1.length < 2 || (plus1.length && plus1.indexOf(item[0]) !== -1)) && <View>
//                           <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus1.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setSides((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus1.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setSides((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
//                         </View>}
//                     </View>)}

//                 </View>}
//             {pro.instructions && <View 
// style ={{color: 'white', backgroundColor : 'rgba(0,0,0,0.05)'}}><TextInput
// multiline
// placeholder="Special Instructions?"
// cursorColor={'#aaa'}
// numberOfLines={6}
// clearButtonMode="always"
// style={{paddingHorizontal: 10}}
// /></View>
// }</View>
// </ScrollView>
// </BottomSheet>
// <View style={{flex: 1, width: "100%", paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
//     <View style={{height: '150%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
//         <Text
//         style={{
//             color: "#aaa",
//             // fontWeight: "bold",
//             fontSize: 20,
//         }}
//         > Total Payment</Text>
//         <Text
//             style={{
//                 color: "black",
//                 fontWeight: "600",
//                 fontSize: 20,

//             }}
//             > 
//             $65
//             {/* {`$${getTotalSum().toFixed(2)}`} */}
//             </Text>
//     </View>
//     <View style ={{width: '40%', height: '130%'}}>
//         <FlexButton onPress = {pressHandler} background={cartItems.length == 0 ? "rgba(0,0,0,0.5)" :  '#283618'}><FontAwesome name="shopping-bag" size={width/13} color="white" /><Text style={{color: 'white'}}>Checkout</Text></FlexButton>
//     </View>
// </View>
