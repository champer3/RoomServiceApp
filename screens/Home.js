import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Dimensions,
  StatusBar,
  Button,
  Animated,
  Easing,
  FlatList,
  Platform,
  InteractionManager,
  AppState,
} from "react-native";
import Text from '../components/Text';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ItemCategory from "../components/Category/ItemCategory";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';
import { triggerNotification } from '../Data/notify';
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
import { addToCart, removeFromCart, addOptions, selectTotalCartCount } from "../Data/cart";
import { fetchOrders, updateOrder } from "../Data/order"
import { useEffect, useState, useRef } from "react";
import BottomSheet from "../components/Modals/BottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlexButton from "../components/Buttons/FlexButton";
import TransparentSheet from "../components/Modals/TransparentSheet.";
import axios from "axios";
import { initializeSocket, getSocket, disconnectSocket } from '../socketService';
import { fetchProducts, removeProduct, patchProduct, addProduct } from "../Data/Items"
import ItemSmallCategory from "../components/Category/ItemSmallCategory";
import { SERVER_URL } from "../config";
import { fetchAppHome, invalidateAppCache } from "../api/appPromotions";
import PromotionHomeSection from "../components/promotions/PromotionHomeSection";
import { useTheme } from "../theme/ThemeContext";
import RoomServiceAlert, { ROOM_SERVICE_ALERT_TYPES } from "../components/RoomServiceAlert";
import { useToast } from "../context/ToastContext";
import FloatingCartFab from "../components/FloatingCartFab";
import FalseHomeScreen from "./FalseHomeScreen";

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
        useNativeDriver: true, // Add this line to improve performan
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

/** Rotating primary + hint lines for the home search affordance */
const SEARCH_BAR_ROTATION_MS = 4600;
const SEARCH_BAR_PHRASES = [
  { lead: "Search food & groceries", hint: 'Try "Jollof rice" or "Groceries"' },
  { lead: "What sounds good today?", hint: "Meals, snacks, pantry staples…" },
  { lead: "Find flavors you'll love", hint: "Spicy, vegan, quick dinners…" },
  { lead: "Browse stores & dishes", hint: "Search by name or category" },
  { lead: "Stock the kitchen fast", hint: "Produce, dairy, household…" },
  { lead: "Craving something new?", hint: "Trending picks & local favorites" },
];

function Home() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [socket, setSocket] = useState(null);
  const address = useSelector((state) => state.profileData.profile)?.address[0]
  const expoPushToken = useSelector((state) => state.notifications.expoPushToken);
  const notificationCount = useSelector((state) => state.notifications.unreadCount || 0);

  useEffect(() => {
    const setup = async () => {
      const token = await retrieveTokenFromAsyncStorage();
      if (token) {
        initializeSocket(token);
        setSocket(getSocket());
      }
    };
    setup();
  }, []);

  const [deliveringOrdersCount, setDeliveringOrdersCount] = useState(countDeliveringOrders(orders));

  useEffect(() => {
    let interval = null;
    let cleanedUp = false;
    let activeSocket = null;
    let fetchDebounce = null;

    const handleOrderUpdate = (data) => {
      console.log('[Home] orderUpdate received:', data);
      if (data.orderId && data.status) {
        dispatch(updateOrder({ id: { uid: data.orderId, act: 'status', perform: data.status } }));
        if (data.status === 'delivered' || data.status === 'Delivered') {
          dispatch(updateOrder({ id: { uid: data.orderId, act: 'date', perform: new Date().toString() } }));
          setDeliveringOrdersCount(prev => Math.max(0, prev - 1));
        }
      }
      if (data.message) {
        dispatch(triggerNotification(expoPushToken, "Order Update", data.message));
      }
      // Debounced refetch to avoid rapid successive calls
      if (fetchDebounce) clearTimeout(fetchDebounce);
      fetchDebounce = setTimeout(() => { dispatch(fetchOrders()); }, 800);
    };

    const attachListeners = () => {
      const s = getSocket();
      if (!s || !s.connected) return false;
      if (activeSocket === s) return true;
      activeSocket = s;

      s.on('orderUpdate', handleOrderUpdate);
      s.on('orderInDelivery', (data) => {
        handleOrderUpdate({ ...data, status: 'out_for_delivery', message: data.message || 'Your order is out for delivery' });
      });
      s.on('delivered', (data) => {
        handleOrderUpdate({ ...data, status: 'delivered', message: data.message || 'Your order has been delivered' });
      });
      s.on('productUpdate', (data) => {
        if (data.type === 'deleted') {
          dispatch(removeProduct(data.productId));
        } else if (data.type === 'created' && data.product) {
          dispatch(addProduct(data.product));
        } else if (data.type === 'updated' && data.product) {
          if (data.product.availability === false || data.product.status === 'inactive') {
            dispatch(removeProduct(data.productId));
          } else {
            dispatch(patchProduct(data.product));
          }
        }
      });
      s.on('categoryUpdate', () => {
        invalidateAppCache();
        fetchAppHome().then((d) => { if (d) setHomeAppData(d); });
        dispatch(fetchProducts());
      });
      s.on('departmentUpdate', () => {
        invalidateAppCache();
        fetchAppHome().then((d) => { if (d) setHomeAppData(d); });
      });
      return true;
    };

    if (!attachListeners()) {
      interval = setInterval(() => {
        if (cleanedUp) return;
        if (attachListeners() && interval) {
          clearInterval(interval);
          interval = null;
        }
      }, 1000);
    }

    return () => {
      cleanedUp = true;
      if (interval) clearInterval(interval);
      if (fetchDebounce) clearTimeout(fetchDebounce);
      if (activeSocket) {
        activeSocket.off('orderUpdate');
        activeSocket.off('delivered');
        activeSocket.off('orderInDelivery');
        activeSocket.off('productUpdate');
        activeSocket.off('categoryUpdate');
        activeSocket.off('departmentUpdate');
      }
    };
  }, [expoPushToken]);

  // Refetch orders when app returns from background
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        dispatch(fetchOrders());
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [dispatch]);

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
    const currentTime = new Date();
    const hours = currentTime.getHours();

    if (hours < 12) {
      return "Good morning";
    } else if (hours < 18) {
      return "Good afternoon";
    }
    return "Good evening";
  }
  function getHeaderGlowMood() {
    const hours = new Date().getHours();

    if (hours < 12) {
      return {
        mistColors: ["rgba(255,220,160,0.28)", "rgba(255,240,210,0.14)", "rgba(255,255,255,0)"],
        glowColor: "rgba(245,166,91,0.16)",
      };
    }
    if (hours < 18) {
      return {
        mistColors: ["rgba(168,214,141,0.22)", "rgba(216,236,198,0.12)", "rgba(255,255,255,0)"],
        glowColor: "rgba(111,179,95,0.13)",
      };
    }
    return {
      mistColors: ["rgba(147,166,255,0.22)", "rgba(214,220,255,0.12)", "rgba(255,255,255,0)"],
      glowColor: "rgba(120,142,231,0.13)",
    };
  }
  function getDynamicGreetingSubline({ cartCount, activeDeliveryCount, orders: ordersHint, firstName: nameHint }) {
    const seed = ((nameHint || "a").length + (cartCount || 0)) % 1000;

    if (activeDeliveryCount > 0) {
      return `${activeDeliveryCount} ${activeDeliveryCount === 1 ? "order is" : "orders are"} heading your way`;
    }
    if (cartCount > 0) {
      return `${cartCount} ${cartCount === 1 ? "item is" : "items are"} in your cart — ready when you are`;
    }

    const orderList = Array.isArray(ordersHint) ? ordersHint : [];
    const firstProductTitle = orderList[0]?.products?.[0]?.title;
    if (firstProductTitle && typeof firstProductTitle === "string") {
      const t = firstProductTitle.trim();
      const short = t.length > 24 ? `${t.slice(0, 22)}…` : t;
      if (orderList.length >= 2) {
        return `Your usual favorites — reorder ${short}?`;
      }
      return `${short} hit the spot last time?`;
    }

    const hour = new Date().getHours();
    const daytime = [
      "Craving something spicy today?",
      "Fresh groceries or comfort food?",
      "Discover something new for lunch.",
    ];
    const evening = [
      "Tonight's cravings are one tap away.",
      "Wind down with something delicious.",
    ];
    if (hour >= 21 || hour < 5) {
      return evening[seed % evening.length];
    }
    if (hour < 12) {
      return daytime[seed % daytime.length];
    }
    if (hour < 17) {
      return "Take a break — ideas for lunch inside.";
    }
    return evening[seed % evening.length];
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
        `${SERVER_URL}/api/v1/orders/get-your-orders`,
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
    const handle = InteractionManager.runAfterInteractions(() => {
      dispatch(fetchProducts());
    });
    return () => handle.cancel();
  }, [dispatch]);
  useEffect(() => {
    setBlink(true)
    setDeliveringOrdersCount(countDeliveringOrders(orders))
  }, [orders])

  const data = useSelector((state) => state.profileData.profile);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids);
  const cartCount = useSelector(selectTotalCartCount);



  const productItems = useSelector((state) => state.productItems.ids);
  const menuLoadStatus = useSelector((state) => state.productItems.status);
  const [homeAppData, setHomeAppData] = useState(null);
  const [showMenuLoadError, setShowMenuLoadError] = useState(true);

  const dataReady = (menuLoadStatus === 'succeeded' || menuLoadStatus === 'failed') && productItems.length > 0;
  const [contentVisible, setContentVisible] = useState(dataReady);
  const contentOpacity = useRef(new Animated.Value(dataReady ? 1 : 0)).current;

  useEffect(() => {
    if (dataReady && !contentVisible) {
      setContentVisible(true);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [dataReady, contentVisible, contentOpacity]);

  useEffect(() => {
    let cancelled = false;
    const handle = InteractionManager.runAfterInteractions(() => {
      fetchAppHome()
        .then((d) => {
          if (!cancelled) setHomeAppData(d);
        })
        .catch((e) => {
          console.warn("fetchAppHome", e?.message || e);
        });
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, []);

  useEffect(() => {
    if (menuLoadStatus === "failed") setShowMenuLoadError(true);
  }, [menuLoadStatus]);

  const categoryObject = {};

  productItems.forEach((item) => {
    if (item?.availability === false) return;
    const category = item.category;

    if (!categoryObject[category]) {
      categoryObject[category] = [item];
    } else {
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
  const firstName =
    data?.firstName?.charAt(0).toUpperCase() + data?.firstName?.slice(1).toLowerCase() || "there";
  const addressHeadline =
    address?.address != null && String(address.address).trim() !== ""
      ? String(address.address).split(",")[0].trim()
      : "";
  const greeting = getGreeting();
  const departmentCategoryItems =
    homeAppData?.departments?.map((dept) => ({
      text: dept?.name || "Category",
      slug: dept?.slug || "",
      image: dept?.iconUrl ? { uri: dept.iconUrl } : require("../assets/food.png"),
    })).slice(0, 5) || [];
  const categoryKeys = Object.keys(categoryObject);
  const upperCategoryKeys = categoryKeys.slice(0, 2);
  const lowerCategoryKeys = categoryKeys.slice(2);
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
  function notifyHandler() {
    navigation.navigate("Notifications");
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
  const [blink, setBlink] = useState(true);
  const [showOrderSuccessAlert, setShowOrderSuccessAlert] = useState(false);
  const { showToast } = useToast();
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const greetingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(greetingAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(greetingAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => {
      loop.stop();
    };
  }, [greetingAnim]);

  const [searchPhraseIndex, setSearchPhraseIndex] = useState(0);
  const searchTextOpacity = useRef(new Animated.Value(1)).current;
  const searchTextTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const advance = () => {
      if (cancelled) return;
      Animated.parallel([
        Animated.timing(searchTextOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(searchTextTranslateY, {
          toValue: -6,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;
        setSearchPhraseIndex(
          (i) => (i + 1) % SEARCH_BAR_PHRASES.length
        );
        searchTextTranslateY.setValue(7);
        Animated.parallel([
          Animated.timing(searchTextOpacity, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(searchTextTranslateY, {
            toValue: 0,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    };
    const id = setInterval(advance, SEARCH_BAR_ROTATION_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [searchTextOpacity, searchTextTranslateY]);

  const greetingAnimatedStyle = {
    transform: [
      {
        translateY: greetingAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -2],
        }),
      },
    ],
    opacity: greetingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.92, 1],
    }),
  };
  const headerPrimaryBlockStyle = {
    opacity: headerScrollY.interpolate({
      inputRange: [0, 55, 80],
      outputRange: [1, 0.35, 0],
      extrapolate: "clamp",
    }),
    transform: [
      {
        translateY: headerScrollY.interpolate({
          inputRange: [0, 80],
          outputRange: [0, -14],
          extrapolate: "clamp",
        }),
      },
      {
        scaleY: headerScrollY.interpolate({
          inputRange: [0, 80],
          outputRange: [1, 0.02],
          extrapolate: "clamp",
        }),
      },
    ],
    overflow: "hidden",
  };
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
      showToast({
        type: "success",
        title: "Item added to cart",
        actionLabel: "View Cart →",
        onAction: () => navigation.navigate("Cart"),
      });
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
    const y = event.nativeEvent.contentOffset.y;
    setIsVisible(y > 223);
    headerScrollY.setValue(y);
  }
  reg?.current?.scrollTo(-1 * height / 4.7)

  if (!contentVisible) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <FalseHomeScreen />
      </GestureHandlerRootView>
    );
  }

  return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <Animated.View
          onTouchStart={() => { ref?.current?.scrollTo(0); setBlink(true) }}
          style={[
            styles.homeSafeRoot,
            { paddingTop: insets.top, paddingBottom: 0, marginBottom: 0, opacity: contentOpacity, backgroundColor: colors.background },
          ]}
        >
          <FloatingCartFab count={cartCount} onPress={cartHandler} bottomOffset={102} />
          <View style={{ flex: 1, }}>
            <ScrollView
              stickyHeaderIndices={[1]}
              scrollEventThrottle={16}
              onScroll={(e) => handleScroll(e)}
              bounces={false}
              showsVerticalScrollIndicator={false}
              style={{}}
              contentContainerStyle={{ paddingBottom: 120 }}
              onTouchStart={() => { ref?.current?.scrollTo(0) }}
            >
              <View style={styles.homeIntroSection}>
              <View style={styles.stickyHeaderWrap}>
              {/* <LinearGradient
                    pointerEvents="none"
                    style={styles.headerTopMist}
                    colors={headerGlowMood.mistColors}
                    locations={[0, 0.38, 1]}
                  /> */}
                <View style={styles.homeHeader}>
                 
                  <View style={styles.headerContent}>
                  <Animated.View style={headerPrimaryBlockStyle}>
                    <View style={styles.headerTopRow}>
                      <Pressable style={styles.locationPill} onPress={() => { navigation.navigate("Address") }}>
                        <Text style={[styles.locationPillText, { color: colors.text }]} numberOfLines={1}>
                          {addressHeadline || "Locate me..."}
                        </Text>
                        <MaterialIcons name="keyboard-arrow-down" size={18} color={colors.text} />
                      </Pressable>
                      <View style={styles.headerRightActions}>
                        <Pressable style={styles.headerIconButton} onPress={notifyHandler}>
                          <Feather name="bell" size={18} color={colors.text} />
                          {notificationCount > 0 && (
                            <View style={styles.headerCountBadge}>
                              <Text style={styles.headerCountText}>{notificationCount > 99 ? "99+" : notificationCount}</Text>
                            </View>
                          )}
                        </Pressable>

                        <Pressable style={styles.headerIconButton} onPress={cartHandler}>
                          <Feather name="shopping-cart" size={18} color={colors.text} />
                          {cartCount > 0 && (
                            <View style={styles.headerCountBadge}>
                              <Text style={styles.headerCountText}>{cartCount}</Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    </View>

                   
                    </Animated.View>

                    
                  </View>
                </View>
              </View>
              <Animated.View style={greetingAnimatedStyle}>
                      <Text style={[styles.headerGreetingText, { color: colors.text }]}>{`${greeting}, ${firstName}`}</Text>
                      <Text style={[styles.headerGreetingSubText, { color: colors.textSecondary }]}>
                        {getDynamicGreetingSubline({
                          cartCount: cartCount,
                          activeDeliveryCount: deliveringOrdersCount,
                          orders: orders || [],
                          firstName,
                        })}
                      </Text>
              </Animated.View>
              </View>

              <View style={styles.stickySearchCategoriesWrap} collapsable={false}>
                <Animated.View style={styles.headerSearchBackdrop}>
                  <View style={styles.headerSearchGlassOuter}>
                    <BlurView
                      intensity={Platform.OS === "ios" ? 40 : 32}
                      tint="light"
                      style={styles.headerSearchBlur}
                    />
                    <View style={styles.headerSearchGlassWash} pointerEvents="none" />
                    <LinearGradient
                      pointerEvents="none"
                      colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                      style={styles.headerSearchInnerShine}
                    />
                    <LinearGradient
                      pointerEvents="none"
                      colors={["transparent", "rgba(17, 24, 39, 0.04)"]}
                      style={styles.headerSearchInnerFloor}
                    />
                    <View style={styles.headerSearchRow}>
                      <Pressable
                        style={styles.headerSearchMainHit}
                        onPress={() => navigation.navigate("CategorySearch", { cat: "" })}
                        accessibilityLabel={`Search. ${SEARCH_BAR_PHRASES[searchPhraseIndex].lead}. ${SEARCH_BAR_PHRASES[searchPhraseIndex].hint}`}
                      >
                        <Feather
                          name="search"
                          size={19}
                          color={colors.text}
                          style={styles.headerSearchIconMinimal}
                        />
                        <Animated.View
                          style={[
                            styles.headerSearchTextBlock,
                            {
                              opacity: searchTextOpacity,
                              transform: [{ translateY: searchTextTranslateY }],
                            },
                          ]}
                        >
                          <Text style={styles.headerSearchLead} numberOfLines={1}>
                            {SEARCH_BAR_PHRASES[searchPhraseIndex].lead}
                          </Text>
                          {/* <Text style={styles.headerSearchHint} numberOfLines={1}>
                          {SEARCH_BAR_PHRASES[searchPhraseIndex].hint}
                        </Text> */}
                        </Animated.View>
                      </Pressable>
                    </View>
                  </View>
                  {deliveringOrdersCount > 0 ? (
                    <Pressable
                      style={styles.orderStatusPill}
                      onPress={orderHandler}
                      accessibilityRole="button"
                      accessibilityLabel="Track active deliveries"
                    >
                      <MaterialIcons name="local-shipping" size={18} color="#425928" />
                      <Text style={styles.orderStatusPillText}>
                        {deliveringOrdersCount} on the way · Track
                      </Text>
                      <Feather name="chevron-right" size={16} color="#6b7280" />
                    </Pressable>
                  ) : null}
                </Animated.View>
                <View style={styles.stickyCategoryBelowSearch}>
                  <ItemCategory
                    items={departmentCategoryItems}
                    itemWidth={width}
                    show={true}
                    color={"#BC6C25"}
                    onPress={(item) => {
                      if (item?.slug) navigation.navigate("Department", { slug: item.slug });
                    }}
                  />
                </View>
              </View>

              {menuLoadStatus === "failed" && showMenuLoadError && (
                <RoomServiceAlert
                  type={ROOM_SERVICE_ALERT_TYPES.error}
                  title="Could not load menu"
                  message="Something went wrong. Please try again."
                  primaryActionLabel="Retry"
                  onPrimaryAction={() => dispatch(fetchProducts())}
                  dismissible
                  onDismissed={() => setShowMenuLoadError(false)}
                />
              )}
              {showOrderSuccessAlert && (
                <RoomServiceAlert
                  type={ROOM_SERVICE_ALERT_TYPES.success}
                  title="Order placed successfully"
                  message="Your groceries are being prepared. Track your delivery in real time."
                  primaryActionLabel="Track order"
                  onPrimaryAction={() => {
                    setShowOrderSuccessAlert(false);
                    navigation.navigate("Order History");
                  }}
                  autoDismissDuration={5000}
                  showProgressBar
                  onDismissed={() => setShowOrderSuccessAlert(false)}
                />
              )}
              <PromotionHomeSection
                homeData={homeAppData}
                navigation={navigation}
                products={productItems}
                buckets={['hero']}
              />

              <PromotionHomeSection
                homeData={homeAppData}
                navigation={navigation}
                products={productItems}
                buckets={['featuredStrip']}
              />
              <View style={{ gap: 20, marginBottom: 28 }}>
                {upperCategoryKeys.map((categoryKey, idx) => (
                  <ProductHorizontal
                    key={categoryKey}
                    titleOverride={idx === 0 ? "Popular near you" : "Deals for you"}
                    categoryName={categoryKey}
                    items={categoryObject[categoryKey]}
                  />
                ))}
                <PromotionHomeSection
                  homeData={homeAppData}
                  navigation={navigation}
                  products={productItems}
                  buckets={['tiles']}
                />
                {lowerCategoryKeys.map((categoryKey) => (
                  <ProductHorizontal
                    key={categoryKey}
                    titleOverride="Recommended for you"
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
              </View>
            </Pressable>}</LinearGradient>

          </TransparentSheet>}
        </Animated.View>
        </GestureHandlerRootView>
  );
}

export default Home;

const styles = StyleSheet.create({
  homeSafeRoot: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f8f6f2",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8faf8",
    // backgroundColor: "#283618",
    // borderWidth: 4,
  },
  top: {
    // backgroundColor: "white",
    // borderWidth: 4,
  },
  homeHeader: {
    // marginHorizontal: 10,
    // marginTop: 8,
    // borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0)",
    // paddingTop: 14,
    // paddingBottom: 7,
    paddingHorizontal: 0,
    overflow: "hidden",
    zIndex: 3,
    // backgroundColor: "#EEF4E9",
    // borderWidth: 1,
    borderColor: "#DDE8D5",
  },
  headerTopMist: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // height: 180,
  },
  headerGlow: {
    position: "absolute",
    top: -50,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(178, 156, 29, 0.08)",
  },
  headerContent: {
    gap: 12,
    zIndex: 2,
  },
  homeIntroSection: {
    backgroundColor: "#f8f6f2",
  },
  stickySearchCategoriesWrap: {
    backgroundColor: "#f8f6f2",
    zIndex: 2,
    paddingTop: 1,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(17, 24, 39, 0.07)",
  },
  stickyCategoryBelowSearch: {
    paddingTop: 8,
  },
  stickyHeaderWrap: {
    backgroundColor: "rgba(255,255,255,0)",
    // paddingBottom: 8,
    zIndex: 5,
  },
  stickyHeaderFade: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // bottom: 0,
    // height: 24,
    // zIndex: 2,
  },
  headerTopRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
    flexShrink: 0,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 22,
    backgroundColor: "#FEFCF8",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 999,
    // paddingHorizontal: 16,
    paddingRight: 10,
    paddingVertical: 6,
    flex: 1,
    width: 200,
    minWidth: 0,
    gap: 8,
    // shadowColor: "#0f1a0b",
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
    // elevation: 7
    // borderWidth: 1,
    // borderColor: "#DDE7D5",
  },
  locationPillText: {
    color: "#111827",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    opacity: 0.95,
    flexShrink: 1,
  },
  headerGreetingText: {
    color: "#121212",
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    marginBottom: 2,
    // marginTop: 4,
    width: "100%",
    paddingHorizontal: 20,
    alignSelf: "center",
    letterSpacing: 0.1,
  },
  headerGreetingSubText: {
    color: "#6B7280",
    // display: "none",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    width: "100%",
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: 12
   
  },
  headerSearchGlassOuter: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "#111827",
    // marginVertical: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  headerSearchBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  headerSearchGlassWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(254, 252, 248, 0.36)",
  },
  headerSearchInnerShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  headerSearchInnerFloor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  headerSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 7,
    paddingLeft: 14,
    paddingRight: 8,
    minHeight: 48,
  },
  headerSearchMainHit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    paddingRight: 12,
  },
  headerSearchIconMinimal: {
    marginLeft: 2,
  },
  headerSearchTextBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 3,
  },
  headerSearchLead: {
    color: "rgba(55, 65, 81, 0.82)",
    fontSize: 12,
    // fontFamily: "Poppins",
    letterSpacing: 0.08,
  },
  headerSearchHint: {
    color: "rgba(156, 163, 175, 0.62)",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.08,
  },
  orderStatusPill: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginLeft: 2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(66, 89, 40, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(66, 89, 40, 0.22)",
  },
  orderStatusPillText: {
    flex: 1,
    color: "#1f2937",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.15,
  },
  headerSearchBackdrop: {
    width: "100%",
    paddingVertical: 2,
    paddingTop: 0,
    // marginTop: 10,
    paddingHorizontal: 20,
    
  },
  headerCountBadge: {
    position: "absolute",
    top: -5,
    right: -4,
    minWidth: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: "#BC6C25",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  headerCountText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "700",
  },
  heroCard: {
    flexDirection: "row",
    gap: 10,
  },
  heroMain: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    // padding: 14,
  },
  heroTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "SFPRO-Medium",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginBottom: 16,
  },
  heroFooter: {
    gap: 12,
  },
  heroAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "#f3f4f6",
  },
  heroItemsPill: {
    marginLeft: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroItemsText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  orderNowButton: {
    backgroundColor: "white",
    borderRadius: 999,
    height: 44,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderNowArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4F6B30",
    alignItems: "center",
    justifyContent: "center",
  },
  orderNowText: {
    color: "#111827",
    fontSize: 16,
    fontFamily: "SFPRO-Medium",
    marginLeft: 10,
    flex: 1,
  },
  orderNowDoubleChevron: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  newListRail: {
    width: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  newListRailText: {
    color: "white",
    fontSize: 12,
    fontFamily: "SFPRO-Medium",
    transform: [{ rotate: "-90deg" }],
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
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: "white",
  }, 
  deals: {
    marginVertical: 16,
    marginHorizontal: "2%",
    flexDirection: "row",
  },
  textStyle: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
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