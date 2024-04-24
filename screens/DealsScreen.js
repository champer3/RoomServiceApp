import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Pressable,
  FlatList,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import Deal from "../components/Category/Deal";
import Input from "../components/Inputs/Input";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import BottomSheet from "../components/Modals/BottomSheet";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, addOptions, updateOrder } from "../Data/cart";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { height } = Dimensions.get("window");


function DealsScreen() {
  const navigation  = useNavigation()
  function dealHandler (){

    navigation.navigate('All Deals')
  }
  function handleScreenPress() {
    Keyboard.dismiss()
  }
  function createFoodDictionary(foodArray) {
    let foodDictionary = {};
    for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
    }
    return foodDictionary;
  }
  // Example usage:
  let [foodStore, setFood] = useState({});
  const dispatch = useDispatch();
  const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro, setPro] = useState({});
  const [plus, setPlus] = useState([]);
  const ref = useRef(null);
  const [extra, setExtra] = useState();
  const data = [
    { key: "1", text: "Best Meal Deal" , things: [
      { title: 'Grits', oldPrice: 3.99, newPrice: 6.00, image: require('../assets/grits.png'), reviews: [], category: 'food', description: 'Creamy and comforting grits, cooked to a smooth and delicious texture. Enjoy them plain, with cheese, or topped with your favorite savory ingredients.', related: ["side dish", "Southern cuisine", "breakfast", "porridge", "grits", "cheese", "butter", "milk", "cream", "grits and gravy", "shrimp and grits", "creamy", "savory", "comfort food", "versatile", "breakfast food", "lunch", "dinner"] },
                  { title: 'Collard Greens', oldPrice: 3.99,newPrice: 6.00, image: require('../assets/greens.png'), reviews: [], category: 'food', description: "Hearty and flavorful collard greens, simmered to perfection with savory spices. A classic Southern side dish that's both delicious and nutritious.", related: ["side dish", "Southern cuisine", "vegetables", "greens", "healthy", "nutritious", "vegan", "soul food", "pork", "ham hock", "smoked turkey", "bacon", "black-eyed peas", "cornbread", "rice", "hot sauce", "vinegar", "pepper flakes"] },

                  { title: 'Bang Bang (8pcs) Fried Shrimp', oldPrice: 13.99,newPrice: 17.00, related: ["Shrimp", "Seafood", "Fried", "Bang Bang sauce", "Spicy", "Sweet", "Appetizer", "Snack", "Protein", "Lunch", "Dinner", "Party food", "Sharing plates"], description: "Eight pieces of crispy fried shrimp tossed in our signature sweet and spicy Bang Bang sauce. This addictively flavorful dish is sure to be a crowd-pleaser.", image: require('../assets/shrimp.png'), reviews: [], category: 'food' },

    ]},
    { key: "2", text: "Best Snack Deal", things : [
      { newPrice: 4.99, title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', oldPrice: 3.69, image: require('../assets/snacks1.png'), reviews: [], category: 'snacks' },
      { newPrice: 4.99, title: 'Hostess Donettes Chocolate Mini Donuts Bag 10.75oz', oldPrice: 3.69, image: require('../assets/snacks2.png'), reviews: [], category: 'snacks' },
      { newPrice: 4.99, title: 'Kit Kat Candy Bar King Size 3oz', oldPrice: 3.69, image: require('../assets/snacks3.png'), reviews: [], category: 'snacks' },
      { newPrice: 4.99, title: 'Basically, Sour Rainbow Bites 5oz', oldPrice: 3.69, image: require('../assets/snacks4.png'), reviews: [], category: 'snacks' },
      { newPrice: 4.99, title: 'OREO Original Chocolate Sandwich Cookies 13.29oz $5.49', oldPrice: 3.69, image: require('../assets/snacks6.png'), reviews: [], category: 'snacks' },

    ] },
    { key: "3", text: "Best Overall Deal" ,things : [
      { title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', newPrice: 4.99, oldPrice: 1.99, image: require('../assets/snacks1.png'), reviews: [], category: 'snacks' },
      { title: 'Kit Kat Candy Bar King Size 3oz', newPrice: 3.69, oldPrice: 1.99, image: require('../assets/snacks3.png'), reviews: [], category: 'snacks' },
      { title: 'Tiger Eye Iced Coconut Latte 8.5oz', newPrice: 3.79, oldPrice: 1.99, image: require('../assets/drink4.png'), reviews: [], category: 'drink' },
      { title: 'OREO Original Chocolate Sandwich Cookies 13.29oz $5.49', newPrice: 4.99, oldPrice: 1.99, image: require('../assets/snacks6.png'), reviews: [], category: 'snacks' },
      { title: 'White Claw Seltzer Flavor No. 3 Variety 12pk 12oz Can 5.0% ABV $22.99', newPrice: 7.99, oldPrice: 1.99, image: require('../assets/alcohol1.png'), reviews: [], category: 'alcohol' },
] },
  ];
  const renderItem = ({ item }) => (
    <View style={[styles.recommendedView, { alignItems: "center" }]}>
      <Deal text={item.text} onAdd={handleAddToCart} item={item.things} />
    </View>
  );
  function handleAddToCart(product) {
    setPro(product)
    setPlus([])
    if (product.extras) {
      setExtra(product.extras)
      setFoodDictionary(createFoodDictionary(product.extras))

    }

    if (product.extras || product.options) {

      ref?.current?.scrollTo(-570);
    } else {
      dispatch(addToCart({ id: product }));

    }
  }
  return (
      <GestureHandlerRootView style={{flex: 1}}>
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

            {/* <Input text={'Search deals'} icon={<EvilIcons name="search" size={24} color="#aaa" />}/> */}
          <View style={styles.catHead}>
            <Text style={styles.text}>Available Deals</Text>
            {/* <Pressable>
              <Text style={{ color: "#BC6C25" }}>
                {" "}
                <Ionicons name="filter" size={16} color="#BC6C25" /> Filter By
              </Text>
            </Pressable> */}
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            // style={{marginBottom: 20}}
          />
      </SafeAreaView>
      <BottomSheet ref={ref}>
            <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
              <View style={{ marginBottom: 400 }}>
                {pro.addOn && <View style={{ gap: 25, paddingTop: 30, marginBottom: 50 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: "black", fontWeight: "900", fontSize: 19, }}>{'Choose Exotic Flavor'}</Text>
                    {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                  </View>
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>{`Choose up to ${2}`}</Text>
                  {pro.extras.map((item, idx) => <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15 }}>
                    <View>
                      <Text style={{ color: "black", fontWeight: "900", fontSize: 16, }}>{item}</Text>
                    </View>
                    <Pressable onPress={() => toggleNumberInArray(idx)}>
                      <MaterialCommunityIcons name={`${selected.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"}`} size={24} color={`${selected.length < 2 || selected.indexOf(idx) !== - 1 ? 'black' : 'rgba(0,0,0,0.05)'}`} />
                    </Pressable>
                  </View>)}

                </View>}
                {pro.options && <View><View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, alignItems: 'center' }}>
                  <Text style={{ color: "black", fontWeight: "900", fontSize: 19, }}>{'Choose One'}</Text>
                  {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                  <View style={{ width: width / 3.7, height: '170%' }}>
                    <FlexButton onPress={option >= 0 ? handleUpdate : () => { }} background={option == undefined ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Add</Text></FlexButton>
                  </View>
                  <View style={{ width: width / 3.7, height: '170%' }}>
                    <FlexButton onPress={option >= 0 ? handleBuy : () => { }} background={option == undefined ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Buy now</Text></FlexButton>
                  </View>
                </View>
                  <View style={{ padding: 6, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.1)', width: width / 5, alignItems: 'center' }}><Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>Required</Text></View>
                  {pro.options.map((item, idx) => <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13, }}>
                    <View>
                      <Text style={{ color: "black", fontWeight: "900", fontSize: 16, }}>{item}</Text>
                    </View>
                    <Pressable onPress={() => { setOption(idx) }}>
                      <Ionicons name={`${idx == option ? "radio-button-on" : "radio-button-off"}`} size={24} color="black" />
                    </Pressable>
                  </View>)}</View>}
                {pro.nutrient && pro.nutrient == 'protein' && <View style={{ gap: 25, paddingTop: 30 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: "black", fontWeight: "900", fontSize: 19, }}>{'Pick Your Sides'}</Text>
                    <View style={{ width: width / 4.7, height: '170%' }}>
                      <FlexButton onPress={plus.length == 2 ? handleUpdate : () => { }} background={plus.length < 2 ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Add</Text></FlexButton>
                    </View>
                    <View style={{ width: width / 3.8, height: '170%' }}>
                      <FlexButton onPress={plus.length == 2 ? handleBuy : () => { }} background={plus.length < 2 ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Buy now</Text></FlexButton>
                    </View>

                  </View>
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>{`Choose ${2}`}</Text>
                  <View style={{ padding: 6, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.1)', width: width / 5, alignItems: 'center' }}><Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>Required</Text></View>
                  {pro.extras.map((item, idx) => <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15 }}>
                    <View>
                      <Text style={{ color: "black", fontWeight: "900", fontSize: 16, }}>{item[0]}</Text>
                      <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
                    </View>
                    {(plus.length < 2 || (plus.length && plus.indexOf(item[0]) !== -1)) && <View>
                      <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={() => { if (plus.length < 2) { setFoodDictionary((prev) => { return { ...prev, [item[0]]: foodDictionary[item[0]] + 1 } }); setPlus((prev) => { const arr = [...prev]; arr.push(item[0]); return arr }) } }} onDecrease={() => { if (plus.length > 0) { setFoodDictionary((prev) => { return { ...prev, [item[0]]: (foodDictionary[item[0]] ? foodDictionary[item[0]] : 1) - 1 } }); setPlus((prev) => { const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1) { arr.splice(index, 1) }; return arr }) } }} />
                    </View>}
                  </View>)}

                </View>}
                {pro.instructions && <View
                  style={{ color: 'white', backgroundColor: 'white' }}><TextInput
                    multiline
                    placeholder="Special Instructions?"
                    cursorColor={'#aaa'}
                    numberOfLines={6}
                    clearButtonMode="always"
                    style={{ paddingHorizontal: 10 }}
                  /></View>
                }</View>
            </ScrollView>
          </BottomSheet>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default DealsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2%",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    // flex: 1,
    paddingVertical: height / 45,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    marginBottom: Platform.OS === 'ios' ? 20 : -30,
  },
});
