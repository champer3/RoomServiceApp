import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
  Button,
  Animated
} from "react-native";
import Text from '../components/Text';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ItemCategory from "../components/Category/ItemCategory";
import AntDesign from '@expo/vector-icons/AntDesign';
import Svg, {Path} from 'react-native-svg';
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
import { addToCart, removeFromCart, addOptions,  } from "../Data/cart";
import {fetchOrders, updateOrder} from "../Data/order"
import { useEffect, useState, useRef } from "react";
import BottomSheet from "../components/Modals/BottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlexButton from "../components/Buttons/FlexButton";
import io from 'socket.io-client';
import TransparentSheet from "../components/Modals/TransparentSheet.";
import axios from "axios";
import { initializeSocket, getSocket, disconnectSocket } from '../socketService';
import { current } from "@reduxjs/toolkit";
import {fetchProducts} from "../Data/Items"
import ItemSmallCategory from "../components/Category/ItemSmallCategory";
// const SERVER_URL = 'ws://192.168.179.1:3000';
// const SERVER_URL = 'http://10.0.0.173:3000';
 const SERVER_URL="https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/"



const FadeOutView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 1

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 0,
        useNativeDriver: true, // Add this line to improve performance
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};
const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // Add this line to improve performance
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

function Home() {
  
  const [socket, setSocket] = useState(socket);
  const address = useSelector((state) => state.profileData.profile).address[0]

  useEffect(() => {
    const setupSocket = async () => {
      const token = await retrieveTokenFromAsyncStorage();
      console.log('Token:', token);

      await initializeSocket(token);
    }
    setupSocket();

    return () => {
      disconnectSocket(); // Clean up the socket on component unmount
    };
    // const initializeSocket = async () => {
    //   try {
    //     const token = await retrieveTokenFromAsyncStorage();
    //     // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRiYWY2NmVjYWE0MWUyODQwYjZlNiIsImlhdCI6MTcxMjE3NTg2MiwiZXhwIjoxNzEzMDM5ODYyfQ.C8dASXQn_jHO0tBGd7-wnFWOfpWwwTSED-xqcpc7oVU"
    //     console.log(token)
    //     console.log("Did we even get here?")
    //     const newSocket = io(SERVER_URL, {
    //       query: { token }
    //     });
    //     // console.log("New socket in the local backend",newSocket);
    //     setSocket(newSocket);

    //     newSocket.on('connect', () => {
    //       console.log('Connected to server');
    //     });
    //   } catch (error) {
    //     console.error('Error initializing socket:', error);
    //   }
    // };

    // initializeSocket();
  }, [])


  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGIyM2U2ODVlNzU4ZmM0YzFlMGU2ZSIsImlhdCI6MTcxMDQ0MzUyOCwiZXhwIjoxNzExMzA3NTI4fQ.HAym6ciuWr67c4ZqfVz-_x5xOU_YjVSI6zXZGTX0qts"
  const [deliveringOrdersCount, setDeliveringOrdersCount] = useState(countDeliveringOrders(orders));



  // useEffect(()=>{
  //   const socket = io(SERVER_URL);

  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  // });

  // socket.on('message', (data) => {
  //   console.log('Received message:', data);
  // Handle incoming messages from the server
  // });


  // connectSocket()
  // },[])

  useEffect(() =>{
    if(socket){
      socket.on('orderInDelivery', (data) => {})
      socket.on('Devlivered', (data) => {})
    //   socket.on('Delivered', (data) => {
    //     console.log("here6556477")
    //     const deliveringOrders = orders.filter(order => order.status === "Delivering");

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
    // console.log("orders",deliveringOrders)
    // console.log("order",orders)
    //   date = getTodaysDate()
    //       dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'status', perform: 'Delivered'} }))
    //       dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'date', perform: date} }))

    //   });

    //   return () => {
    //     socket.off('delivered'); // Remove 'message' event listener
    //     // Remove other event listeners as needed
    //   };
      socket.on('Out for Delivery', (data) => {
        const deliveringOrders = orders.filter(order => order.status === "Ready for Delivery");

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
    console.log("orders",deliveringOrders)
    console.log("order",orders)
      date = getTodaysDate()
          dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'status', perform: 'Delivered'} }))
          dispatch(updateOrder({ id: {uid : earliestOrder.id, act: 'date', perform: date} }))

      });

      return () => {
        socket.off('delivered'); // Remove 'message' event listener
        // Remove other event listeners as needed
      };
    }

  })

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
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }
  const orders = useSelector((state) => state.orders.ids)
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


  function orderHandler() {
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
    if (!orders) {
      return
    }
    // Initialize a counter variable
    let count = 0;

    // Iterate through the orders array
    for (let i = 0; i < orders.length; i++) {
      // Check if the status of the order is "Delivering"
      if (orders[i].status === "Out for Delivery") {
        // If the status is "Delivering", increment the counter
        count++;
      }
    }

    // Return the count of "Delivering" orders
    return count;
  }

  const tryCreateOrder = async () => {
    try {
      const token = await retrieveTokenFromAsyncStorage();
      console.log(token)
      const order = await axios.get(
        "https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/get-your-orders",
        // "http://10.0.0.173:3000/api/v1/orders",
       
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          },
        }
      );
      return order
    } catch (error) {
      console.log(error);
    }
  };

  // deliveringOrdersCount = countDeliveringOrders(orders);
  useEffect(() => {
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
  // console.log(categoryObject)
  const [selected, setSelected] = useState([])
  function toggleNumberInArray(number) {
    setSelected((prev) => {
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
  function handleUpdate() {
    let price = 0;
    let newItem = {}
    if (plus && plus.length > 0) {
      for (var i = 0; i < plus.length; i++) {
        price += findPrice(plus[i])
      }
      newItem = { ...newItem, ...{ 'Sides': plus } }
    }
    if (option != undefined) {
      newItem = { ...newItem, ... { 'Picked': pro.options[option] } }
    }
    if (selected && selected.length > 0) {
      newItem = { ...newItem, ... { 'Flavour': selected } }
    }
    setPlus([])
    setOption()

    ref?.current?.scrollTo(0)
    setBlink(true)

    setFoodDictionary(foodStore)
    dispatch(addToCart({ id: { title: pro.title, ...{ ...pro, ...newItem, ['oldPrice']: pro.oldPrice + price } } }))
  }
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= 5) {
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      Animated.spring(animatedValue, {
        toValue: nextIndex * (width+5) ,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, 5, animatedValue]);

  useEffect(() => {
    animatedValue.addListener(({ value }) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: value, animated: true });
      }
    });
  }, [animatedValue]);

  function handleBuy() {
    let price = 0;
    let newItem = {}
    if (plus && plus.length > 0) {
      for (var i = 0; i < plus.length; i++) {
        price += findPrice(plus[i])
      }
      newItem = { ...newItem, ...{ 'Sides': plus } }
    }
    if (option != undefined) {
      newItem = { ...newItem, ... { 'Picked': pro.options[option] } }
    }
    if (selected && selected.length > 0) {
      newItem = { ...newItem, ... { 'Flavour': selected } }
    }
    setPlus([])
    setOption()

    ref?.current?.scrollTo(0)
    setBlink(true)
    setFoodDictionary(foodStore)
    dispatch(addToCart({ id: { title: pro.title, ...{ ...pro, ...newItem, ['oldPrice']: pro.oldPrice + price } } }))
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
    if (product.extras) {
      setExtra(product.extras)
      setFoodDictionary(createFoodDictionary(product.extras))

    }

    if (product.extras || product.options) {

      ref?.current?.scrollTo(-570);
      setBlink(false)
    } else {
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
    setIsVisible(event.nativeEvent.contentOffset.y > 223);
  }
  reg?.current?.scrollTo(-1 * height / 4.7)
  return (
    <SafeAreaProvider>
      {/* <StatusBar hidden={false} barStyle={barStyle} /> */}
      <GestureHandlerRootView style={{ flex: 1 , }}>
        <LinearGradient
          // colors={["#19171A", "#01418D", "#2873CC"]}
          // colors={["#19171A", "#2F5A8C", "#2873CC"]}
          style= {{flex: 1,}}
          locations={[0.05, 0.1, 0.15, 0.2,  0.6,]}
          colors={['#283618',"#354820", "#425928","#4F6B30" ,  '#F0F0F0'   ]}><View
          // colors={["#19171A", "#01418D", "#2873CC"]}
          // colors={["#19171A", "#2F5A8C", "#2873CC"]}
          // locations={[0.1375, 0.275, 0.3125, 0.80, 1]}
          // colors={[]}
          style={{justifyContent: 'flex-end'}}
        // style={{ borderBottomEndRadius: 20, borderBottomLeftRadius: 20 }}
        >
          <SafeAreaView onTouchStart={() => { ref?.current?.scrollTo(0); setBlink(true) }} style={styles.top}>
            {!isVisible && <View
              style={[styles.top, {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                paddingHorizontal: "5%",
                paddingTop: "3%",
              }]}
            >
             
              {<View style={{  justifyContent: 'center', }}>
              <Text style={{color: 'white', fontSize: 15}}>{greeting} {data.firstName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                 
                </View>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                  <View>
               { <Text
                  style={{
                    color: "white",
                    fontSize: 9,
                    width: 250,
                    letterSpacing: 1,
    
                  }}
                  
                >
                  {address.address}
                </Text>}
                </View>
                
                </View>
                {/* >{`${data.firstName} ${data.secondName}`}</Text> */}
              </View>}
                  <View style={{flexDirection: 'row',gap: 12}}>
                  <View style={[styles.cart, { width: 40, height: 40, 
              shadowColor: '#000',
              shadowOffset: { width: 10, height: 7 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5, // Ad
              }]}>
                <Pressable
                  onPress={cartHandler}
                >
                  <View>
                  <Svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><Path fill={"#425928"} d="M282.6 40.1C214 15.1 138 50.4 112.8 119L98.2 159C84 197.8 57.6 231 23 253.7L14.9 259C4.7 265.7-.8 277.5 .6 289.5s9.4 22.2 20.8 26.3l230.5 83.9 1.1-3.9c2.6-9.1 4.4-18.4 5.4-27.7l-226-82.3 8.2-5.4c40.3-26.5 71.1-65.2 87.7-110.4l14.7-40c18.7-51 74.5-77.7 125.7-60.9c8.4-8.6 17.7-16.3 27.9-23c-4.5-2.2-9.1-4.2-13.9-6zm71.1 48.4c54.8-19.9 115.4 8.3 135.5 63L508 202.6c16.3 44.6 46.4 82.8 85.9 109.2l13.7 9.2s0 0 0 0L310.1 429.3l4.6-15.8c13.1-45.6 11.3-94.1-5-138.7l-18.8-51.2c-20.1-54.7 8.1-115.2 62.8-135.2zm165.5 52C493.2 69.2 414.1 32.5 342.8 58.4s-108 104.8-81.9 176.2l18.8 51.2c14 38.2 15.5 79.8 4.3 118.9l-4.6 15.8c-3.3 11.6 .1 24 9 32.2s21.5 10.8 32.8 6.7L618.6 351.1c11.3-4.1 19.4-14.2 20.8-26.2s-4-23.7-14-30.4l-13.7-9.2c-33.8-22.7-59.6-55.4-73.6-93.6l-18.8-51.2zM434.8 437.6c-6.7 5.8-7.4 15.9-1.6 22.6C450.5 480.1 479 488 505 477.8s41.5-35.5 40.5-61.8c-.3-8.8-7.7-15.7-16.6-15.4s-15.7 7.7-15.4 16.6c.5 13.2-7.3 25.8-20.3 30.9s-27.2 1.2-35.9-8.8c-5.8-6.7-15.9-7.4-22.6-1.6zM179.9 406.7c-8.7 10-23 13.9-35.9 8.8s-20.7-17.7-20.3-30.9c.3-8.8-6.6-16.2-15.4-16.6s-16.2 6.6-16.6 15.4c-.9 26.3 14.6 51.6 40.5 61.8s54.5 2.3 71.8-17.6c5.8-6.7 5.1-16.8-1.6-22.6s-16.8-5.1-22.6 1.6z"/></Svg>
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
                        top: -15,
                        left: -13,
                        width: 25,
                        height: 25,
                        shadowColor: 'black',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 2,
                        elevation: 3,
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
              <View style={[styles.cart, { width: 40, height: 40, 
              shadowColor: '#000',
              shadowOffset: { width: 10, height: 7 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5, // Ad
              }]}>
                <Pressable
                  onPress={cartHandler}
                >
                  <View>
                  <Svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><Path fill={"#425928"} d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16l37.9 0c7.6 0 14.2 5.3 15.7 12.8l58.9 288c6.1 29.8 32.3 51.2 62.7 51.2L496 384c8.8 0 16-7.2 16-16s-7.2-16-16-16l-304.8 0c-15.2 0-28.3-10.7-31.4-25.6L152 288l314.6 0c29.4 0 55-20 62.1-48.5L570.6 71.8c5-20.2-10.2-39.8-31-39.8L99.1 32C92.5 13 74.4 0 53.9 0L16 0zm90.1 64l433.4 0L497.6 231.8C494 246 481.2 256 466.5 256l-321.1 0L106.1 64zM168 456a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm80 0a56 56 0 1 0 -112 0 56 56 0 1 0 112 0zm200-24a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm0 80a56 56 0 1 0 0-112 56 56 0 1 0 0 112z"/></Svg>
                  </View>

                  {cartItems.length > 0 && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        zIndex: 2,
                        top: -15,
                        left: -13,
                        width: 25,
                        height: 25,
                        shadowColor: 'black',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 2,
                        elevation: 3,
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
            </View>}
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
                  borderRadius: 25,
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}
              >
                <EvilIcons name="search" size={24} color="#aaa" />
                <Text
                  style={{ color: "#aaa", fontSize: 16, fontWeight: 500 }}

                >
                  What would you like??
                </Text>
              </View>
            </Pressable>
            
            <View style={{ marginTop: 0, paddingBottom: 1 }}>
              {isVisible && <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <FadeInView style={{marginVertical: 5, marginTop: 8}}>
       <ItemSmallCategory
                  items={[
                    { text: "Alcohol", image: require("../assets/Alcohol.png") },
                    {
                      text: "Ice Cream",
                      image: require("../assets/icecream.png"),
                    },
                    { text: "Food", image: require("../assets/food.png") },
                    { text: "Frozen", image: require("../assets/frozen.png") },
                    { text: "Snacks", image: require("../assets/snack.png") },
                  ]}
                  color="white"
                  show={!isVisible}
                />
      </FadeInView>
    </ScrollView>}
              {!isVisible && <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <FadeOutView style={{ marginVertical: 12  }}>
       
      </FadeOutView>
    </ScrollView>}
              </View>
          
            </SafeAreaView>
          </View>
          <View style={{  flex: 1 ,}}>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => handleScroll(e)}
            bounces={false}
            style={{}}
            onTouchStart={() => { ref?.current?.scrollTo(0) }}
            >

           <View style={{  backgroundColor: '#F0F0F0',  }}>
  <ScrollView
    ref={scrollViewRef}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scrollViewContent}
  >
    <View style={{flexDirection: "row", flexWrap: "nowrap", gap: 5}}>
      {[
  require('../assets/deal1.png'),
  require('../assets/deal3.png'),
  require('../assets/deal2.png'),
  require('../assets/deal4.png'),
  require('../assets/deal5.png'),
  require('../assets/deal1.png'),
].map((image, index) => (
        <Pressable key={index}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={image}
              resizeMode="contain"  // or "contain", depending on the effect you want
            />
          </View>
        </Pressable>
      ))}
    </View>
  </ScrollView>
</View>

            <View style={{marginBottom: 10  }}>
                <ItemCategory
                  items={[
                    { text: "Alcohol", image: require("../assets/Alcohol.png") },
                    {
                      text: "Ice Cream",
                      image: require("../assets/icecream.png"),
                    },
                    { text: "Food", image: require("../assets/food.png") },
                    { text: "Snacks", image: require("../assets/snack.png") },
                  ]}
                  color="white"
                  show={!isVisible}
                />
              </View>
              <View style={{ gap: 10, marginBottom: 50}}>
  {Object.keys(categoryObject).map((categoryKey) => (
    <ProductHorizontal
      key={categoryKey}
      categoryName={categoryKey}
      items={categoryObject[categoryKey]}
    />
  ))}
</View>
          </ScrollView>
          </View>
          
        
          {blink && deliveringOrdersCount > 0 && <TransparentSheet ref={reg}>
            <LinearGradient locations={[0.2, 0.7, 0.9, 0.6]} colors={["#4F6B30", "#425928", "#354820", '#283618']} style={{ borderTopLeftRadius: width * 3, borderTopRightRadius: width * 3, alignItems: 'center', justifyContent: 'start', paddingTop: height / 13, height: height, width: width * 2, alignSelf: 'center' }}>{deliveringOrdersCount >= 1 && <Pressable onPress={orderHandler} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

              <Pressable onPress={() => { setBlink(false) }} style={{ width: width / 5.9 }} >
                <MaterialCommunityIcons name="close" size={35} color="white" />
              </Pressable>
              <View>
                <Text style={{ fontWeight: 900, fontSize: 16, color: 'white', textAlign: 'center' }}>{`You have ${deliveringOrdersCount} ${deliveringOrdersCount > 1 ? 'orders' : "order"} being delivered \nsit tight!!`}</Text>
                {/* <View style={{height: 40, width: 124, alignSelf: 'flex-end',}}><FlexButton onPress={} color={'white'}  background={"white"} ><Text style={{fontSize: 12, fontWeight: 900, color: 'black'}}>View Orders</Text></FlexButton></View> */}
              </View>
            </Pressable>}</LinearGradient>

          </TransparentSheet>}
        </LinearGradient>
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
    // paddingBottom: 5,
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
    backgroundColor: 'white',
    // backgroundColor: "#023C72",
    borderColor: "white",
    // borderWidth: 1
  }, imageContainer: {
    width: width,
    
    maxHeight: 150, // Set a fixed height
    // Optional: Add border radius if desired
    overflow: 'hidden', // Ensures the image stays within the container
  },
  image: {
    width: '100%',
    borderRadius: 10,
    maxHeight: 150, 
  },
  scrollViewContent: {
    borderRadius: 10,
    
    alignItems: 'center',
  },
  deals: {
    marginVertical: 16,
    marginHorizontal: "2%",
    flexDirection: "row",
  },
  horizontalCat: {
    width: "100%",
    // paddingHorizontal: "2%",
    paddingTop: 4
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

// <BottomSheet ref={ref}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 400 }}>
//     {pro.addOn && <View style={{ gap: 25, paddingTop: 30, marginBottom: 50 }}>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         <Text style={{ color: "black", fontWeight: "900", fontSize: 19, }}>{'Choose Exotic Flavor'}</Text>
//         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//       </View>
//       <Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>{`Choose up to ${2}`}</Text>
//       {pro.extras.map((item, idx) => <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15 }}>
//         <View>
//           <Text style={{ color: "black", fontWeight: "900", fontSize: 16, }}>{item}</Text>
//         </View>
//         <Pressable onPress={() => toggleNumberInArray(idx)}>
//           <MaterialCommunityIcons name={`${selected.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"}`} size={24} color={`${selected.length < 2 || selected.indexOf(idx) !== - 1 ? 'black' : 'rgba(0,0,0,0.05)'}`} />
//         </Pressable>
//       </View>)}

//     </View>}
//     {pro.options && <View><View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, alignItems: 'center' }}>
//       <Text style={{ color: "black", fontWeight: "900", fontSize: 19, }}>{'Choose One'}</Text>
//       {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//       <View style={{ width: width / 3.7, height: '170%' }}>
//         <FlexButton onPress={option >= 0 ? handleUpdate : () => { }} background={option == undefined ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Add</Text></FlexButton>
//       </View>
//       <View style={{ width: width / 3.7, height: '170%' }}>
//         <FlexButton onPress={option >= 0 ? handleBuy : () => { }} background={option == undefined ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Buy now</Text></FlexButton>
//       </View>
//     </View>
//       <View style={{ padding: 6, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.1)', width: width / 5, alignItems: 'center' }}><Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>Required</Text></View>
//       {pro.options.map((item, idx) => <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13, }}>
//         <View>
//           <Text style={{ color: "black", fontWeight: "900", fontSize: 16, }}>{item}</Text>
//         </View>
//         <Pressable onPress={() => { setOption(idx) }}>
//           <Ionicons name={`${idx == option ? "radio-button-on" : "radio-button-off"}`} size={24} color="black" />
//         </Pressable>
//       </View>)}</View>}
//     {pro.nutrient && pro.nutrient == 'protein' && <View style={{ gap: 25, paddingTop: 30 }}>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Text style={{ color: "black", fontWeight: "900", fontSize: 19, }}>{'Pick Your Sides'}</Text>
//         <View style={{ width: width / 4.7, height: '170%' }}>
//           <FlexButton onPress={plus.length == 2 ? handleUpdate : () => { }} background={plus.length < 2 ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Add</Text></FlexButton>
//         </View>
//         <View style={{ width: width / 3.8, height: '170%' }}>
//           <FlexButton onPress={plus.length == 2 ? handleBuy : () => { }} background={plus.length < 2 ? "rgba(0,0,0,0.5)" : '#283618'}><Text style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>Buy now</Text></FlexButton>
//         </View>

//       </View>
//       <Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>{`Choose ${2}`}</Text>
//       <View style={{ padding: 6, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.1)', width: width / 5, alignItems: 'center' }}><Text style={{ color: "black", fontWeight: "bold", fontSize: 13, }}>Required</Text></View>
//       {pro.extras.map((item, idx) => <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15 }}>
//         <View>
//           <Text style={{ color: "black", fontWeight: "900", fontSize: 16, }}>{item[0]}</Text>
//           <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
//         </View>
//         {(plus.length < 2 || (plus.length && plus.indexOf(item[0]) !== -1)) && <View>
//           <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={() => { if (plus.length < 2) { setFoodDictionary((prev) => { return { ...prev, [item[0]]: foodDictionary[item[0]] + 1 } }); setPlus((prev) => { const arr = [...prev]; arr.push(item[0]); return arr }) } }} onDecrease={() => { if (plus.length > 0) { setFoodDictionary((prev) => { return { ...prev, [item[0]]: (foodDictionary[item[0]] ? foodDictionary[item[0]] : 1) - 1 } }); setPlus((prev) => { const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1) { arr.splice(index, 1) }; return arr }) } }} />
//         </View>}
//       </View>)}

//     </View>}
//     {pro.instructions && <View
//       style={{ color: 'white', backgroundColor: 'white' }}><TextInput
//         multiline
//         placeholder="Special Instructions?"
//         cursorColor={'#aaa'}
//         numberOfLines={6}
//         clearButtonMode="always"
//         style={{ paddingHorizontal: 10 }}
//       /></View>
//     }</View>
// </ScrollView>
// </BottomSheet>