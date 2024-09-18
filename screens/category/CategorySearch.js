import {
  ImageBackground,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import Text from '../../components/Text';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Product from "../../components/Product/Product";
import Input from "../../components/Inputs/Input"
import { MaterialIcons } from '@expo/vector-icons';
import ProductCategory from "../../components/Category/ProductCategory";
import { useRoute } from "@react-navigation/native";
import {addToCart, removeFromCart} from '../../Data/cart'
import {useSelector, useDispatch} from 'react-redux'
import BottomSheet from '../../components/Modals/BottomSheet';
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import IncrementDecrementBtn from "../../components/Buttons/IncrementDecrementBtn";
import CartModal from "../../components/Cart/CartModal";
import { useEffect, useState, useRef } from "react";

const { width, height } = Dimensions.get("window");
function CategorySearch() {
  const route = useRoute()
  const [visible, setVisible] = useState(false)
  const name = route.params.cat
  const [restrictions, setRestrictions] = useState([])
  const dispatch = useDispatch();
  const [chosen, setChosen] = useState([])
  const cartItems = useSelector((state) => state.cartItems.ids)
  const productItems = useSelector((state) => state.productItems.ids)
  const categoryObject = {};
  const ref = useRef(null);
  const ref2 = useRef(null);
  const res = {'Meal Type': ["Breakfast", "Brunch", "Lunch", "Dinner",  "Appetizer", "Dessert",], 'Cooking Method': ["Grilled", "Baked", "Fried", "Steamed", "Roasted", "Sauteed", "Boiled", "Stir-Fried", "Smoked", "Slow-Cooked",], 'Ingredients': [ "Chicken", "Beef", "Fish", "Shrimp", "Rice", "Pasta", "Vegetables", "Fruits", "Cheese",], 'Nutrients': ['Protein']}
  const [filter, setFilter] = useState({'Meal Type': false,'Cooking Method': false, 'Ingredients': false, 'Nutrients': false })
  function toggleValueInObject(value) {
    setFilter((prev)=>{
      const obj = {...prev}
    if (!(value in obj)) {
        obj[value] = true; // Add the value to the object and set its value to false
    } else {
        obj[value] = !obj[value]; // Toggle its value
    }return obj})
}
  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 1500);
  }, [visible])
  productItems.forEach(item => {
    const category = item.category;

    if (!categoryObject[category]) {
        // If the category key doesn't exist, create it with an array containing the current item
        categoryObject[category] = [item];
    } else {
        // If the category key already exists, push the current item to the existing array
        categoryObject[category].push(item);
    }
});

function createFoodDictionary(foodArray) {
  let foodDictionary = {};
  for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
  }
  return foodDictionary;
}
const [option, setOption] = useState()
// Example usage:
let [foodStore, setFood] = useState({})
const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro , setPro] = useState({})

const [extra, setExtra] = useState()
const [plus, setPlus] = useState([])
function findPrice(foodName) {
  for (let i = 0; i < extra.length; i++) {
    if (extra[i][0] === foodName) {
      return extra[i][1];
    }
  }
  return "Item not found in the menu";
}
console.log(restrictions)
useEffect(()=>{
  if (plus.length == 2){
    
    dispatch(addToCart({ id: pro }))
      for (var i = 0; i < plus.length; i ++){
        dispatch(addToCart({ id: {'title': plus[i], 'oldPrice': findPrice(plus[i]), quantity: 1} }))
      }
      setPlus([])
      ref2?.current?.scrollTo(0)
      setFoodDictionary(foodStore)
  }
},[plus])
function handleAddToCart(product) {
  setPro(product)
  if (product.extras){
    setExtra(product.extras)
    setFoodDictionary(createFoodDictionary(product.extras))

}
if (product.extras || product.options ){
  ref?.current?.scrollTo(0)
  ref2?.current?.scrollTo(-570);}else{
  dispatch(addToCart({ id: product }));}
}
const [selected, setSelected] = useState({})
function toggleNumberInArray(val,number) {
  setRestrictions((prev)=>{
    const array = [...prev]
    const index = array.indexOf(res[val][number])
    if (index === -1) {
      // Number is not in the array, so add it
      array.push(res[val][number]);
  } else {
      // Number is already in the array, so remove it
      array.splice(index, 1);
  }
  return array
  })
  
  setSelected((prev)=> {
      const array = {...prev}
      if (!(val in array )){
        array[val] = []
      }
      const index = array[val].indexOf(number);
  if (index === -1) {
      // Number is not in the array, so add it
      array[val].push(number);
  } else {
      // Number is already in the array, so remove it
      array[val].splice(index, 1);
  }
  return array
  })
}
useEffect(()=>{setFilteredItems(filterItems(restrictions))}, [restrictions])
function toggleNumberInArray2(number) {
  setChosen((prev)=> {
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
  // Sample array of items


// Function to filter items based on the provided filtering options
function filterItems(filteringOptions) {
  if (filteringOptions.length === 0) {
    return productItems.filter(item => item.category === name || item.subCategory === name); // Return only food items if filteringOptions is empty
  }
  return productItems.filter(item => {
    // Check if the item's related array includes any of the filtering options
    const hasFilteringOption = item.related ?  filteringOptions.some(option =>
      item.related.includes(option.toLowerCase())
    ): false;
    
    // Check if the item's category is food
    const isname = item.category === name.toLowerCase();
    
    // You can add additional conditions based on nutrients or any other criteria here
    
    // Return true if the item should be kept, false otherwise
    return hasFilteringOption && isname;
  });
}
const [value, setValue] = useState("");
// Example usage:
const [filteredItems, setFilteredItems] = useState(filterItems(restrictions));
function searchTitles(items, searchPhrase) {
  const result = [];
  if (searchPhrase.length < 1){
    return items
  }
  // Iterate through each item in the array
  items.forEach((item) => {
    // Check if the title or related keywords contain the search phrase
    if (item.title.toLowerCase().includes(searchPhrase.toLowerCase())) {
      // If found, push the title into the result array
      result.push(item);
    }
     else if (item.related) {
      // If the item has related keywords, check each related keyword
      item.related.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
     else if (item.subCategory) {
      // If the item has related keywords, check each related keyword
      item.subCategory.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
     else if (item.nutrients) {
      // If the item has related keywords, check each related keyword
      item.nutrients.forEach((keyword) => {
        if (keyword.name.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
     else if (item.components) {
      // If the item has related keywords, check each related keyword
      item.components.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
  });

  return result;
}
const result = searchTitles(filteredItems, value);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style ={{flex: 1}}>
      <SafeAreaView onTouchStart={()=>{ref?.current?.scrollTo(0);ref2?.current?.scrollTo(0)}} style={styles.container}>
        <ImageBackground
          borderRadius={16}
          style={styles.backgroundImgStyle}
          source={require("../../assets/categoryPic.png")}
        >
          <View style={styles.catHead}>
            <Text style={styles.text}>{name}</Text>
          </View>
        </ImageBackground>
        <Input icon={<EvilIcons name="search" size={24} color="#aaa" />} text={'Search'} textInputConfig={{
          cursorColor: "#aaa",
          value: value,
          onChangeText: (e) => setValue(e),
          onTouchStart: ()=>{ref?.current?.scrollTo(0);ref2?.current?.scrollTo(0)}}} />
        {/* <View style={styles.input}>
          <EvilIcons name="search" size={24} color="#aaa" />
          <TextInput
            style={{ fontSize: 16 }}
            placeholder="Search                                                                          "
          />
        </View> */}
        <View style={styles.topList}>
          <Text style={{  fontSize: 20 }}>{`All ${name}`}</Text>
          <Pressable onPress={()=> {ref?.current?.scrollTo(-570); ref2?.current?.scrollTo(0)}}>
            <Text style={{ color: "#BC6C25" }}>
              <Ionicons name="filter" size={16} color="#BC6C25" /> Filter By (
              {restrictions.length}
              )
            </Text>
          </Pressable>
        </View>
        {categoryObject[name] && <ProductCategory onTouch={()=>{ref?.current?.scrollTo(0);ref2?.current?.scrollTo(0)}} items={result} onPress={handleAddToCart} />}
        {!categoryObject[name] && <View  style={{gap: 19, marginBottom: 45}}><View><Image style={styles.image} source={require('../../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>We don’t have this item yet 😥😥.</Text></View>}
        {/* {visible && <View style ={{
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    alignItems: 'center',opacity: 1, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style ={{ 
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,}}><CartModal/></View>
        </View>} */}
               {/* <View>
        <Product />
        <Product />
        </View> */}
      </SafeAreaView>
      <BottomSheet ref={ref}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 ,}} >
          <View style={{ paddingBottom: 250}}>
            {Object.keys(filter).map((item, idx)=><View style ={{ marginBottom: 19}} key={idx}><View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{item}</Text>
                                <Pressable onPress={()=>toggleValueInObject(item)} style={{padding: 6, borderRadius: 15, backgroundColor:`${!(filter[item]) ?'white' :  'rgba(0,0,0,0.1)'}`}}><MaterialIcons name="arrow-drop-down" size={24} color="black" /></Pressable>
                            </View>
                            {filter[item] && res[item].map((name, idx)=><View key={idx} style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, paddingRight: 7}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{name}</Text>
                                </View>
                                <Pressable onPress={()=>toggleNumberInArray(item,idx)}>
                                <MaterialCommunityIcons name={`${!selected[item] || selected[item].indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color='black' />
                                </Pressable>
                            </View>)}</View>)}
               </View>
          </ScrollView>
        
            
        </BottomSheet>
        <BottomSheet ref={ref2}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 230}}>
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
                                <Pressable onPress={()=>{chosen.length < 2 || chosen.indexOf(idx) !== - 1 ? toggleNumberInArray2(idx): {}}}>
                                <MaterialCommunityIcons name={`${chosen.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${chosen.length < 2 || chosen.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
                                </Pressable>
                            </View>)}

                        </View>}
              {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15,}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                            </View>
              {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=> { dispatch(addToCart({ id: pro }));ref2?.current?.scrollTo(0); setChosen([])}}>
                                <Ionicons name={`${idx == option ? "md-radio-button-on" : "md-radio-button-off"  }`} size={24} color="black" />
                                </Pressable>
                            </View>)}</View>}
              {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
                                <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                            </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
                                    <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
                                </View>
                                <View>
                                <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setPlus((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}  onDecrease={()=>{setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}}); setPlus((prev)=>{const arr = [...prev]; arr.splice(prev.indexOf(item[0]), 1); return arr})}}/>
                                </View>
                            </View>)}

                        </View>}
                    {pro.instructions && <View 
        style ={{color: 'white', backgroundColor : 'white'}}><TextInput
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


      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default CategorySearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2%",
    paddingTop: 10,
  },
  catHead: {
    marginVertical: "10%",
  },
  backgroundImgStyle: {
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    paddingVertical: 20,
    paddingLeft: 16,
    marginVertical: 16,
    borderRadius: 16,
  },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  text: { color: "white", fontWeight: "500", fontSize: 24 },
  topList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16
  },
});
