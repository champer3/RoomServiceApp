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
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlexButton from "../components/Buttons/FlexButton";
import io from 'socket.io-client';
import TransparentSheet from "../components/Modals/TransparentSheet.";
import { current } from "@reduxjs/toolkit";

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

  const [socket, setSocket] = useState(null);
  const address = useSelector((state) => state.profileData.profile)
  console.log(address)

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await retrieveTokenFromAsyncStorage();
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRiYWY2NmVjYWE0MWUyODQwYjZlNiIsImlhdCI6MTcxMjE3NTg2MiwiZXhwIjoxNzEzMDM5ODYyfQ.C8dASXQn_jHO0tBGd7-wnFWOfpWwwTSED-xqcpc7oVU"
        console.log(token)
        const newSocket = io(SERVER_URL, {
          query: { token }
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
          console.log('Connected to server');
        });
        // console.log(token)
        // if (token) {
        //   const newSocket = io(SERVER_URL, {
        //     auth: {
        //       token,
        //     },
        //   });
        //   // setSocket(newSocket);
        //   newSocket.on('connect', () => {
        //     console.log('Connected to server');
        //   });
        // }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();
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
      socket.on('delivered', (data) => {
        console.log("here6556477")
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
      if (orders[i].status === "Delivering") {
        // If the status is "Delivering", increment the counter
        count++;
      }
    }

    // Return the count of "Delivering" orders
    return count;
  }
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
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const startScrolling = () => {
      scrollX.setValue(0); // Reset the animation value

      const scrollAnimation = Animated.loop(
        Animated.timing(scrollX, {
          toValue: width*4.15,
          duration: 40000, // 3 seconds per image
          useNativeDriver: true,
        })
      ).start();

      const listenerId = scrollX.addListener(({ value }) => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: value,
            animated: false,
          });
        }
      });
      
      // return () => {
      //   scrollAnimation.stop();
      //   scrollX.removeListener(listenerId);
      // };
    };

    startScrolling();
  }, [scrollX]);
  
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
    setIsVisible(event.nativeEvent.contentOffset.y > 103);
  }
  reg?.current?.scrollTo(-1 * height / 4.7)
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
          <SafeAreaView onTouchStart={() => { ref?.current?.scrollTo(0); setBlink(true) }} style={styles.top}>
            <View
              style={[styles.top, {
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

              <View style={[styles.cart, { width: 50, height: 40 }]}>
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
                        rigth: -90,
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
            <View style={{ marginTop: 0, paddingBottom: 1, height: height / 30 }}>
              {isVisible && <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <FadeInView style={{  flexDirection: 'row',
        gap: 35,paddingLeft: 17 }}>
        {[
                  { text: "Alcohol", image: require("../assets/Alcohol.png") },
                  { text: "Frozen", image: require("../assets/frozen.png") },
                  {
                    text: "Ice Cream",
                    image: require("../assets/icecream.png"),
                  },
                  { text: "Food", image: require("../assets/food.png") },
                  { text: "Snacks", image: require("../assets/snack.png") },
                ].map(({text, image},index) => <Pressable onPress={()=> {navigation.navigate('Category', {cat: text})}} key={index}><Text style={{fontWeight: "bold", fontSize: 13, textAlign: "center" , color: 'white'}}>{text}</Text></Pressable>)}
      </FadeInView>
    </ScrollView>}
              {!isVisible && <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <FadeOutView style={{  flexDirection: 'row',
        gap: 35,paddingLeft: 17 }}>
        {[
                  { text: "Alcohol", image: require("../assets/Alcohol.png") },
                  { text: "Frozen", image: require("../assets/frozen.png") },
                  {
                    text: "Ice Cream",
                    image: require("../assets/icecream.png"),
                  },
                  { text: "Food", image: require("../assets/food.png") },
                  { text: "Snacks", image: require("../assets/snack.png") },
                ].map(({text, image},index) => <Pressable onPress={()=> {navigation.navigate('Category', {cat: text})}} key={index}><Text style={{fontWeight: "bold", fontSize: 13, textAlign: "center" , color: 'white'}}>{text}</Text></Pressable>)}
      </FadeOutView>
    </ScrollView>}
              </View>
            </SafeAreaView>
          </LinearGradient>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => handleScroll(e)}
            bounces={false}
            onTouchStart={() => { ref?.current?.scrollTo(0) }}
            style={{ backgroundColor: "white" }}>
            {<LinearGradient
              // colors={["#19171A", "#01418D", "#2873CC"]}
              // colors={["#19171A", "#2F5A8C", "#2873CC"]}
              colors={['#283618', '#283618']}
            // style={{ borderBottomEndRadius: 20, borderBottomLeftRadius: 20 }}
            ><View style={{marginBottom: 5  }}>
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
                  show={!isVisible}
                />
              </View></LinearGradient>}
            <View style={[styles.horizontalCat,]}>
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
              <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
                <View
                  style={{ flexDirection: "row", flexWrap: "nowrap", gap: 15}}
                >
                  <Pressable >
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={require("../assets/deal1.png")}
                      />
                    </View>
                  </Pressable>
                  <Pressable>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={require("../assets/deal3.png")}
                      />
                    </View>
                  </Pressable>
                  <Pressable>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={require("../assets/deal2.png")}
                      />
                    </View>
                  </Pressable>
                  <Pressable >
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={require("../assets/deal4.png")}
                      />
                    </View>
                  </Pressable>
                  <Pressable>
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

            <View style={{marginTop: 16}}>
              <Text style={[styles.text, {paddingLeft: '3%' }]}>Recommended Foods</Text>
              <ProductHorizontal
                items={categoryObject["food"].slice(0, 6)}
                onPress={handleAddToCart}
              />
            </View>

            <View style={[styles.recommendedView, { alignItems: "center" }]}>
              <Deal
                text={"Surf and Turf Fusion"}
                onPress={dealHandler}
                onAdd={handleAddToCart}
                item={[
                  { title: 'Cajun Catfish', oldPrice: 30.00, image: require('../assets/catfish.png'), reviews: [], category: 'food', related: ["catfish", "dinner", "recipe", "fried", "blackened", "grilled", "fillets", "sauce", "cornmeal", "baked", "southern", "seasoning", "cajun", "pond", "aquaculture", "fishing", "farm-raised", "restaurant", 'fish'], nutrient: 'protein', extras: [['Broccoli', 6], ['Cajun Cabbage', 6], ['Candy Yams', 0], ['Collard Greens', 6], ['French Fries', 0], ['Smoked Gouda Mac & Cheese', 6], ['Spinach & Mushrooms', 0], ['Loaded Mashed Potatoes', 7.5]], instructions: true, description: 'Golden-fried Cajun Catfish, a culinary delight that takes your taste buds on a flavorful journey. Crispy on the outside, tender and flaky on the inside, each bite bursts with a symphony of Cajun spices, delivering a perfect balance of heat and zest. Served alongside a medley of delectable sides, this dish promises a feast for the senses. Whether paired with buttery cornbread, creamy coleslaw, or tangy tartar sauce, every element harmonizes to create a mouthwatering experience.' },
                  { title: 'Dirty Rice', oldPrice: 6, image: require('../assets/rice.png'), reviews: [], category: 'food', related: ["Rice", "Cajun", "Side dish", "Sausage", "Vegetables", "Spices", "Spicy", "Flavorful", "Pork", "Chicken liver", "Giblets", "Southern", "Louisiana", "Comfort food", "Pairings: fried chicken", "grilled fish"], description: 'Savory Cajun-style rice dish packed with flavorful sausage, vegetables, and spices. The "dirty" comes from the bits of cooked pork or chicken liver and giblets traditionally used, adding a rich depth of flavor. Enjoy this flavorful side dish alongside fried chicken, grilled fish, or anything else that needs a spicy kick.' },


                ]}
                color='#283618'
              />
            </View>
            <View style={{marginTop: 16}}>
              <Text style={[styles.text, {paddingLeft: '3%' }]}>Snacks For You</Text>
              <ProductHorizontal
                items={categoryObject["snacks"]}
                onPress={handleAddToCart}
              />
            </View>
            <Deal
              text={"Best Grocery Deals"}
              onPress={dealHandler}
              onAdd={handleAddToCart}
              item={[
                { title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', newPrice: 4.99, oldPrice: 1.99, image: require('../assets/snacks1.png'), reviews: [], category: 'snacks' },
                { title: 'Kit Kat Candy Bar King Size 3oz', newPrice: 3.69, oldPrice: 1.99, image: require('../assets/snacks3.png'), reviews: [], category: 'snacks' },
                { title: 'Tiger Eye Iced Coconut Latte 8.5oz', newPrice: 3.79, oldPrice: 1.99, image: require('../assets/drink4.png'), reviews: [], category: 'drink' },
                { title: 'OREO Original Chocolate Sandwich Cookies 13.29oz $5.49', newPrice: 4.99, oldPrice: 1.99, image: require('../assets/snacks6.png'), reviews: [], category: 'snacks' },
                { title: 'White Claw Seltzer Flavor No. 3 Variety 12pk 12oz Can 5.0% ABV $22.99', newPrice: 7.99, oldPrice: 1.99, image: require('../assets/alcohol1.png'), reviews: [], category: 'alcohol' },

              ]}
              color='#283618'
            />
             <View style={{marginTop: 16}}>
              <Text style={[styles.text, {paddingLeft: '3%' }]}>Alcohol</Text>
              <ProductHorizontal
                items={categoryObject["alcohol"]}
                onPress={handleAddToCart}
              />
            </View>
            <View style={[styles.recommendedView, { alignItems: "center" }]}>
              <Deal
                text={"Gourmet Takes on Comfort Food"}
                onPress={dealHandler}
                onAdd={handleAddToCart}
                item={[
                  { title: 'Stuffed Salmon', oldPrice: 45, image: require('../assets/stuffed_salmon.png'), related: ["Salmon", "Seafood", "Stuffed", "Healthy", "Flavorful", "Protein", "Lunch", "Dinner", "Entrees", "Special occasion", "Crabmeat", "Shrimp", "Vegetables", "Herbs", "Spices"], description: "Salmon fillet generously filled with a flavorful blend of herbs, spices, and your choice of ingredients like crabmeat, shrimp, or vegetables. Baked to perfection, this dish is both decadent and healthy.", reviews: [], category: 'food', nutrient: 'protein', extras: [['Broccoli', 6], ['Cajun Cabbage', 6], ['Candy Yams', 0], ['Collard Greens', 6], ['French Fries', 0], ['Smoked Gouda Mac & Cheese', 6], ['Spinach & Mushrooms', 0], ['Loaded Mashed Potatoes', 7.5]], instructions: true, },

                  { title: 'Smoked Gouda Mac & Cheese', oldPrice: 6.00, image: require('../assets/mac.png'), reviews: [], category: 'food', related: ["side dish", "mac and cheese", "pasta", "cheese", "smoked Gouda", "creamy", "comfort food", "casserole", "baked", "cheesy", "vegetarian option", "lunch", "dinner", "kid-friendly", "crowd-pleaser"], description: "Creamy and decadent mac and cheese made with smoked Gouda cheese for a rich and flavorful twist. A cheesy comfort food favorite." },

                ]}
                color='#283618'
              />
            </View>
            <View style={[styles.recommendedView, { alignItems: "center" }]}>
              <Deal
                text={"Decadent Twists"}
                onPress={dealHandler}
                onAdd={handleAddToCart}
                item={[
                  { title: 'Oysters', oldPrice: 18, image: require('../assets/oyster.png'), reviews: [], category: 'food', nutrient: 'protein', related: ["appetizer", "seafood", "oysters", "raw", "on the half shell", "mignonette sauce", "cocktail sauce", "horseradish", "lemon wedges", "tabasco sauce", "protein", "aphrodisiac", "luxury", "gourmet", "special occasion", "date night", "seafood platter"], description: "Fresh and flavorful oysters, served on the half shell with your choice of toppings like mignonette sauce, cocktail sauce, or horseradish. A seafood appetizer that's both elegant and delicious.", extras: [['Broccoli', 6], ['Cajun Cabbage', 6], ['Candy Yams', 0], ['Collard Greens', 6], ['French Fries', 0], ['Smoked Gouda Mac & Cheese', 6], ['Spinach & Mushrooms', 0], ['Loaded Mashed Potatoes', 7.5]], instructions: true, },

                  { title: 'Grilled Chicken', oldPrice: 30.00, image: require('../assets/chicken.png'), reviews: [], category: 'food', nutrient: 'protein', extras: [['Broccoli', 6], ['Cajun Cabbage', 6], ['Candy Yams', 0], ['Collard Greens', 6], ['French Fries', 0], ['Smoked Gouda Mac & Cheese', 6], ['Spinach & Mushrooms', 0], ['Loaded Mashed Potatoes', 7.5]], instructions: true, description: 'Succulent and juicy grilled chicken breasts, seasoned to perfection and cooked over an open flame. Enjoy the smoky flavor and tender texture, perfect for a satisfying and healthy meal.', related: ["grilled", "chicken", "breasts", "healthy", "protein", "barbecue", "poultry", "marinade", "grilled vegetables", "salad", "sandwich", "entree", "main course", "summer cookout"] },

                ]}
                color='#283618'
              />
            </View>

            <View style={{marginTop: 16}}>
              <Text style={[styles.text, {paddingLeft: '3%' }]}>Drinks</Text>
              <ProductHorizontal
                items={categoryObject["drink"]}
                onPress={handleAddToCart}
              />
            </View>
            <View style={[{ alignItems: "center" }]}>
              <Deal
                text={"Pantry Deals"}
                onPress={dealHandler}
                onAdd={handleAddToCart}
                item={[
                  { title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', oldPrice: 3.69, image: require('../assets/snacks1.png'), reviews: [], category: 'snacks' },
                  { title: 'Hostess Donettes Chocolate Mini Donuts Bag 10.75oz', oldPrice: 3.69, image: require('../assets/snacks2.png'), reviews: [], category: 'snacks' },
                  { title: 'Kit Kat Candy Bar King Size 3oz', oldPrice: 3.69, image: require('../assets/snacks3.png'), reviews: [], category: 'snacks' },
                  { title: 'Basically, Sour Rainbow Bites 5oz', oldPrice: 3.69, image: require('../assets/snacks4.png'), reviews: [], category: 'snacks' },
                  { title: 'OREO Original Chocolate Sandwich Cookies 13.29oz $5.49', oldPrice: 3.69, image: require('../assets/snacks6.png'), reviews: [], category: 'snacks' },

                ]}
                color='#283618'
              />
            </View>
            <View style={{marginTop: 16}}>
              <Text style={[styles.text, {paddingLeft: '3%' }]}>Home</Text>
              <ProductHorizontal
                items={categoryObject["home"]}
                onPress={handleAddToCart}
              />
            </View>
            <View style={{}}>
              <Deal
                text={'Lighter Options'}
                onPress={dealHandler}
                onAdd={handleAddToCart}
                item={[
                  { title: 'Grits', oldPrice: 6.00, image: require('../assets/grits.png'), reviews: [], category: 'food', description: 'Creamy and comforting grits, cooked to a smooth and delicious texture. Enjoy them plain, with cheese, or topped with your favorite savory ingredients.', related: ["side dish", "Southern cuisine", "breakfast", "porridge", "grits", "cheese", "butter", "milk", "cream", "grits and gravy", "shrimp and grits", "creamy", "savory", "comfort food", "versatile", "breakfast food", "lunch", "dinner"] },
                  { title: 'Collard Greens', oldPrice: 6.00, image: require('../assets/greens.png'), reviews: [], category: 'food', description: "Hearty and flavorful collard greens, simmered to perfection with savory spices. A classic Southern side dish that's both delicious and nutritious.", related: ["side dish", "Southern cuisine", "vegetables", "greens", "healthy", "nutritious", "vegan", "soul food", "pork", "ham hock", "smoked turkey", "bacon", "black-eyed peas", "cornbread", "rice", "hot sauce", "vinegar", "pepper flakes"] },

                  { title: 'Bang Bang (8pcs) Fried Shrimp', oldPrice: 17, related: ["Shrimp", "Seafood", "Fried", "Bang Bang sauce", "Spicy", "Sweet", "Appetizer", "Snack", "Protein", "Lunch", "Dinner", "Party food", "Sharing plates"], description: "Eight pieces of crispy fried shrimp tossed in our signature sweet and spicy Bang Bang sauce. This addictively flavorful dish is sure to be a crowd-pleaser.", image: require('../assets/shrimp.png'), reviews: [], category: 'food' },

                ]}
                color='#283618'
              />
            </View>
            <View style={{ marginTop: 40 }}>
              <Deal
                text={'Unexpected Pairings'}
                onPress={dealHandler}
                onAdd={handleAddToCart}
                item={[
                  { title: 'Grits', oldPrice: 6.00, image: require('../assets/grits.png'), reviews: [], category: 'food', description: 'Creamy and comforting grits, cooked to a smooth and delicious texture. Enjoy them plain, with cheese, or topped with your favorite savory ingredients.', related: ["side dish", "Southern cuisine", "breakfast", "porridge", "grits", "cheese", "butter", "milk", "cream", "grits and gravy", "shrimp and grits", "creamy", "savory", "comfort food", "versatile", "breakfast food", "lunch", "dinner"] },
                  { title: 'Collard Greens', oldPrice: 6.00, image: require('../assets/greens.png'), reviews: [], category: 'food', description: "Hearty and flavorful collard greens, simmered to perfection with savory spices. A classic Southern side dish that's both delicious and nutritious.", related: ["side dish", "Southern cuisine", "vegetables", "greens", "healthy", "nutritious", "vegan", "soul food", "pork", "ham hock", "smoked turkey", "bacon", "black-eyed peas", "cornbread", "rice", "hot sauce", "vinegar", "pepper flakes"] },

                  { title: 'Bang Bang (8pcs) Fried Shrimp', oldPrice: 17, related: ["Shrimp", "Seafood", "Fried", "Bang Bang sauce", "Spicy", "Sweet", "Appetizer", "Snack", "Protein", "Lunch", "Dinner", "Party food", "Sharing plates"], description: "Eight pieces of crispy fried shrimp tossed in our signature sweet and spicy Bang Bang sauce. This addictively flavorful dish is sure to be a crowd-pleaser.", image: require('../assets/shrimp.png'), reviews: [], category: 'food' },

                ]}
                color='#283618'
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
    height: height/6,
    maxWidth: width,
    alignSelf: "center",
    borderRadius: 20,
  },
  imageContainer: {
    marginTop: 0,
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
