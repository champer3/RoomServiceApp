import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
  Button,
  Animated
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ItemCategory from "../components/Category/ItemCategory";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import ProductHorizontal from "../components/Category/ProductHorizontal";
import Deal from "../components/Category/Deal";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Inputs/Input";
const { width, height } = Dimensions.get("window");
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, addOptions, updateOrder } from "../Data/cart";
import { useEffect, useState, useRef } from "react";
import BottomSheet from "../components/Modals/BottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlexButton from "../components/Buttons/FlexButton";
import io from 'socket.io-client';
import TransparentSheet from "../components/Modals/TransparentSheet.";
import { current } from "@reduxjs/toolkit";

const SERVER_URL = 'ws://10.0.0.173:5000';

function Home() {

  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    const initializeSocket = async () => {
      try {
        const token = await retrieveTokenFromAsyncStorage();
        if (token) {
          const newSocket = io(SERVER_URL, {
            auth: {
              token,
            },
          });
          setSocket(newSocket);
          newSocket.on('connect', () => {
            console.log('Socket connected');
          });
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();
  }, [])


  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGIyM2U2ODVlNzU4ZmM0YzFlMGU2ZSIsImlhdCI6MTcxMDQ0MzUyOCwiZXhwIjoxNzExMzA3NTI4fQ.HAym6ciuWr67c4ZqfVz-_x5xOU_YjVSI6zXZGTX0qts"
  const [deliveringOrdersCount, setDeliveringOrdersCount] = useState(countDeliveringOrders(orders));


  // const socket = io(SERVER_URL);

  // useEffect(()=>{
  //   // socket.on('update', (data) => {
  //   //   console.log(data)
  //   // });
  //   connectSocket()
  // },[])

  useEffect(() =>{
    if(socket){
      socket.on('delivered', (data) => {
        console.log("here")
        const deliveringOrders = orders.filter(order => order.status === "Delivering");

    if (deliveringOrders.length === 0) {
        return null; // Return null if there are no delivering orders
    }

    let earliestOrder = deliveringOrders[0];
    let earliestTimestamp = new Date(earliestOrder.date).getTime(); // Convert the first date to a timestamp

    deliveringOrders.forEach(order => {
        const timestamp = new Date(order.date).getTime(); // Convert the date to a timestamp
        if (timestamp < earliestTimestamp) {
            earliestOrder = order;
            earliestTimestamp = timestamp;
        }
    });
      date = getTodaysDate()
          dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'status', perform: 'Delivered'} }))
          dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'date', perform: date} }))

      });

      return () => {
        socket.off('delivered'); // Remove 'message' event listener
        // Remove other event listeners as needed
      };
    }

  }, [socket])
  
  const retrieveTokenFromAsyncStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken !== null) {
        return storedToken;
      } else {
        console.log("Token not found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };



  const [barStyle, setBarStyle] = useState("light-content");
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
  const orders = useSelector((state) => state.cartItems.order)
  const [isVisible, setIsVisible] = useState(false);
  const [option, setOption] = useState();
  const ref = useRef(null);
  const reg = useRef(null);
  function createFoodDictionary(foodArray) {
    let foodDictionary = {};
    for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
    }
    return foodDictionary;
  }
  // Example usage:
  let [foodStore, setFood] = useState({});


  function orderHandler(){
    navigation.navigate('Order History')
  }
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
  const [pro, setPro] = useState({});
  // useEffect(() => {
  //   console.log("hit the useEffect");
  //   // fetchData();
  // }, []);
  function countDeliveringOrders(orders) {
    if (!orders){
      return
    }
    // Initialize a counter variable
    let count = 0;

    // Iterate through the orders array
    for (let i = 0; i < orders.length; i++) {
      // Check if the status of the order is "Delivering"
      if (orders[i].status === "Delivering") {
        // If the status is "Delivering", increment the counter
        count++;
      }
    }

    // Return the count of "Delivering" orders
    return count;
  }
  // deliveringOrdersCount = countDeliveringOrders(orders);
  useEffect(()=>{
    setBlink(true)
    setDeliveringOrdersCount(countDeliveringOrders(orders))
  }, [orders])

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
  const [selected, setSelected] = useState([])
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
    setBlink(true)

    setFoodDictionary(foodStore)
    dispatch(addToCart({id : {title: pro.title, ...{...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
  }
  function handleBuy(){
    let price = 0;
    let newItem ={}
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
    setBlink(true)
    setFoodDictionary(foodStore)
    dispatch(addToCart({id : {title: pro.title, ...{...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
    navigation.navigate('Checkout')
  }

//   useEffect(()=>{
//     if (plus.length == 2){
//       let price = 0
//       for (var i = 0; i < plus.length; i ++){
//           price += findPrice(plus[i])
//         }
//       dispatch(addToCart({ id: {...pro, ['oldPrice']: pro['oldPrice']+price} }))
//       dispatch(addOptions({id: {'title': pro.title, 'options': {'Sides' : plus}}}))

//         setPlus([])
//         ref?.current?.scrollTo(0)
//         setFoodDictionary(foodStore)
//     }
// },[plus])
const [blink, setBlink] = useState(true)
function getTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return today.toString();
}
const timer = useRef()
// useEffect(()=>{if (deliveringOrdersCount > 0){timer.current = setTimeout(()=>{setBlink((prev)=> !prev)},5)}})
  function handleAddToCart(product) {
    setPro(product)
    setPlus([])
    if (product.extras){
      setExtra(product.extras)
      setFoodDictionary(createFoodDictionary(product.extras))

  }

  if (product.extras || product.options ){

    ref?.current?.scrollTo(-570);
    setBlink(false)
    }else{
    dispatch(addToCart({ id: product }));
    // const deliveringOrders = orders.filter(order => order.status === "Delivering");

    // if (deliveringOrders.length === 0) {
    //     return null; // Return null if there are no delivering orders
    // }

    // let earliestOrder = deliveringOrders[0];
    // let earliestTimestamp = new Date(earliestOrder.date).getTime(); // Convert the first date to a timestamp

    // deliveringOrders.forEach(order => {
    //     const timestamp = new Date(order.date).getTime(); // Convert the date to a timestamp
    //     if (timestamp < earliestTimestamp) {
    //         earliestOrder = order;
    //         earliestTimestamp = timestamp;
    //     }
    // });
    // console.log(earliestOrder.id)
    // date = getTodaysDate()
    // dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'status', perform: 'Delivered'} }))
    // dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'date', perform: date} }))


  }
  }
  function handleScroll(event) {
    setIsVisible(event.nativeEvent.contentOffset.y > 103);
   }
   reg?.current?.scrollTo(-1*height/5)
  return (
    <SafeAreaProvider>
      {/* <StatusBar hidden={false} barStyle={barStyle} /> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{}}><LinearGradient
            // colors={["#19171A", "#01418D", "#2873CC"]}
            // colors={["#19171A", "#2F5A8C", "#2873CC"]}
            colors={["#4F6B30", "#425928", "#354820", '#283618']}
            // style={{ borderBottomEndRadius: 20, borderBottomLeftRadius: 20 }}
          >
            <SafeAreaView onTouchStart={()=>{ref?.current?.scrollTo(0); setBlink(true)}} style={styles.top}>
              <View
                style={[styles.top,{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: 'center',
                  paddingHorizontal: "5%",
                  paddingTop: "3%",
                }]}
              >
                {<View style={{ gap: 6, justifyContent: 'center', }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      letterSpacing: 0.4,
                      fontWeight: 900,
                    }}
                  >
                    {greeting}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: 1,
                    }}
                  >{`${data.firstName} `}</Text>
                  {/* >{`${data.firstName} ${data.secondName}`}</Text> */}
                </View>}
                
                <View style={[styles.cart, {width: 50, height: 40}]}>
                  <Pressable
                    onPress={cartHandler}
                  >
                    <View>
                      <Feather name="shopping-cart" size={20} color="white" />
                    </View>

                    {cartItems.length > 0 && (
                      <View
                        style={{
                          height: "85%",
                          minWidth: "35%",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          zIndex: 2,
                          top: -10,
                          rigth:  -90,
                          borderRadius: 100,
                          backgroundColor: "#425928",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {cartItems.length}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
              <Pressable
                style={[styles.search, { marginTop: 10 }]}
                onPress={() => navigation.navigate("Search")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 20,
                    backgroundColor: "white",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  <EvilIcons name="search" size={24} color="black" />
                  <Text
                    style={{ color: "black", fontSize: 16, fontWeight: 500 }}
                  >
                    Search RoomService
                  </Text>
                </View>
                
                {/* <Input
            onInteract={()=> navigation.navigate('Search')}
            color={"white"}
            icon={<EvilIcons name="search" size={24} color="white" />}
            text={"Search items"}
          ></Input> */}
              </Pressable>
              <View style={{ marginTop: 0, paddingBottom: 1, height: height/30}}>
              {isVisible && <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={{ flexDirection: 'row',
        gap: 34,paddingLeft: 20
        }}>
        {[
                  { text: "Alcohol", image: require("../assets/Alcohol.png") },
                  { text: "Frozen", image: require("../assets/frozen.png") },
                  {
                    text: "Ice Cream",
                    image: require("../assets/icecream.png"),
                  },
                  { text: "Food", image: require("../assets/food.png") },
                  { text: "Snacks", image: require("../assets/snack.png") },
                ].map(({text, image},index) => <Pressable key={index}><Text style={{fontWeight: "bold", fontSize: 14, textAlign: "center" , color: 'white'}}>{text}</Text></Pressable>)}
        </View>
    </ScrollView>}
              </View>
            </SafeAreaView>
          </LinearGradient>
          <ScrollView
          scrollEventThrottle={16}
          onScroll={(e)=>handleScroll(e)}
          onTouchStart={()=>{ref?.current?.scrollTo(0)}}
           style={{ backgroundColor: "white" }}>
            {<LinearGradient
            // colors={["#19171A", "#01418D", "#2873CC"]}
            // colors={["#19171A", "#2F5A8C", "#2873CC"]}
            colors={['#283618', '#283618']}
            // style={{ borderBottomEndRadius: 20, borderBottomLeftRadius: 20 }}
          ><View style={{ marginBottom: 5}}>
              <ItemCategory
                items={[
                  { text: "Alcohol", image: require("../assets/Alcohol.png") },
                  { text: "Frozen", image: require("../assets/frozen.png") },
                  {
                    text: "Ice Cream",
                    image: require("../assets/icecream.png"),
                  },
                  { text: "Food", image: require("../assets/food.png") },
                  { text: "Snacks", image: require("../assets/snack.png") },
                ]}
                color="white"
                show ={!isVisible}
              />
              </View></LinearGradient>}
            <View style={[styles.horizontalCat, { marginTop: 2 }]}>
              {/* <View style={styles.catHead}>
                <Text style={styles.text}>Popular Categories</Text>
                <Pressable onPress={chooseHandler}>
                  <Text style={{ color: "#BC6C25", fontSize: 12 }}>
                    See All
                  </Text>
                </Pressable>
              </View> */}

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
              <ScrollView horizontal={true} style={{ height: 200}}>
                <View
                  style={{ flexDirection: "row", flexWrap: "nowrap", gap: 15, justifyContent: "center", alignItems: "center" }}
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
                items={categoryObject["food"].slice(0, 6)}
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
              <View
                style={{ flexDirection: "row", flexWrap: "nowrap", gap: 15 }}
              >
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
                                <Pressable onPress={()=>toggleNumberInArray(idx)}>
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
       {blink && deliveringOrdersCount > 0 && <TransparentSheet ref={reg}>
          <LinearGradient locations={[0.12, 0.2, 0.4, 0.1]} colors={["#4F6B30", "#425928", "#354820", '#283618']} style={{ borderTopLeftRadius: width*3,borderTopRightRadius: width*3, alignItems: 'center', justifyContent: 'start',paddingTop: height/12, height: height/2, width: width * 2, alignSelf: 'center'}}>{deliveringOrdersCount >= 1 && <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            
                  <Pressable onPress={()=>{setBlink(false)}} style={{width: width/5.9}} >
                   <MaterialCommunityIcons name="close" size={35} color="white" />
                  </Pressable>
                  <View>
                    <Text style={{ fontWeight: 900, color: 'white'}}>{`You have ${deliveringOrdersCount} ${deliveringOrdersCount > 1 ? 'orders' : "order"} being delivered sit tight!!`}</Text>
                    <View style={{height: 40, width: 124, alignSelf: 'flex-end',}}><FlexButton onPress={orderHandler} color={'#283618'}  background={"white"} ><Text style={{fontSize: 12, fontWeight: 900, color: 'black'}}>View Orders</Text></FlexButton></View>
                  </View>
                   </View>}</LinearGradient>
         
        </TransparentSheet>}
      </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // backgroundColor: "#283618",
    // borderWidth: 4,
  },
  top: {
    // backgroundColor: "white",
    // borderWidth: 4,
  },
  search: {
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingBottom: 5,
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
    borderRadius: 10,
    backgroundColor: '#283618',
    // backgroundColor: "#023C72",
    borderColor: "white",
    // borderWidth: 1
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
