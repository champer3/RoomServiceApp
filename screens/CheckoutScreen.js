import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexButton from "../components/Buttons/FlexButton";
import ProductAction from "../components/Product/ProductAction";
import { Fontisto } from "@expo/vector-icons";
import AddressEditable from "../components/AddressEditable";
import DeliveryMode from "../components/DeliveryMode";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import {
  clearCart,
  completeOrder,
  addToCart,
  removeFromCart,
  deleteFromCart,
  addOptions,
  deleteItem,
  updateCart,
} from "../Data/cart";
import OrderSuccess from "../components/Modals/OrderSuccess";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet from "../components/Modals/BottomSheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import ProductDescription from "../components/Product/ProductDescription";
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
const { width, height } = Dimensions.get("window");

function CheckoutScreen() {
  const [visible, setVisible] = useState(false);
  const orders = useSelector((state) => state.cartItems.order);
  console.log(orders);
  const mode = [
    { mode: "Faster (+$2)", time: "10-15\nMinutes", fastest: true },
    { mode: "Fast", time: "30-45 \nMinutes", fastest: false },
    { mode: "Schedule", time: "Pick a \ndelivery time", fastest: false },
  ];
  const [cartItems, setCartItems] = useState([
    ...useSelector((state) => state.cartItems.ids),
  ]);

  function getFlavors(flavor) {
    if (flavor) {
      var res = [];
      for (var i = 0; i < flavor.length; i++) {
        res.push(display[0].extras[flavor[i]]);
      }
      return res;
    }
    return [];
  }
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
    if (display[index].Sides) {
      for (let i = 0; i < display[index].Sides.length; i++) {
        foodDictionary[display[index].Sides[i]]++;
      }
    }
    return foodDictionary;
  }
  const productItems = useSelector((state) => state.productItems.ids);

  // Example usage:
  let [foodStore, setFood] = useState({});
  const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro, setPro] = useState({});
  const data = useSelector((state) => state.profileData.profile);
  const address = [...data.address];
  const dispatch = useDispatch();
  const temp = [...cartItems];
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setNum(selectedIndex);
  };
  function findPrice(foodName) {
    for (let i = 0; i < pro.extras.length; i++) {
      if (pro.extras[i][0] === foodName) {
        return pro.extras[i][1];
      }
    }
    return "Item not found in the menu";
  }
  const navigation = useNavigation();
  function pressHandler() {
    if (address.length) {
      navigation.navigate("Make Payment", { total: getTotalSum().toFixed(2) });
    }
  }
  function press() {
    navigation.navigate("Order Receipt", {
      total: getTotalSum().toFixed(2),
      items: temp,
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
        console.log("Token not found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  const tryCreateOrder = async () => {
    try {
      console.log("DID WE TRY TO CREATE AN ORDERRRR?????")
      const token = await retrieveTokenFromAsyncStorage();
      const createOrder = await axios.post(
        "http://10.0.0.173:3000/api/v1/orders",
        {
          totalPrice: getTotalSum(),
          paymentStatus: true,
          shippingAddress: address[0].address,
          paymentMothod: "card",
          productID: "6539bbdb213c1eeedffb7df3",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          },
        }
      );
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
  const id = generateRandomId(8);
  function getTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return today.toString();
  }
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const checkOut = async () => {
    const token = await retrieveTokenFromAsyncStorage();
    console.log("This is the token I recieved: ", token);
    const response = await axios.post(
      "http://10.0.0.173:3000/api/v1/payments/checkout-session",
      {
        amount: getTotalSum(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',  // adjust the content type based on your API requirements
        },
      }
    );
    console.log("got here");
    console.log(response.data);
    const initPayment = await initPaymentSheet({
      merchantDisplayName: "RoomService",
      paymentIntentClientSecret: response.data.clientSecret,
      customerEphemeralKeySecret: response.data.ephemeralKey,
      customerId: response.data.customer,
      // defaultBillingDetails: {
      //   name: 'Jane Doe',
      // }
    });

    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      const row = [...cartItems];
      date = getTodaysDate();

      for (var i = 0; i < cartItems.length; i++) {
        row[i] = { ...cartItems[i], ["reviews"]: false };
      }
      dispatch(
        completeOrder({
          id: {
            id: id,
            order: row,
            date: date,
            status: "Delivering",
            address: address[0].address,
            price: `$${getTotalSum().toFixed(2)}`,
          },
        })
      );
      dispatch(clearCart({ id: cartItems }));
      setVisible(true);
      console.log("ARE WE HERE????");
      // const paymentMethods = await axios.post(
      //   "http://10.0.0.173:3000/api/v1/payments/payment-methods",
      //   null,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json", // adjust the content type based on your API requirements
      //     },
      //   }
      // );
      tryCreateOrder();
      Alert.alert("Success", "Your order is confirmed!");
      navigation.navigate("Home");
    }

    // console.log("async nigga pressed")
  };

  function addressHandler() {
    navigation.navigate("Confirm Address");
  }
  function getTotalSum() {
    var totalPrice = 2.62 + (num == 0 ? 2 : 0);
    cartItems.forEach((obj) => {
      const title = Object.keys(obj)[0];
      const titleArray = Object.values(obj)[0];

      titleArray.forEach((item) => {
        totalPrice += item.oldPrice;
      });
      cost[title] = totalPrice;
    });
    return totalPrice;
  }
  const cost = {};
  function addQuantityToObjects(inputList) {
    const titleCountMap = {};

    const result = {};
    inputList.forEach((obj) => {
      const title = Object.keys(obj)[0];
      const arrayLength = obj[title].length;
      result[title] = arrayLength;
    });
    // Loop through the inputList to count occurrences of each title
    inputList.forEach((obj) => {
      const title = obj.title;

      // Increment the count for the title or initialize to 1 if it doesn't exist
      titleCountMap[title] = (titleCountMap[title] || 0) + 1;
    });

    inputList.forEach((obj) => {
      var totalPrice = 0;
      const title = Object.keys(obj)[0];
      const titleArray = Object.values(obj)[0];

      titleArray.forEach((item) => {
        totalPrice += item.oldPrice;
      });
      cost[title] = totalPrice;
    });
    // Loop through the inputList again to create a new list with quantity key
    const newList = inputList.map((obj) => {
      const title = Object.keys(obj)[0];
      const quantity = result[title];

      // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
      titleCountMap[title] = 0;

      return { ...obj[title][0], ["oldPrice"]: cost[title], quantity };
    });
    const filteredList = newList.filter((obj) => obj.quantity !== 0);

    return filteredList;
  }
  const [display, setDisplay] = useState([]);
  const ref2 = useRef(null);
  const ref3 = useRef();
  function handleUpdate() {
    let price = 0;
    let newItem = {};
    if (plus1) {
      for (var i = 0; i < plus1.length; i++) {
        price += findPrice(plus1[i]);
      }
      newItem = { ...newItem, ...{ Sides: plus1 } };
    }
    if (option1) {
      newItem = { ...newItem, ...{ Picked: option1 } };
    }
    if (addOn1 && addOn1.length > 0) {
      newItem = { ...newItem, ...{ Flavour: addOn1 } };
    }
    ref3?.current?.scrollTo(0);
    ref2?.current?.scrollTo(0);
    dispatch(
      updateCart({
        id: {
          title: pro.title,
          index: index,
          newItem: { ...pro, ...newItem, ["oldPrice"]: pro.oldPrice + price },
        },
      })
    );
  }
  const [plus1, setSides] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [addOn1, setAddOn] = useState([]);
  const [option1, setOption1] = useState(null);
  const [num, setNum] = useState(0);

  function handleEdit(name, index) {
    ref3?.current?.scrollTo(-570);
    ref2?.current?.scrollTo(0);
    let product = [];
    productItems.forEach((item) => {
      if (item.title == name) {
        product = item;
      }
    });
    if (product.extras) {
      setFoodDictionary(countFoodDictionary(product.extras, index));
    }
    setIndex(index);
    setPro(product);
    setSides(display[index].Sides);
    if (display[index].Flavour) {
      setAddOn(display[index].Flavour);
    } else {
      setAddOn([]);
    }
    setOption1(display[index].Picked);
    setInstruction(display[index].instruction);
  }
  function toggleNumberInArray1(number) {
    setAddOn((prev) => {
      const array = [...prev];
      const index = array.indexOf(number);
      if (index === -1) {
        // Number is not in the array, so add it
        array.push(number);
      } else {
        // Number is already in the array, so remove it
        array.splice(index, 1);
      }
      return array;
    });
  }
  function handleChoose(name) {
    const indexToUpdate = cartItems.findIndex(
      (obj) => Object.keys(obj)[0] === name
    );
    setDisplay(cartItems[indexToUpdate][name]);
  }
  function press() {
    navigation.navigate("Order Receipt", {
      total: getTotalSum().toFixed(2),
      items: temp,
      id: id,
    });
  }
  function move() {
    navigation.navigate("Order History");
  }
  // Example usage:
  function onPress() {
    navigation.navigate("Address");
  }
  const newList = addQuantityToObjects(cartItems);
  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView
        onTouchStart={() => ref2?.current?.scrollTo(0)}
        style={{ marginBottom: "19%" }}
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
              <View key={idx} style={{ width: "30%" }}>
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
            {newList.map(({ title, image, quantity, oldPrice }, idx) => (
              <ProductAction
                key={idx}
                price={oldPrice}
                title={title}
                image={image}
                onTap={() => {
                  ref2?.current?.scrollTo(-570);
                  handleChoose(newList[idx].title);
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    paddingHorizontal: 25,
                    paddingVertical: 8,
                    borderRadius: 80,
                    alignSelf: "flex-end",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {quantity}
                  </Text>
                </View>
              </ProductAction>
            ))}
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
                { Flavour, instruction, Sides, Picked, title, image, oldPrice },
                idx
              ) => (
                <View key={idx}>
                  <ProductDescription
                    option={Picked}
                    instruction={instruction}
                    flavour={getFlavors(Flavour)}
                    side={Sides}
                    price={oldPrice}
                    image={image}
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
                </View>
                <Text
                  style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
                >{`Choose up to ${2}`}</Text>
                {pro.extras.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderColor: "rgba(0,0,0,0.05)",
                      paddingBottom: 15,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: 16,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        addOn1.length < 2 || addOn1.indexOf(idx) !== -1
                          ? toggleNumberInArray1(idx)
                          : {};
                      }}
                    >
                      <MaterialCommunityIcons
                        name={`${
                          addOn1.indexOf(idx) === -1
                            ? "checkbox-blank-outline"
                            : "checkbox-marked"
                        }`}
                        size={24}
                        color={`${
                          addOn1.length < 2 || addOn1.indexOf(idx) !== -1
                            ? "black"
                            : "rgba(0,0,0,0.05)"
                        }`}
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
            {pro.options && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 15,
                    borderColor: "rgba(0,0,0,0.05)",
                    paddingBottom: 15,
                  }}
                >
                  <Text
                    style={{ color: "black", fontWeight: "900", fontSize: 19 }}
                  >
                    {"Choose One"}
                  </Text>
                  <View style={{ width: width / 3.7, height: "170%" }}>
                    <FlexButton
                      onPress={option1 ? handleUpdate : () => {}}
                      background={option1 < 2 ? "rgba(0,0,0,0.5)" : "#283618"}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: 900,
                          fontSize: 15,
                        }}
                      >
                        Update
                      </Text>
                    </FlexButton>
                  </View>
                </View>
                <View
                  style={{
                    padding: 6,
                    borderRadius: 15,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    width: width / 5,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
                  >
                    Required
                  </Text>
                </View>
                {pro.options.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderColor: "rgba(0,0,0,0.05)",
                      paddingVertical: 13,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: 16,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setOption1(pro.options[idx]);
                      }}
                    >
                      <Ionicons
                        name={`${
                          pro.options[idx] == option1
                            ? "md-radio-button-on"
                            : "md-radio-button-off"
                        }`}
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
            {pro.nutrient && pro.nutrient == "protein" && (
              <View style={{ gap: 25, paddingTop: 30 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "black", fontWeight: "900", fontSize: 19 }}
                  >
                    {"Pick Your Sides"}
                  </Text>
                  <View style={{ width: width / 3.7, height: "170%" }}>
                    <FlexButton
                      onPress={plus1.length == 2 ? handleUpdate : () => {}}
                      background={
                        plus1.length < 2 ? "rgba(0,0,0,0.5)" : "#283618"
                      }
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: 900,
                          fontSize: 15,
                        }}
                      >
                        Update
                      </Text>
                    </FlexButton>
                  </View>
                </View>
                <Text
                  style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
                >{`Choose ${2}`}</Text>
                <View
                  style={{
                    padding: 6,
                    borderRadius: 15,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    width: width / 5,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "black", fontWeight: "bold", fontSize: 13 }}
                  >
                    Required
                  </Text>
                </View>

                {pro.extras.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderColor: "rgba(0,0,0,0.05)",
                      paddingBottom: 15,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: 16,
                        }}
                      >
                        {item[0]}
                      </Text>
                      <Text>{item[1] ? `+ $${item[1]}` : ""}</Text>
                    </View>
                    {(plus1.length < 2 ||
                      (plus1.length && plus1.indexOf(item[0]) !== -1)) && (
                      <View>
                        <IncrementDecrementBtn
                          minValue={foodDictionary[item[0]]}
                          onIncrease={() => {
                            if (plus1.length < 2) {
                              setFoodDictionary((prev) => {
                                return {
                                  ...prev,
                                  [item[0]]: foodDictionary[item[0]] + 1,
                                };
                              });
                              setSides((prev) => {
                                const arr = [...prev];
                                arr.push(item[0]);
                                return arr;
                              });
                            }
                          }}
                          onDecrease={() => {
                            if (plus1.length > 0) {
                              setFoodDictionary((prev) => {
                                return {
                                  ...prev,
                                  [item[0]]:
                                    (foodDictionary[item[0]]
                                      ? foodDictionary[item[0]]
                                      : 1) - 1,
                                };
                              });
                              setSides((prev) => {
                                const arr = [...prev];
                                const index = prev.indexOf(item[0]);
                                if (index != -1) {
                                  arr.splice(index, 1);
                                }
                                return arr;
                              });
                            }
                          }}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
            {pro.instructions && (
              <View
                style={{ color: "white", backgroundColor: "rgba(0,0,0,0.05)" }}
              >
                <TextInput
                  multiline
                  placeholder="Special Instructions?"
                  cursorColor={"#aaa"}
                  numberOfLines={6}
                  clearButtonMode="always"
                  style={{ paddingHorizontal: 10 }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </BottomSheet>
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
            // onPress={tryCreateOrder}
            onPress={checkOut}
          >
            <Fontisto name="credit-card" size={24} color="white" />
            <Text style={{ color: "white" }}>Make Payment</Text>
          </FlexButton>
        </View>
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
      )}
    </GestureHandlerRootView>
  );
}

export default CheckoutScreen;

const styles = StyleSheet.create({
  catHead: {
    justifyContent: "space-between",
    gap: 19,
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
});
