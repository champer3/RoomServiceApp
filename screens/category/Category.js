import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import BoxItemCategory from "../../components/Category/BoxItemCategory";
import ItemCategory from "../../components/Category/ItemCategory";
import ProductCategory from "../../components/Category/ProductCategory";
import SearchCat from "../../components/Category/SearchCat";
import Pill from "../../components/Pills/Pills";
import Search from "../../components/Search/Search";
import RecentList from "../../components/RecentList";
import Input from "../../components/Inputs/Input";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../Data/cart";
import { useState, useRef, useEffect } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import IncrementDecrementBtn from "../../components/Buttons/IncrementDecrementBtn";
import BottomSheet from "../../components/Modals/BottomSheet";
import FlexButton from "../../components/Buttons/FlexButton";
const { width, height } = Dimensions.get("window");
function Category() {
  function handleScreenPress() {
    Keyboard.dismiss();
  }
  const [chosen, setChosen] = useState([]);
  const [selected, setSelected] = useState([])
  const ref2 = useRef(null);
  const [value, setValue] = useState("");
  const navigation = useNavigation();
  function pressHandler() {
    navigation.navigate("CategorySearch");
  }
  function cartHandler() {
    if (value.length > 0) {
      setValue("");
    } else {
      navigation.navigate("Home");
    }
  }
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids);
  const productItems = useSelector((state) => state.productItems.ids);
  const categoryObject = {};

  productItems.forEach((item) => {
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
  const [option, setOption] = useState();
  // Example usage:
  let [foodStore, setFood] = useState({});
  const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro, setPro] = useState({});

  const [extra, setExtra] = useState();
  const [plus, setPlus] = useState([]);
  function findPrice(foodName) {
    for (let i = 0; i < extra.length; i++) {
      if (extra[i][0] === foodName) {
        return extra[i][1];
      }
    }
    return "Item not found in the menu";
  }
  function handleUpdate(){
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
    
    ref2?.current?.scrollTo(0)
    setFoodDictionary(foodStore)
    dispatch(addToCart({id : {title: pro.title, ...{...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
  }
  function handleBuy(){
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
    
    ref2?.current?.scrollTo(0)
    setFoodDictionary(foodStore)
    dispatch(addToCart({id : {title: pro.title, ...{...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
    navigation.navigate('Checkout')
  }
  function handleAddToCart(product) {
    setPro(product)
    setPlus([])
    if (product.extras){
      setExtra(product.extras)
      setFoodDictionary(createFoodDictionary(product.extras))
  
  }
  if (product.extras || product.options ){
  
    ref2?.current?.scrollTo(-570);}else{
    dispatch(addToCart({ id: product }));}
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
  let browse = (
    <>
      <View style={styles.browseView}>
        <Text style={styles.browseText}>Browse All Categories</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <BoxItemCategory
          items={[
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
          ]}
        />
      </View>
    </>
  );

  let check = (
    <View style={styles.browseView}>
      <View style={styles.history}>
        <Text style={styles.text}>Most Searched</Text>
        <Search
          items={[
            "water",
            "Gatorade",
            "bottle",
            "chips",
            "ice cream",
            "milk",
            "candy",
            "cookies",
            "food",
            "salmon",
            "bread",
            "gifts",
            "diary",
            "hat",
          ]}
          onPress={setValue}
        />
      </View>
    </View>
  );
  function searchTitles(items, searchPhrase) {
    const result = [];

    // Iterate through each item in the array
    items.forEach((item) => {
      // Check if the title or related keywords contain the search phrase
      if (item.title.toLowerCase().includes(searchPhrase.toLowerCase())) {
        // If found, push the title into the result array
        result.push(item);
      } else if (item.related) {
        // If the item has related keywords, check each related keyword
        item.related.forEach((keyword) => {
          if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
            // If found, push the title into the result array
            result.push(item);
          }
        });
      }
    });

    return result;
  }
  const result = searchTitles(productItems, value);
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
        <StatusBar hidden={false} barStyle="dark-content" />
          <View style={styles.search}>
            <Input
              text={"Search"}
              icon={<EvilIcons name="search" size={24} color="#aaa" />}
              textInputConfig={{
                cursorColor: "#aaa",
                value: value,
                onChangeText: (e) => setValue(e),
                onTouchStart: ()=>ref2?.current?.scrollTo(0)
              }}
            >
              <Pressable style={styles.cart} onPress={cartHandler}>
                <AntDesign name="close" size={20} color="black" />
                <Text style={{ fontWeight: "thin" }}>Cancel</Text>
              </Pressable>
            </Input>
            <View style={styles.cart}>
              <Pressable>
                <View>
                  <Feather name="shopping-cart" size={24} color="black" />
                </View>
              </Pressable>
            </View>
          </View>
          <View
            style={[
              styles.horizontalCat,
              { height: value.length ? height / 8 : height / 5.5 },
            ]}
          >
            {!value.length && <Text style={styles.text}>Categories</Text>}
            <ItemCategory
              items={[
                { text: "Alcohol", image: require("../../assets/Alcohol.png") },
                { text: "Frozen", image: require("../../assets/frozen.png") },
                {
                  text: "Ice Cream",
                  image: require("../../assets/icecream.png"),
                },
                { text: "Food", image: require("../../assets/food.png") },
                { text: "Snacks", image: require("../../assets/snack.png") },
              ]}
              onPress={pressHandler}
            />
          </View>

          {!value.length && check}
          {/* <View style={styles.recentView}>
        <Text style={styles.text}>Recent</Text>
        <RecentList items={["water", "Gatorade", "bottle", "chips", "ice cream", "milk", "candy", "cookies", "food", "salmon"]} />
      </View> */}
          {value && (
            <ProductCategory  onTouch={()=>ref2?.current?.scrollTo(0)} items={result} onPress={handleAddToCart} />
          )}
          {!result.length && (
            <View style={{ gap: 19, marginBottom: 45 }}>
              <View>
                <Image
                  style={styles.image}
                  source={require("../../assets/empty.png")}
                />
              </View>
              <Text style={{ textAlign: "center" }}>No results found</Text>
            </View>
          )}
         <BottomSheet ref={ref2}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 400}}>
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
                                <Pressable onPress={() => {selected.length < 2 || selected.indexOf(idx) !== - 1 ? toggleNumberInArray(idx): {}}}>
                                <MaterialCommunityIcons name={`${selected.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${selected.length < 2 || selected.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
                                </Pressable>
                            </View>)}

                        </View>}
              {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',  borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, alignItems: 'center'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                                <View style ={{width: width/3.7, height: '170%'}}>
                                    <FlexButton onPress = {option >= 0 ? handleUpdate : ()=>{}} background={option == undefined  ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
                                </View>
                                <View style ={{width: width/3.7, height: '170%'}}>
                                    <FlexButton onPress = {option >= 0 ? handleBuy : ()=>{}} background={option == undefined  ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Buy now</Text></FlexButton>
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
                                    <FlexButton onPress = {plus.length == 2 ? handleUpdate : ()=>{}} background={plus.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
                                </View>
                                <View style ={{width: width/3.8, height: '170%'}}>
                                    <FlexButton onPress = {plus.length == 2 ? handleBuy : ()=>{}} background={plus.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Buy now</Text></FlexButton>
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
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default Category;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "2%",
    marginTop: "5%",
    flex: 1,
    backgroundColor: "white"
  },
  search: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
  },
  cart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingRight: 30,
    width: width / 4.2,
  },
  browseText: {
    fontSize: 24,
    fontWeight: "800",
  },
  browseView: {
    marginVertical: 8,
  },
  searchView: {
    flex: 1,
  },
  recentView: {
    flex: 1,
    marginTop: 16,
  },
  horizontalCat: {
    width: "100%",

    marginVertical: 8,
  },
  history: {
    marginTop: "10%",
  },
  text: { fontWeight: "500", fontSize: 20, marginBottom: 20 },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: "contain",
  },
});
