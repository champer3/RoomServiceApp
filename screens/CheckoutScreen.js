import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
import { clearCart, completeOrder } from "../Data/cart";
import OrderSuccess from "../components/Modals/OrderSuccess";
import AsyncStorage from "@react-native-async-storage/async-storage";


function CheckoutScreen() {
  const [visible, setVisible] = useState(false);
  const orders = useSelector((state) => state.cartItems.order);
  const mode = [
    { mode: "Faster (+$2)", time: "10-15\nMinutes", fastest: true },
    { mode: "Fast", time: "30-45 \nMinutes", fastest: false },
    { mode: "Schedule", time: "Pick a \ndelivery time", fastest: false },
  ];
  const [cartItems, setCartItems] = useState([
    ...useSelector((state) => state.cartItems.ids),
  ]);
  const data = useSelector((state) => state.profileData.profile);
  const address = [...data.address];
  const dispatch = useDispatch();
  const temp = [...cartItems];
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
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

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const checkOut =  () => {
    // const token = await retrieveTokenFromAsyncStorage();
    // console.log("This is the token I recieved: ", token);
    // const response = await axios.post(
    //   "http://10.0.0.173:3000/api/v1/payments/checkout-session",
    //   null,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       // 'Content-Type': 'application/json',  // adjust the content type based on your API requirements
    //     },
    //   }
    // );
    // console.log("got here");
    // console.log(response.data);
    // const initPayment = await initPaymentSheet({
    //   merchantDisplayName: "RoomService",
    //   paymentIntentClientSecret: response.data.clientSecret,
    //   customerEphemeralKeySecret: response.data.ephemeralKey,
    //   customerId: response.data.customer,
    //   // defaultBillingDetails: {
    //   //   name: 'Jane Doe',
    //   // }
    // });

    // const { error } = await presentPaymentSheet();
    // if (error) {
    //   Alert.alert(`Error code: ${error.code}`, error.message);
    // } else {
    //   Alert.alert("Success", "Your order is confirmed!");
    //   const paymentMethods = await axios.post(
    //     "http://10.0.0.173:3000/api/v1/payments/payment-methods",
    //     null,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         // 'Content-Type': 'application/json',  // adjust the content type based on your API requirements
    //       },
    //     }
    //   );
      const row = [...cartItems];
      for (var i = 0; i < cartItems.length; i++) {
        row[i] = { ...cartItems[i], ["reviews"]: false };
      }
      dispatch(completeOrder({ id: [...orders, row] }));
      dispatch(clearCart({ id: cartItems }));
      setVisible(true);
      Alert.alert("Success", "Your order is confirmed!");
      // navigation.navigate("Home");
    // }
    // console.log("async nigga pressed")
  };

  function addressHandler() {
    navigation.navigate("Confirm Address");
  }
  function getTotalSum() {
    var totalPrice = 2.62 +
    (index == 0 ? 2 : 0);
    cartItems.forEach(obj => {
      const title = Object.keys(obj)[0];
        const titleArray = Object.values(obj)[0];
        
        titleArray.forEach(item => {
            totalPrice += item.oldPrice;
        });
        cost[title] = totalPrice
    });
    return totalPrice
  }
  const cost = {}
  function addQuantityToObjects(inputList) {
    const titleCountMap = {};

      const result = {};
    inputList.forEach(obj => {
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
      
      
    inputList.forEach(obj => {
      var totalPrice = 0;
      const title = Object.keys(obj)[0];
        const titleArray = Object.values(obj)[0];
        
        titleArray.forEach(item => {
            totalPrice += item.oldPrice;
        });
        cost[title] = totalPrice
    });
      // Loop through the inputList again to create a new list with quantity key
      const newList = inputList.map((obj) => {
          const title = Object.keys(obj)[0];
          const quantity = result[title];

          // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
          titleCountMap[title] = 0;

          return { ...obj[title][0], ['oldPrice'] : cost[title], quantity };
      });
      const filteredList = newList.filter((obj) => obj.quantity !== 0);

      return filteredList;
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
  // Example usage:
  function onPress() {
    navigation.navigate("Address");
  }
  const newList = addQuantityToObjects(cartItems);
  return (
    <View>
      <ScrollView style={{ marginBottom: "19%" }}>
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
                    active={index === idx}
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
                price={oldPrice * quantity}
                title={title}
                image={image}
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
    </View>
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
