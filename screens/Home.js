import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Image,
  Dimensions,
  Button,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ItemCategory from "../components/Category/ItemCategory";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import ProductHorizontal from "../components/Category/ProductHorizontal";
import Deal from "../components/Category/Deal";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Inputs/Input";
const { width, height } = Dimensions.get("window");
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../Data/cart";
import { useEffect, useState, useRef } from "react";
import BottomSheet from '../components/Modals/BottomSheet';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Home() {
  function getGreeting() {
    var currentTime = new Date();
    var hours = currentTime.getHours();

    if (hours < 12) {
      return "Good Morning!";
    } else if (hours < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
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

// Example usage:
let [foodStore, setFood] = useState({})

  const retrieveTokenFromAsyncStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      console.log(storedToken)
      if (storedToken !== null) {
        console.log('Retrieved token:', storedToken);
      } else {
        console.log('Token not found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };
  const [datas, setDatas] = useState(null);
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: "1036326714736-ca9qlbpotp81psarrg0pk9s3b27tiigo.apps.googleusercontent.com"
  // })
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get("http://10.0.0.173:3000/auth/google");
  //     // const response = await axios.get('http://10.0.0.173:3000/api/v1/users');
  //     // console.log(response.data)
  //     console.log("did we get here?");
  //     // setDatas(response);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro , setPro] = useState({})
  useEffect(() => {
    console.log("hit the useEffect");
    // fetchData();
  }, []);

  const data = useSelector((state) => state.profileData.profile);
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

  var greeting = getGreeting();
  const navigation = useNavigation();
  function pressHandler(cat) {
    navigation.navigate("Category", { cat });
  }
  function chooseHandler() {
    navigation.navigate("All Categories");
  }
  function cartHandler() {
    navigation.navigate("Cart");
  }
  function dealHandler() {
    navigation.navigate("All Deals");
  }
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
  
  useEffect(()=>{
    if (plus.length == 2){
      
      dispatch(addToCart({ id: pro }))
        for (var i = 0; i < plus.length; i ++){
          dispatch(addToCart({ id: {'title': plus[i], 'oldPrice': findPrice(plus[i]), quantity: 1} }))
        }
        setPlus([])
        ref?.current?.scrollTo(0)
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
  
    ref?.current?.scrollTo(-570);}else{
    dispatch(addToCart({ id: product }));}
  }
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style ={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingTop: "2%",
          }}
        >
          <View style={{ gap: 6 }}>
            <Text
              style={{
                color: "white",
                fontSize: 13,
                letterSpacing: 0.4,
                fontWeight: "bold",
              }}
            >
              {greeting}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >{`${data.firstName} `}</Text>
            {/* >{`${data.firstName} ${data.secondName}`}</Text> */}
          </View>
          <View style={[styles.cart, { flex: 0.25 }]}>
          <Pressable style={[styles.cart, {flex: 1}]} onPress={cartHandler}>


                <View>
                  <Feather name="shopping-cart" size={24} color="black" />
                </View>

                {cartItems.length > 0 && <View style={{
                  height: '35%',
                  minWidth: '32%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 2,
                  top: 0,
                  borderRadius: 100,
                  fontSize: 14,
                  backgroundColor: "#283618"
                }}>
                  <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>{cartItems.length}</Text>
                </View>}
                </Pressable>
          </View>
        </View>
          <Pressable style={[styles.search, {marginTop: 10}]} onPress={()=> navigation.navigate('Search')}>
            <View style={{flexDirection: 'row', gap: 20,borderColor: 'white', borderWidth: 1, borderRadius: 10, alignItems: "center",paddingVertical: 12, paddingHorizontal: 16 }}>
              <EvilIcons name="search" size={24} color="white" />
              <Text style={{color: 'white', fontSize: 16}}>Search items</Text>
            </View>
            {/* <Input
            onInteract={()=> navigation.navigate('Search')}
            color={"white"}
            icon={<EvilIcons name="search" size={24} color="white" />}
            text={"Search items"}
          ></Input> */}
          </Pressable>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View style={[styles.horizontalCat, { marginTop: 20 }]}>
            <View style={styles.catHead}>
              <Text style={styles.text}>Popular Categories</Text>
              <Pressable onPress={chooseHandler}>
                <Text style={{ color: "#BC6C25", fontSize: 12 }}>See All</Text>
              </Pressable>
            </View>
            <ItemCategory
              items={[
                { text: "Alcohol", image: require("../assets/Alcohol.png") },
                { text: "Frozen", image: require("../assets/frozen.png") },
                { text: "Ice Cream", image: require("../assets/icecream.png") },
                { text: "Food", image: require("../assets/food.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
              ]}
            />

            {/* <ScrollView style={{borderWidth: 1}} horizontal={true}>
              <View style={{flex: 1}}>
            <Pressable onPress={dealHandler} stylye ={{borderWidth: 1}}>
              <Image
                style={styles.image}
                source={require("../assets/deals.png")}
              />

            </Pressable>
            </View>
            <Pressable onPress={dealHandler}>
              <Image
                style={styles.image}
                source={require("../assets/deals.png")}
              />
            </Pressable>
            <Pressable onPress={dealHandler}>
              <Image
                style={styles.image}
                source={require("../assets/image 16.png")}
              />
            </Pressable>
          </ScrollView> */}
            <ScrollView horizontal={true}>
              <View
                style={{ flexDirection: "row", flexWrap: "nowrap", gap: 15 }}
              >
                <Pressable onPress={dealHandler}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={require("../assets/deal1.png")}
                    />
                  </View>
                </Pressable>
                <Pressable onPress={dealHandler}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={require("../assets/deal2.png")}
                    />
                  </View>
                </Pressable>
                <Pressable onPress={dealHandler}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={require("../assets/deal3.png")}
                    />
                  </View>
                </Pressable>
                <Pressable onPress={dealHandler}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={require("../assets/deal4.png")}
                    />
                  </View>
                </Pressable>
                <Pressable onPress={dealHandler}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={require("../assets/deal5.png")}
                    />
                  </View>
                </Pressable>
              </View>
            </ScrollView>
          </View>

          <View style={styles.recommendedView}>
            <Text style={styles.text}>Recommended Foods</Text>
            <ProductHorizontal
              items={categoryObject["food"].slice(0,6)}
              onPress={handleAddToCart}
            />
          </View>

          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal
              text={"Best Grocery Deals!"}
              onPress={dealHandler}
              onAdd={handleAddToCart}
              item={[
                {
                  title: "Woodstock Organic Frozen Broccoli Florets 10oz",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/cr3.png"),
                  category: "frozen",
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
                  newPrice: "10.00",
                  image: require("../assets/cr1.png"),
                },
              ]}
              color="#039F03"
            />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Snacks For You</Text>
            <ProductHorizontal
              items={categoryObject["snacks"]}
              onPress={handleAddToCart}
            />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Alcohol</Text>
            <ProductHorizontal
              items={categoryObject["alcohol"]}
              onPress={handleAddToCart}
            />
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal
              text={"Health Deals"}
              onPress={dealHandler}
              onAdd={handleAddToCart}
              item={[
                {
                  title: "Theraflu Green Tea & Honey Lemon Multi-",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/h1.png"),
                },
                {
                  title: "Stix Early Pregnancy Test 2ct",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/h2.png"),
                },
                {
                  title: "Equaline Cotton Swabs 375ct",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/h3.png"),
                },
                {
                  title: "Q-Tips Cotton Swabs 170ct",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/h4.png"),
                },
                {
                  title: "Equaline Cotton Swabs 375ct",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/h3.png"),
                },
              ]}
              color="#00CED1"
            />
          </View>

          <View style={styles.recommendedView}>
            <Text style={styles.text}>Drinks</Text>
            <ProductHorizontal
              items={categoryObject["drink"]}
              onPress={handleAddToCart}
            />
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal
              text={"Pantry Deals"}
              onPress={dealHandler}
              onAdd={handleAddToCart}
              item={[
                {
                  title: "Post Fruity Pebbles Cereal 11oz",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/p1.png"),
                },
                {
                  title:
                    "Stix Early Pregnancy TGeneral Mills Cinnamon Toast Crunch Cereal 12ozest 2ct",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/p2.png"),
                },
                {
                  title: "Post Marshmallow Fruity Pebbles Cereal 11oz $5.69",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/p3.png"),
                },
                {
                  title: "Post Cocoa Pebbles Cereal 11oz",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/p4.png"),
                },
                {
                  title: "Post Honey Bunches of Oats Honey Roasted 12oz",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/p5.png"),
                },
              ]}
              color="#D2B48C"
            />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Home</Text>
            <ProductHorizontal
              items={categoryObject["home"]}
              onPress={handleAddToCart}
            />
          </View>
          <View style={styles.recommendedView}>
            <Deal
              text={"Yummy Ice Creams!"}
              onPress={dealHandler}
              onAdd={handleAddToCart}
              item={[
                {
                  title: "Ben & Jerry's Churray for Churros Ice Cream Pint",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/i1.png"),
                },
                {
                  title: "Milk Bar Gingerbread Latte Pint 14oz",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/i2.png"),
                },
                {
                  title: "Milk Bar Candy Cane Cookies & Cream Pint 14oz$7.99",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/i3.png"),
                },
                {
                  title: "Jeni's, Boozy Eggnog Ice Cream Pint 16oz",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/i4.png"),
                },
                {
                  title: "Jeni's, White Chocolate Peppermint Ice Cream Pi",
                  oldPrice: 4.99,
                  newPrice: "10.00",
                  image: require("../assets/i5.png"),
                },
              ]}
              color="#98FB98"
            />
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <View style={{ flexDirection: "row", flexWrap: "nowrap", gap: 15 }}>
              <Pressable onPress={dealHandler}>
                <View style={[styles.imageContainer, { width: width - 30 }]}>
                  <Image
                    style={styles.image}
                    source={require("../assets/deals.png")}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        <BottomSheet ref={ref}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 100}}>
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
              {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15,}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                            </View>
              {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=> { dispatch(addToCart({ id: pro }));ref?.current?.scrollTo(0)}}>
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
      </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#283618",
  },
  search: {
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    // flex: 1,
    paddingVertical: 12,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cart: {
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    borderRadius: 13,
    backgroundColor: "white",
  },
  image: {
    resizeMode: "contain",
    height: height / 2,
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: height / 3,
    width: width / 1.5,
  },
  deals: {
    marginVertical: 16,
    marginHorizontal: "2%",
    flexDirection: "row",
  },
  horizontalCat: {
    width: "100%",
    paddingHorizontal: "2%",
  },
  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center"
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    marginTop: 16,
    marginHorizontal: "2%",
  },
});
