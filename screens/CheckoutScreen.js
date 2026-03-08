import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  Dimensions,
  TextInput,
  ActivityIndicator,
  FlatList, Image, TouchableOpacity
} from "react-native";
import Svg, {Path} from 'react-native-svg';
import Text from '../components/Text';
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { Fontisto } from "@expo/vector-icons";
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';
import {
  clearCart,
  
  addToCart,
  removeFromCart,
  deleteFromCart,
  addOptions,
  deleteItem,
  updateCart,
} from "../Data/cart";
import {completeOrder} from "../Data/order"
import OrderSuccess from "../components/Modals/OrderSuccess";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "../components/Modals/BottomSheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import ProductDescription from "../components/Product/ProductDescription";
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import { initializeSocket, getSocket, disconnectSocket } from '../socketService';
import { SERVER_URL } from '../config';
const { width, height } = Dimensions.get("window");

function CheckoutScreen() {
  const [visible, setVisible] = useState(false);
  const lastOrderForReceipt = useRef({ items: [], total: 0 });

  // // const orders = useSelector((state) => state.orders.ids);
  // // console.log(orders);
  const mode = [
    { mode: "Faster (+$2)", time: "10-15 Minutes", fastest: true },
    { mode: "Fast", time: "30-45 Minutes", fastest: false },
  ];
  const cartItems = useSelector((state) => state.cartItems.ids)
  function handleDeleteFromCart(index) {
    dispatch(deleteFromCart({ id: {'index': index} }));
    if (cartItems.length == 0){
      navigation.goBack()
    }
  }

  // function getFlavors(flavor) {
  //   if (flavor) {
  //     var res = [];
  //     for (var i = 0; i < flavor.length; i++) {
  //       res.push(display[0].extras[flavor[i]]);
  //     }
  //     return res;
  //   }
  //   return [];
  // }
  // function createFoodDictionary(foodArray) {
  //   let foodDictionary = {};
  //   for (let i = 0; i < foodArray.length; i++) {
  //     foodDictionary[foodArray[i][0]] = 0;
  //   }
  //   return foodDictionary;
  // }
  // function countFoodDictionary(foodArray, index) {
  //   let foodDictionary = {};
  //   for (let i = 0; i < foodArray.length; i++) {
  //     foodDictionary[foodArray[i][0]] = 0;
  //   }
  //   if (display[index].Sides) {
  //     for (let i = 0; i < display[index].Sides.length; i++) {
  //       foodDictionary[display[index].Sides[i]]++;
  //     }
  //   }
  //   return foodDictionary;
  // }
  // const productItems = useSelector((state) => state.productItems.ids);

  // // Example usage:
  // let [foodStore, setFood] = useState({});
  // const [foodDictionary, setFoodDictionary] = useState(foodStore);
  // const [pro, setPro] = useState({});
  const data = useSelector((state) => state.profileData.profile);
  const address = [...data.address];
  const dispatch = useDispatch();
  const temp = [...cartItems];
  // const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setNum(selectedIndex);
  };
  // function findPrice(foodName) {
  //   for (let i = 0; i < pro.extras.length; i++) {
  //     if (pro.extras[i][0] === foodName) {
  //       return pro.extras[i][1];
  //     }
  //   }
  //   return "Item not found in the menu";
  // }

  const navigation = useNavigation();
  function pressHandler() {
    if (address.length >= 1) {
      navigation.navigate("Make Payment", { total: total });
    }
  }
  function press() {
    const { items, total: receiptTotal } = lastOrderForReceipt.current;
    navigation.navigate("Order Receipt", {
      total: (receiptTotal ?? total).toFixed(2),
      items: items?.length ? items : temp,
    });
  }
  function move() {
    navigation.navigate("Order History");
  }
  const retrieveTokenFromAsyncStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken !== null) {
        return storedToken;
      } else {
        navigation.navigate('Account')
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
const constructOrderDetails = (formObject) => {
  console.log('object', formObject)
  return {
    productName: formObject.products[0].title,  // Set the product name
    component: formObject.components || '',  // Set the component or empty string if undefined
    sides: formObject.extra?.map(item => JSON.stringify(item)),  // Convert each extra item to JSON string
    flavor: formObject.options?.map(option => JSON.stringify(option)),  // Convert each option item to JSON string
    dressing: formObject.products?.map(product => 
      JSON.stringify({
        title: product.title, 
        images: product.images, 
        price: product.price
      })
    )  // Extract title, images, and price from each product and convert to JSON string
  };
};
  useEffect(() => { retrieveTokenFromAsyncStorage() }, [])
  const tryCreateOrder = async () => {
    console.log('got Hereeeeeeeeee')
    try {

      const token = await retrieveTokenFromAsyncStorage();
      const row = [...cartItems];
      let date = getTodaysDate();
      let orderDetails = []
      let productIds = []
      let instructions = ''
      for (var i = 0; i < cartItems.length; i++) {
        row[i] = { ...cartItems[i], ["reviews"]: false };
        cartItems[i].products.forEach((product) => productIds.push(product.id));

      // Concatenate instructions from each cart item
      instructions += (cartItems[i].instructions ?? '') + '\n';

      // Construct order details and push to orderDetails array
      orderDetails.push(constructOrderDetails(cartItems[i]));
      }
      // Prepare the order object
      const orderPayload = {
        totalPrice: total,
        paymentStatus: true,
        date: date,
        createdAt: date,
        shippingAddress: address[0]?.address || 'No Address Provided', // Ensure address exists
        paymentMethod: "card",
        productID: productIds,
        orderInstruction: instructions.trim(), // Trim unnecessary line breaks
        orderDetails: orderDetails,
        orderStatus: 'Ordered',
      };
  
      // Log the payload for debugging
      console.log('Order Payload:', orderPayload);
      const createOrder = await axios.post(
        `${SERVER_URL}/api/v1/orders`,
       orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          },
        }
      );
      if (createOrder) {
        const row = [...cartItems];
        date = getTodaysDate();
        
        for (var i = 0; i < cartItems.length; i++) {
          row[i] = { ...cartItems[i], ["reviews"]: false };
        }
        dispatch(
          completeOrder({
            id: {
              id: createOrder.data.data.order.id,
              order: row,
              date: date,
              status: "Ordered",
              address: address[0].address,
              price: `$${total}`,
              driver : ''
            },
          })
        );
        dispatch(clearCart({ id: cartItems }));
        emitOrderMessage()
      }
    } catch (error) {
      console.log(error);
    }
  };
  function generateRandomId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  function getTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return today.toString();
  }
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setIsLoading] = useState(false); 

  const emitOrderMessage = () => {
    const socket = getSocket()
    if (socket) {
      socket.emit('order', 'Hello from React Native!'); 
    }
  };
  const id = generateRandomId(8);
  const checkOut = async () => {
    console.log(total.toFixed(2))
    try {
      // Retrieve token from async storage
      const token = await retrieveTokenFromAsyncStorage();
  
      // Make API request to create checkout session
      const response = await axios.post(
        `${SERVER_URL}/api/v1/payments/checkout-session`,
        {
          amount: total.toFixed(2), // Ensure total is correctly calculated
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the retrieved token
          },
        }
      );
  
      // Initialize the payment sheet with the response data
      const initPayment = await initPaymentSheet({
        merchantDisplayName: "RoomService",
        paymentIntentClientSecret: response.data.clientSecret,
        customerEphemeralKeySecret: response.data.ephemeralKey,
        customerId: response.data.customer,
        returnURL: 'yourapp://payment-completed',
      });
  
      // Start the loading indicator
      setIsLoading(true);
  
      // Present the payment sheet
      const { error } = await presentPaymentSheet();
  
      // Handle any errors from the payment sheet
      if (error) {
        console.log(error)
        // Stop loading and return, because an error occurred
        setIsLoading(false);
        return;
      }
  
      // Payment succeeded – save items/total for receipt before cart is cleared
      lastOrderForReceipt.current = { items: [...cartItems], total };
      setIsLoading(false);
      setVisible(true);
      tryCreateOrder();
  
    } catch (error) {
      // Handle API request errors
      console.error("API request error:", error);
      setIsLoading(false); // Stop loading if an error occurs
    }
  };
  


  function addressHandler() {
    navigation.navigate("Confirm Address");
  }
  // function getTotalSum() {
  //   var totalPrice = 2.62 + (num == 0 ? 2 : 0);
  //   cartItems.forEach((obj) => {
  //     const title = Object.keys(obj)[0];
  //     const titleArray = Object.values(obj)[0];

  //     titleArray.forEach((item) => {
  //       totalPrice += item.oldPrice;
  //     });
  //     cost[title] = totalPrice;
  //   });
  //   return totalPrice;
  // }
  // const cost = {};
  // function addQuantityToObjects(inputList) {
  //   const titleCountMap = {};

  //   const result = {};
  //   inputList.forEach((obj) => {
  //     const title = Object.keys(obj)[0];
  //     const arrayLength = obj[title].length;
  //     result[title] = arrayLength;
  //   });
  //   // Loop through the inputList to count occurrences of each title
  //   inputList.forEach((obj) => {
  //     const title = obj.title;

  //     // Increment the count for the title or initialize to 1 if it doesn't exist
  //     titleCountMap[title] = (titleCountMap[title] || 0) + 1;
  //   });

  //   inputList.forEach((obj) => {
  //     var totalPrice = 0;
  //     const title = Object.keys(obj)[0];
  //     const titleArray = Object.values(obj)[0];

  //     titleArray.forEach((item) => {
  //       totalPrice += item.oldPrice;
  //     });
  //     cost[title] = totalPrice;
  //   });
  //   // Loop through the inputList again to create a new list with quantity key
  //   const newList = inputList.map((obj) => {
  //     const title = Object.keys(obj)[0];
  //     const quantity = result[title];

  //     // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
  //     titleCountMap[title] = 0;

  //     return { ...obj[title][0], ["oldPrice"]: cost[title], quantity };
  //   });
  //   const filteredList = newList.filter((obj) => obj.quantity !== 0);

  //   return filteredList;
  // }
  // const [display, setDisplay] = useState([]);
  // const ref2 = useRef(null);
  // const ref3 = useRef();
  // function handleUpdate() {
  //   let price = 0;
  //   let newItem = {};
  //   if (plus1) {
  //     for (var i = 0; i < plus1.length; i++) {
  //       price += findPrice(plus1[i]);
  //     }
  //     newItem = { ...newItem, ...{ Sides: plus1 } };
  //   }
  //   if (option1) {
  //     newItem = { ...newItem, ...{ Picked: option1 } };
  //   }
  //   if (addOn1 && addOn1.length > 0) {
  //     newItem = { ...newItem, ...{ Flavour: addOn1 } };
  //   }
  //   ref3?.current?.scrollTo(0);
  //   ref2?.current?.scrollTo(0);
  //   dispatch(
  //     updateCart({
  //       id: {
  //         title: pro.title,
  //         index: index,
  //         newItem: { ...pro, ...newItem, ["oldPrice"]: pro.oldPrice + price },
  //       },
  //     })
  //   );
  // }
  // const [plus1, setSides] = useState([]);
  // const [instruction, setInstruction] = useState("");
  // const [addOn1, setAddOn] = useState([]);
  // const [option1, setOption1] = useState(null);
  const [num, setNum] = useState(0);
const [instruct, setInstruct] = useState(false)
function handleProductClick(item, index){
  let product = item.products[0]
  dispatch(deleteFromCart({ id: {'index': index} }));
  navigation.replace('Product',{product, productData: item})
}
  // function handleEdit(name, index) {
  //   ref3?.current?.scrollTo(-570);
  //   ref2?.current?.scrollTo(0);
  //   let product = [];
  //   productItems.forEach((item) => {
  //     if (item.title == name) {
  //       product = item;
  //     }
  //   });
  //   if (product.extras) {
  //     setFoodDictionary(countFoodDictionary(product.extras, index));
  //   }
  //   setIndex(index);
  //   setPro(product);
  //   setSides(display[index].Sides);
  //   if (display[index].Flavour) {
  //     setAddOn(display[index].Flavour);
  //   } else {
  //     setAddOn([]);
  //   }
  //   setOption1(display[index].Picked);
  //   setInstruction(display[index].instruction);
  // }
  // function toggleNumberInArray1(number) {
  //   setAddOn((prev) => {
  //     const array = [...prev];
  //     const index = array.indexOf(number);
  //     if (index === -1) {
  //       // Number is not in the array, so add it
  //       array.push(number);
  //     } else {
  //       // Number is already in the array, so remove it
  //       array.splice(index, 1);
  //     }
  //     return array;
  //   });
  // }
  // function handleChoose(name) {
  //   const indexToUpdate = cartItems.findIndex(
  //     (obj) => Object.keys(obj)[0] === name
  //   );
  //   setDisplay(cartItems[indexToUpdate][name]);
  // }
  // function press() {
  //   navigation.navigate("Order Receipt", {
  //     total: getTotalSum().toFixed(2),
  //     items: temp,
  //     id: id,
  //   });
  // }
  // function move() {
  //   navigation.navigate("Order History");
  // }
  // // Example usage:
  function onPress() {
    navigation.navigate("Address");
  }
  // function handleProductClick(item, index){
  //   let product = item.products[0]
  //   dispatch(deleteFromCart({ id: {'index': index} }));
  //   navigation.navigate('Product',{product, productData: item})
  // }
  const renderCartItem = ({ item, index }) => {
    const product = item.products[0]; // Assuming only one product per cart entry
    return (
      <ProductAction component={item.components} instruction={item.instructions} onTap={()=> handleProductClick(item, index)} title={product.title} options={item.options} side={item.extra} image={product.images[0]}  price={calculateTotalPrice(item)} action={<Pressable onPress={()=>handleDeleteFromCart(index)} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={35} color="#B22334" /></Pressable>}><View
      style={{
        backgroundColor: "black",
        width: 30,
        height: 30,
        borderRadius: 80,
        alignSelf: "flex-end",
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{  fontSize: 15, color: 'white' }}>
        {item.products.length}
      </Text>
    </View></ProductAction>
    );
  };
  const [isCoDelivery, setIsCoDelivery] = useState(false);
  
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
  const handleQuantityChange = (id, change) => {
    // Logic to increase or decrease quantity
  };

  const totalOrderPrice = cartItems?.reduce((sum, item) => sum + calculateTotalPrice(item), 0);
  
  const taxesAndFees = 0.3 * totalOrderPrice;
  const total = totalOrderPrice + taxesAndFees + (num == 0 ?  2 : 0) ;
  return (
    <View style={styles.container}>
       {isLoading ? (
        // Render loading indicator while loading
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<>
      {/* Header Section */}
      <View style={styles.headerSection}>
      
      </View>
    
      {/* Delivery Section */}
      <View style={styles.deliverySection}>
      <Text style={styles.text}>Delivery Mode</Text>
      <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {mode.map(({ mode, time, fastest }, idx) => (
          <Pressable key={idx} onPressIn={() => handleSelect(idx)}>
            <DeliveryMode
              mode={mode}
              time={time}
              special={fastest}
              active={num === idx}
            />
          </Pressable>
      ))}
    </View>
        <View style={styles.addressRow}>
          {address.length > 0 && (
              <AddressEditable
                title={address[0].name}
                address={address[0].address}
                onPress={addressHandler}
              />
            )}
            {!address.length && (
              <View style={[{ height: 50, paddingHorizontal: 40, width: '100%' }]}>
                <FlexButton onPress={onPress}>
                  <Text style={{ fontSize: 18 }}>Add Address</Text>
                </FlexButton>
              </View>
            )}
            <TouchableOpacity onPress={()=>setInstruct(prev=> !prev)} style={{ borderWidth: 2,
    borderColor: "#rgba(0,0,0,0.05)",
    borderRadius: 15,
    padding: 10,}} ><Svg xmlns="http://www.w3.org/2000/svg" width={23} height={23} viewBox="0 0 512 512"><Path d="M0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L185.6 508.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-80-96 0c-35.3 0-64-28.7-64-64L0 64zM128 240a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm128 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm160-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></Svg>
        </TouchableOpacity>
           </View>
        
           {instruct && <TextInput
        style={styles.notesInput}
        placeholder="Delivery Notes"
      />}
           
      </View>

      {/* Order Section */}
      <View style={styles.orderSection}>
        <FlatList
        data={cartItems}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCartItem}
        />
      </View>
      {/* Payment Section */}
      <View style={styles.paymentSection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order</Text>
          <Text style={styles.summaryValue}>${totalOrderPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>From free to $2</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes & Fees</Text>
          <Text style={styles.summaryValue}>${taxesAndFees.toFixed(2)}</Text>
        </View>
        <TouchableOpacity onPress={(address.length && cartItems.length > 0) ? checkOut : () => { }} style={[styles.payButton,
        {backgroundColor: !(address.length && cartItems.length > 0) ? "rgba(0,0,0,0.05)" : "white"}
        ]}>
          <Text style={styles.payButtonText}>Pay</Text>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
      {visible && (
    <Pressable
      onPress={() => navigation.navigate("HomeTabs")}
      style={{
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        justifyContent: "center",
        zIndex: 2,
        position: "absolute",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.9)",
      }}
    >
      <OrderSuccess onPress={press} onMove={move} />
    </Pressable>
  )}</>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "",
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 5,
  },
  cartText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemsCount: {
    color: '#888',
  },
  paymentIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesInput: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  deliverySection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  coDeliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coDeliveryText: {
    fontSize: 16,
  },
  deliveryTimeText: {
    fontSize: 16,
    color: '#FFA500',
  },
  addressRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3
    
  },
  addressText: {
    fontSize: 16,
    color: '#888',
  },
  orderSection: {
    flex: 1,
    paddingHorizontal: 16,
    // marginBottom: 50,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#888',
    marginTop: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    padding: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  quantity: {
    fontSize: 16,
  },
  paymentSection: {
    backgroundColor: '#333',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 10,
    width: width,
    // padding: 16,
    padding: 16,
    // position: 'absolute',
    bottom: 0
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#888',
  },
  summaryValue: {
    fontSize: 16,
    color: 'white'
    // fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
    paddingVertical: 10,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: 'black',
  },
});

export default CheckoutScreen


{/* <GestureHandlerRootView style={{ flex: 1 }}>
{isLoading ? (
  // Render loading indicator while loading
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" /></View>
) : (<><ScrollView
  onTouchStart={() => ref2?.current?.scrollTo(0)}
  style={{ marginBottom: "29%", paddingTop: 10 }}
>
  <View style={styles.recommendedView}>
    <Text style={styles.text}>Shipping Address</Text>
    <View style={{ flex: 1 }}>
      {address.length > 0 && (
        <AddressEditable
          title={address[0].name}
          address={address[0].address}
          onPress={addressHandler}
        />
      )}
      {!address.length && (
        <View style={[{ height: 65, paddingHorizontal: 40 }]}>
          <FlexButton onPress={onPress}>
            <Text style={{ fontSize: 18 }}>Add Address</Text>
          </FlexButton>
        </View>
      )}
    </View>
  </View>
  <View style={styles.recommendedView}>
    <Text style={styles.text}>Delivery Mode</Text>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {mode.map(({ mode, time, fastest }, idx) => (
        <View key={idx} style={{ width: "48%" }}>
          <Pressable onPressIn={() => handleSelect(idx)}>
            <DeliveryMode
              mode={mode}
              time={time}
              special={fastest}
              active={num === idx}
            />
          </Pressable>
        </View>
      ))}
    </View>
  </View>
  <View style={styles.recommendedView}>
    <Text style={styles.text}>Order Items</Text>
    <View style={{ gap: 20 }}>
        <FlatList
        data={cartItems}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCartItem}
      />
    </View>
  </View>
  <View
    style={[
      styles.recommendedView,
      {
        marginVertical: "10%",
        marginTop: "5%",
        marginHorizontal: "5%",
        paddingBottom: "2%",
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.05)",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      },
    ]}
  >
    <Text style={styles.text}>Delivery Fee</Text>
    <Text style={styles.text}>+$2.62</Text>
  </View>
</ScrollView>

  <View
    style={{
      flex: 1,
      width: "100%",
      paddingVertical: "7%",
      position: "absolute",
      bottom: 0,
      zIndex: 1,
      backgroundColor: "white",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    }}
  >
    <View
      style={{
        height: "150%",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Text
        style={{
          color: "#aaa",
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {" "}
        Total Payment
      </Text>
      <Text
        style={{
          color: "black",
          fontWeight: "600",
          fontSize: 20,
        }}
      >
        {" "}
        {`$${getTotalSum().toFixed(2)}`}
      </Text>
    </View>
    <View style={{ width: "45%", height: "130%" }}>
      <FlexButton
        background={!address.length ? "rgba(0,0,0,0.5)" : "#283618"}
        onPress={pressHandler}
      >
        <Fontisto name="credit-card" size={24} color="white" />
        <Text style={{ color: "white" }}>Make Payment</Text>
      </FlexButton>
    </View>
  </View>
  <BottomSheet ref={ref2}>
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: "5%",
        gap: 20,
      }}
    >
      <View style={{ marginBottom: 590, gap: 30 }}>
        {display.map(
          (
            { Flavour, instruction, Sides, Picked, title, images, oldPrice },
            idx
          ) => (
            <View key={idx}>
              <ProductDescription
                option={Picked}
                instruction={instruction}
                flavour={getFlavors(Flavour)}
                side={Sides}
                price={oldPrice}
                image={images[0]}
                title={title}
              />
            </View>
          )
        )}
      </View>
    </ScrollView>
  </BottomSheet>
  <BottomSheet ref={ref3}>
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: "5%",
        gap: 20,
      }}
    >
      <View style={{ marginBottom: 590 }}>
        {pro.addOn && (
          <View style={{ gap: 25, paddingTop: 30, marginBottom: 50 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: "black", fontWeight: "900", fontSize: 19 }}
              >
                {"Choose Exotic Flavor"}
              </Text>
              {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//             </View>
//             <Text
//               style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
//             >{`Choose up to ${2}`}</Text>
//             {pro.extras.map((item, idx) => (
//               <View
//                 key={idx}
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   borderBottomWidth: 1,
//                   borderColor: "rgba(0,0,0,0.05)",
//                   paddingBottom: 15,
//                 }}
//               >
//                 <View>
//                   <Text
//                     style={{
//                       color: "black",
//                       fontWeight: "900",
//                       fontSize: 16,
//                     }}
//                   >
//                     {item}
//                   </Text>
//                 </View>
//                 <Pressable
//                   onPress={() => {
//                     addOn1.length < 2 || addOn1.indexOf(idx) !== -1
//                       ? toggleNumberInArray1(idx)
//                       : {};
//                   }}
//                 >
//                   <MaterialCommunityIcons
//                     name={`${addOn1.indexOf(idx) === -1
//                         ? "checkbox-blank-outline"
//                         : "checkbox-marked"
//                       }`}
//                     size={24}
//                     color={`${addOn1.length < 2 || addOn1.indexOf(idx) !== -1
//                         ? "black"
//                         : "rgba(0,0,0,0.05)"
//                       }`}
//                   />
//                 </Pressable>
//               </View>
//             ))}
//           </View>
//         )}
//         {pro.options && (
//           <View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginTop: 15,
//                 borderColor: "rgba(0,0,0,0.05)",
//                 paddingBottom: 15,
//               }}
//             >
//               <Text
//                 style={{ color: "black", fontWeight: "900", fontSize: 19 }}
//               >
//                 {"Choose One"}
//               </Text>
//               <View style={{ width: width / 3.7, height: "170%" }}>
//                 <FlexButton
//                   onPress={option1 ? handleUpdate : () => { }}
//                   background={option1 < 2 ? "rgba(0,0,0,0.5)" : "#283618"}
//                 >
//                   <Text
//                     style={{
//                       color: "white",
//                       fontWeight: 900,
//                       fontSize: 15,
//                     }}
//                   >
//                     Update
//                   </Text>
//                 </FlexButton>
//               </View>
//             </View>
//             <View
//               style={{
//                 padding: 6,
//                 borderRadius: 15,
//                 backgroundColor: "rgba(0,0,0,0.1)",
//                 width: width / 5,
//                 alignItems: "center",
//               }}
//             >
//               <Text
//                 style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
//               >
//                 Required
//               </Text>
//             </View>
//             {pro.options.map((item, idx) => (
//               <View
//                 key={idx}
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   borderBottomWidth: 1,
//                   borderColor: "rgba(0,0,0,0.05)",
//                   paddingVertical: 13,
//                 }}
//               >
//                 <View>
//                   <Text
//                     style={{
//                       color: "black",
//                       fontWeight: "900",
//                       fontSize: 16,
//                     }}
//                   >
//                     {item}
//                   </Text>
//                 </View>
//                 <Pressable
//                   onPress={() => {
//                     setOption1(pro.options[idx]);
//                   }}
//                 >
//                   <Ionicons
//                     name={`${pro.options[idx] == option1
//                         ? "radio-button-on"
//                         : "radio-button-off"
//                       }`}
//                     size={24}
//                     color="black"
//                   />
//                 </Pressable>
//               </View>
//             ))}
//           </View>
//         )}
//         {pro.nutrient && pro.nutrient == "protein" && (
//           <View style={{ gap: 25, paddingTop: 30 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Text
//                 style={{ color: "black", fontWeight: "900", fontSize: 19 }}
//               >
//                 {"Pick Your Sides"}
//               </Text>
//               <View style={{ width: width / 3.7, height: "170%" }}>
//                 <FlexButton
//                   onPress={plus1.length == 2 ? handleUpdate : () => { }}
//                   background={
//                     plus1.length < 2 ? "rgba(0,0,0,0.5)" : "#283618"
//                   }
//                 >
//                   <Text
//                     style={{
//                       color: "white",
//                       fontWeight: 900,
//                       fontSize: 15,
//                     }}
//                   >
//                     Update
//                   </Text>
//                 </FlexButton>
//               </View>
//             </View>
//             <Text
//               style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
//             >{`Choose ${2}`}</Text>
//             <View
//               style={{
//                 padding: 6,
//                 borderRadius: 15,
//                 backgroundColor: "rgba(0,0,0,0.1)",
//                 width: width / 5,
//                 alignItems: "center",
//               }}
//             >
//               <Text
//                 style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
//               >
//                 Required
//               </Text>
//             </View>

//             {pro.extras.map((item, idx) => (
//               <View
//                 key={idx}
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   borderBottomWidth: 1,
//                   borderColor: "rgba(0,0,0,0.05)",
//                   paddingBottom: 15,
//                 }}
//               >
//                 <View>
//                   <Text
//                     style={{
//                       color: "black",
//                       fontWeight: "900",
//                       fontSize: 16,
//                     }}
//                   >
//                     {item[0]}
//                   </Text>
//                   <Text>{item[1] ? `+ $${item[1]}` : ""}</Text>
//                 </View>
//                 {(plus1.length < 2 ||
//                   (plus1.length && plus1.indexOf(item[0]) !== -1)) && (
//                     <View>
//                       <IncrementDecrementBtn
//                         minValue={foodDictionary[item[0]]}
//                         onIncrease={() => {
//                           if (plus1.length < 2) {
//                             setFoodDictionary((prev) => {
//                               return {
//                                 ...prev,
//                                 [item[0]]: foodDictionary[item[0]] + 1,
//                               };
//                             });
//                             setSides((prev) => {
//                               const arr = [...prev];
//                               arr.push(item[0]);
//                               return arr;
//                             });
//                           }
//                         }}
//                         onDecrease={() => {
//                           if (plus1.length > 0) {
//                             setFoodDictionary((prev) => {
//                               return {
//                                 ...prev,
//                                 [item[0]]:
//                                   (foodDictionary[item[0]]
//                                     ? foodDictionary[item[0]]
//                                     : 1) - 1,
//                               };
//                             });
//                             setSides((prev) => {
//                               const arr = [...prev];
//                               const index = prev.indexOf(item[0]);
//                               if (index != -1) {
//                                 arr.splice(index, 1);
//                               }
//                               return arr;
//                             });
//                           }
//                         }}
//                       />
//                     </View>
//                   )}
//               </View>
//             ))}
//           </View>
//         )}
//         {pro.instructions && (
//           <View
//             style={{ color: "white", backgroundColor: "rgba(0,0,0,0.05)" }}
//           >
//             <TextInput
//               multiline
//               placeholder="Special Instructions?"
//               cursorColor={"#aaa"}
//               numberOfLines={6}
//               clearButtonMode="always"
//               style={{ paddingHorizontal: 10 }}
//             />
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   </BottomSheet>
//   <View
//     style={{
//       flex: 1,
//       width: "100%",
//       paddingVertical: "7%",
//       position: "absolute",
//       bottom: 0,
//       zIndex: 1,
//       backgroundColor: "white",
//       flexDirection: "row",
//       justifyContent: "space-around",
//       alignItems: "center",
//     }}
//   >
//     <View
//       style={{
//         height: "150%",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//       }}
//     >
//       <Text
//         style={{
//           color: "#aaa",
//           fontWeight: "bold",
//           fontSize: 20,
//         }}
//       >
//         {" "}
//         Total Payment
//       </Text>
//       <Text
//         style={{
//           color: "black",
//           fontWeight: "600",
//           fontSize: 20,
//         }}
//       >
//         {" "}
//         {`$${getTotalSum().toFixed(2)}`}
//       </Text>
//     </View>
//     <View style={{ width: "45%", height: "130%" }}>
//       <FlexButton
//         background={!address.length ? "rgba(0,0,0,0.5)" : "#283618"}
//         // onPress={tryCreateOrder}
//         onPress={address.length ? checkOut : () => { }}
//       >
//         <Fontisto name="credit-card" size={24} color="white" />
//         <Text style={{ color: "white" }}>Make Payment</Text>
//       </FlexButton>
//     </View>
//   </View>
//   {visible && (
//     <Pressable
//       onPress={() => navigation.navigate("HomeTabs")}
//       style={{
//         flex: 1,
//         padding: 20,
//         alignItems: "center",
//         justifyContent: "center",
//         justifyContent: "center",
//         zIndex: 2,
//         position: "absolute",
//         height: "100%",
//         backgroundColor: "rgba(0,0,0,0.9)",
//       }}
//     >
//       <OrderSuccess onPress={press} onMove={move} />
//     </Pressable>
//   )}</>)}
// </GestureHandlerRootView> */}