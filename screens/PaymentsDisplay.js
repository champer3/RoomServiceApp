import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { useState } from "react";
import FlexButton from "../components/Buttons/FlexButton";
import Input from "../components/Inputs/Input";
import { Octicons } from "@expo/vector-icons";
import CreditCard from "../components/CreditCard";
import BottomSheet from "../components/Modals/BottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useCallback, useRef } from "react";
import CardCat from "../components/CardCat";
import { Entypo } from "@expo/vector-icons";
import Info from "../components/Info";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Data/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";


const retrieveTokenFromAsyncStorage = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("authToken");
    console.log(storedToken);
    if (storedToken !== null) {
      console.log("Retrieved token:", storedToken);
      return storedToken
    } else {
      console.log("Token not found in AsyncStorage.");
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
};

const { width, height } = Dimensions.get("window");
function PaymentsDisplay() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.profileData.profile);
  const cards = [...data.payments];
  const [warning, setWarning] = useState();
  const [form, setForm] = useState({
    name: "",
    number: "",
    cvv: "",
    exp: "",
    card: "",
    id: cards.length,
  });
  const [scrollHeight, setScrollHeight] = useState(-450);
  const [index, setIndex] = useState(null);
  const [active, setActive] = useState(false);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const ref = useRef(null);
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    // ref?.current?.scrollTo(0);
    ref?.current?.scrollTo(-450);
    setScrollHeight(-450);
    setForm({
      name: "",
      number: "",
      cvv: "",
      exp: "",
      card: "",
      id: cards.length,
    });
    // handleUpdate([
    //   {
    //     id: 'pm_1OfVeuK5nIEAEdc38ZwCX0qx',
    //     object: 'payment_method',
    //     billing_details: { address: [Object], email: null, name: null, phone: null },
    //     card: {
    //       brand: 'visa',
    //       checks: [Object],
    //       country: 'US',
    //       exp_month: 12,
    //       exp_year: 2027,
    //       fingerprint: 'zu53W4k5crXMKJ08',
    //       funding: 'credit',
    //       generated_from: null,
    //       last4: '4242',
    //       networks: [Object],
    //       three_d_secure_usage: [Object],
    //       wallet: null
    //     },
    //     created: 1706914592,
    //     customer: 'cus_PUUHx7j4nv1aU6',
    //     livemode: false,
    //     metadata: {},
    //     type: 'card'
    //   }
    // ])
  });
  const onEditing = useCallback(() => {
    ref?.current?.scrollTo(-650);
    setScrollHeight(-650);
  });
  const methods = ["Debit Card", "Credit Card"];
  // const token = retrieveTokenFromAsyncStorage()
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YmQ2ZDgyZTVmYzlhMDJlYTM3YzAzMyIsImlhdCI6MTcwNjkxMzE1NywiZXhwIjoxNzA3Nzc3MTU3fQ.TwpnSDIBnTJPAB1BUjPkz8PPiDztuySl4JcqTHgruxU"
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const fetchPaymentSheet = async () => {
    const response = await axios.post(
      "http://10.0.0.173:3000/api/v1/payments/payment-sheet",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',  // adjust the content type based on your API requirements
        },
      }
    );
    console.log("got here");
    // console.log(response.data);
    const initPayment = await initPaymentSheet({
      merchantDisplayName: "RoomService",
      setupIntentClientSecret: response.data.setupIntent,
      customerEphemeralKeySecret: response.data.ephemeralKey,
      customerId: response.data.customer,
      // defaultBillingDetails: {
      //   name: 'Jane Doe',
      // }
    });
    console.log(initPayment)

    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      const paymentMethods = await axios.post(
        "http://10.0.0.173:3000/api/v1/payments/payment-methods",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json',  // adjust the content type based on your API requirements
          },
        }
      );
      handleUpdate(paymentMethods.data.paymentMethods)
      
      Alert.alert("Success", "Your order is confirmed!");
      // navigation.navigate("Home");
    }
  };
  function onPressHandler() {
    console.log("pressedddd")
    fetchPaymentSheet()
    // if (index != null) {
    //   setScrollHeight((prev) => (prev == -450 ? -550 : -450));
    //   ref?.current?.scrollTo(scrollHeight);
    // }
  }
  function handleUpdate(res) {
    const cards = []
    for (var i = 0; i < res.length; i ++){
      var image = "";
    if (res[i]['card']['brand'] === "amex") {
      image = require(`../assets/amex.png`);
    } else if (res[i]['card']['brand'] === "visa") {
      image = require(`../assets/visa.png`);
    } else if (res[i]['card']['brand'] === "discover") {
      image = require(`../assets/discover.png`);
    } else if (res[i]['card']['brand'] === "mastercard") {
      image = require(`../assets/mastercard.png`);
    }
    console.log(res[i]['card']['brand'])
      cards.push({card: res[i]['card']['brand'], number: res[i]['card']['last4'], image: image})
    }
    console.log(cards)
    var newData = {};
      newData = {
        ...data,
        ["payments"]: [...cards],
    }
    console.log(newData)
    dispatch(updateProfile({ id: newData }));
  }
  function handleEdit(index) {
    // Create a shallow copy of the data object
    const newData = { ...data, ["payments"]: [] };
    var image = "";
    if (getCardType(form.number) === "Amex") {
      image = require(`../assets/amex.png`);
    } else if (getCardType(form.number) === "Visa") {
      image = require(`../assets/visa.png`);
    } else if (getCardType(form.number) === "Discover") {
      image = require(`../assets/discover.png`);
    } else if (getCardType(form.number) === "Mastercard") {
      image = require(`../assets/mastercard.png`);
    }

    // Loop through the payments array
    for (let i = 0; i < data.payments.length; i++) {
      // If the current index is less than the specified index, copy the existing payment
      if (i !== index) {
        newData.payments.push(data.payments[i]);
      }
      // If the current index is equal to the specified index, append the form data
      else if (i === index) {
        newData.payments.push({
          ...form,
          ["card"]: getCardType(form.number),
          ["image"]: image,
        });
      }
    }
    // Return the new data object
    dispatch(updateProfile({ id: newData }));
  }
  
  function makeDefault(id) {
    const newData = {
      ...data,
      ["payments"]: [{ ...data.payments[id], ["id"]: 0 }],
    };
    var j = 1;
    for (let i = 0; i < data.payments.length; i++) {
      // If the current index is less than the specified index, copy the existing payment
      if (data.payments[i].id != id) {
        newData.payments.push({ ...data.payments[i], ["id"]: j });
        j += 1;
      }
    }
    dispatch(updateProfile({ id: newData }));
  }
  function isCardNotExpired(expiryDate) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Extract last two digits of the current year
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1

    const [expiryMonth, expiryYear] = expiryDate
      .split("/")
      .map((part) => parseInt(part, 10));

    // Check if the card has not expired
    if (
      expiryYear > currentYear ||
      (expiryYear === currentYear && expiryMonth >= currentMonth)
    ) {
      return true;
    } else {
      return false;
    }
  }
  function verifyPayment() {
    if (!form.name || !form.number || !form.cvv || !form.exp) {
      return "All fields are required.";
    }

    // Check credit card number validity
    // Remove spaces from the credit card number
    const cleanedNumber = form.number.replace(/\s/g, "");

    const creditCardRegex = /^\d{16}$/;
    if (getCardType(form.number) == "Unknown") {
      return `Invalid card number. Provide a valid card number`;
    }

    // Check CVV validity
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(form.cvv)) {
      return "Invalid CVV. It should be a 3-digit number.";
    }

    // Check expiration date validity (MM/YY format)
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(form.exp)) {
      return "Invalid expiration date. Please use MM/YY format.";
    } else if (!isCardNotExpired(form.exp)) {
      return "Card has expired. Provide a valid card";
    }

    // Additional checks for card type, name format, etc. can be added as needed

    // If all checks pass, payment method is considered valid
    return false;
  }
  function getCardType(cardNumber) {
    // Define regular expressions for different card types
    const cardTypes = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      // Add more card types as needed
    };
    // Remove spaces from the credit card number
    const cleanedNumber = cardNumber.replace(/\s/g, "");

    // Check the card number against each card type
    for (const type in cardTypes) {
      if (cardTypes[type].test(cleanedNumber)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }

    // If no match is found, return 'Unknown'
    return "Unknown";
  }
  const onDone = useCallback(() => {
    if (!verifyPayment()) {
      setScrollHeight((prev) => (prev == -450 ? -550 : -450));

      handleUpdate();
      setForm({
        name: "",
        number: "",
        cvv: "",
        exp: "",
        card: "",
        id: cards.length,
      });
      setIndex();
      setWarning();
      ref?.current?.scrollTo(0);
    } else {
      setWarning(verifyPayment());
    }
  });
  const onEdit = useCallback(() => {
    if (!verifyPayment()) {
      setScrollHeight((prev) => (prev == -450 ? -550 : -450));
      handleEdit(form.id);
      if (active) {
        makeDefault(form.id);
        setActive(false);
      }
      setForm({
        name: "",
        number: "",
        cvv: "",
        exp: "",
        card: "",
        id: cards.length,
      });
      setIndex();
      setWarning();
      ref?.current?.scrollTo(0);
    } else {
      setWarning(verifyPayment());
    }
  });
  function deleteAndUpdate(indexToDelete) {
    // Delete the object at the specified index
    const newData = { ...data, ["payments"]: [] };
    var j = 0;
    for (let i = 0; i < data.payments.length; i++) {
      // If the current index is less than the specified index, copy the existing payment
      if (i != indexToDelete) {
        newData.payments.push({ ...data.payments[i], ["id"]: j });
        j += 1;
      }
    }
    // Update the id property of other objects

    ref?.current?.scrollTo(0);
    setScrollHeight(-450);
    setForm({
      name: "",
      number: "",
      cvv: "",
      exp: "",
      card: "",
      id: cards.length,
    });
    setIndex();
    console.log("Updated List:", newData.payments);

    // Return the new data object
    dispatch(updateProfile({ id: newData }));
  }
  function handleFormChange(field, value) {
    if (field == "number") {
      const cleanedInput = value.replace(/\D/g, "");
      // Add brackets dynamically based on entered digits
      let formattedNumber = "";
      for (let i = 0; i < cleanedInput.length; i++) {
        if (i === 4) {
          formattedNumber += " ";
        } else if (i === 8) {
          formattedNumber += " ";
        } else if (i === 12) {
          formattedNumber += " ";
        }
        formattedNumber += cleanedInput[i];
      }
      value = formattedNumber;
    }
    if (field == "exp") {
      const cleanedInput = value.replace(/\D/g, "");
      let formattedNumber = "";
      for (let i = 0; i < cleanedInput.length; i++) {
        if (i === 2) {
          formattedNumber += "/";
        }
        formattedNumber += cleanedInput[i];
      }
      value = formattedNumber;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View>
          <ScrollView>
            <View style={[styles.recommendedView, { paddingBottom: "50%" }]}>
              {cards &&
                cards.length > 0 &&
                cards.map(({card, number, image}, idx) => (
                  <View key={idx}>
                    <Pressable>
                      <CreditCard
                        image={image}
                        onPress={() => {
                          onEditing();
                          setForm({ ...cards[idx] });
                        }}
                        card={card.toUpperCase()}
                        number={number}
                      />
                    </Pressable>
                  </View>
                ))}
              {!cards ||
                (!cards.length && (
                  <View style={{ gap: 19, marginBottom: 45 }}>
                    <View>
                      <Image
                        style={styles.image}
                        source={require("../assets/empty.png")}
                      />
                    </View>
                    <Text style={{ textAlign: "center" }}>
                      You currently have no saved payment method, add one to
                      ease your checkout.
                    </Text>
                  </View>
                ))}
              <View style={[{ height: 75 }]}>
                <FlexButton onPress={onPress}>
                  <Text style={{ fontSize: 18 }}>Add payment method</Text>
                </FlexButton>
              </View>
            </View>
          </ScrollView>
        </View>
        <BottomSheet ref={ref}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              paddingHorizontal: "5%",
            }}
          >
            {scrollHeight == -450 && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginVertical: 20,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Select Method</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 0.34,
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 35,
                      justifyContent: "center",
                    }}
                  >
                    {methods.map((item, id) => (
                      <View key={id} style={{ width: "45%" }}>
                        <Pressable
                          onPress={() => {
                            handleSelect(id);
                          }}
                        >
                          <CardCat active={index == id}>{item}</CardCat>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                  <View style={[{ height: 65 }]}>
                    <FlexButton
                      onPress={onPressHandler}
                      background={index == null ? "rgba(0,0,0,0.5)" : "#283618"}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>
                        Select
                      </Text>
                    </FlexButton>
                  </View>
                </View>
              </>
            )}
            {scrollHeight == -550 && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginVertical: 20,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Add Card</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Input
                    text={"Card Holder Name"}
                    textInputConfig={{
                      cursorColor: "#aaa",
                      value: form.name,
                      onChangeText: handleFormChange.bind(this, "name"),
                    }}
                  />
                  <Input
                    text={"Card Number"}
                    length={19}
                    keyboard="number-pad"
                    textInputConfig={{
                      cursorColor: "#aaa",
                      value: form.number,
                      onChangeText: handleFormChange.bind(this, "number"),
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 0.5 }}>
                      <Input
                        text={"CVV"}
                        length={3}
                        secured={true}
                        keyboard="number-pad"
                        textInputConfig={{
                          cursorColor: "#aaa",
                          value: form.cvv,
                          onChangeText: handleFormChange.bind(this, "cvv"),
                        }}
                      />
                    </View>
                    <View style={{ flex: 0.48 }}>
                      <Input
                        text={"Expiry Date"}
                        length={5}
                        keyboard="number-pad"
                        textInputConfig={{
                          cursorColor: "#aaa",
                          value: form.exp,
                          onChangeText: handleFormChange.bind(this, "exp"),
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginVertical: 15,
                      gap: 13,
                      flexDirection: "row",
                    }}
                  >
                    <Pressable onPress={() => setActive((prev) => !prev)}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderWidth: 2,
                          borderColor: "#aaa",
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: active ? "#aaa" : "white",
                        }}
                      >
                        <Entypo name="check" size={20} color="white" />
                      </View>
                    </Pressable>
                    <Text>Make this the default payment</Text>
                  </View>
                  {!warning && (
                    <Info
                      text={
                        "By adding this card you can easily complete purchases securely with it."
                      }
                    />
                  )}
                  {warning && (
                    <Info
                      text={`${warning}                                              `}
                    />
                  )}
                  <View style={[{ height: 65, marginTop: 40 }]}>
                    <FlexButton onPress={onDone} background={"#283618"}>
                      <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
                    </FlexButton>
                  </View>
                </View>
              </>
            )}
            {scrollHeight == -650 && (
              <>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>{`${
                    form.card
                  } ${form.number.slice(0, 4)}*`}</Text>
                  <Pressable
                    onPress={() => deleteAndUpdate(form.id)}
                    style={({ pressed }) => pressed && { opacity: 0.5 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <Octicons name="trash" size={24} color="#B22334" />
                      <Text style={{ fontWeight: "bold", color: "#B22334" }}>
                        Delete Card
                      </Text>
                    </View>
                  </Pressable>
                </View>

                <View style={{ flex: 1 }}>
                  <Input
                    text={"Card Holder Name"}
                    textInputConfig={{
                      cursorColor: "#aaa",
                      value: form.name,
                      onChangeText: handleFormChange.bind(this, "name"),
                    }}
                  />
                  <Input
                    text={"Card Number"}
                    length={19}
                    keyboard="number-pad"
                    textInputConfig={{
                      cursorColor: "#aaa",
                      value: form.number,
                      onChangeText: handleFormChange.bind(this, "number"),
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 0.5 }}>
                      <Input
                        text={"CVV"}
                        length={3}
                        secured={true}
                        keyboard="number-pad"
                        textInputConfig={{
                          cursorColor: "#aaa",
                          value: form.cvv,
                          onChangeText: handleFormChange.bind(this, "cvv"),
                        }}
                      />
                    </View>
                    <View style={{ flex: 0.48 }}>
                      <Input
                        text={"Expiry Date"}
                        length={5}
                        keyboard="number-pad"
                        textInputConfig={{
                          cursorColor: "#aaa",
                          value: form.exp,
                          onChangeText: handleFormChange.bind(this, "exp"),
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginVertical: 15,
                      gap: 13,
                      flexDirection: "row",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        setActive((prev) => !prev);
                      }}
                    >
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderWidth: 2,
                          borderColor: "#aaa",
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: active ? "#aaa" : "white",
                        }}
                      >
                        <Entypo name="check" size={20} color="white" />
                      </View>
                    </Pressable>
                    <Text>Make this the default payment</Text>
                  </View>
                  {warning && (
                    <Info
                      text={`${warning}                                              `}
                    />
                  )}
                  <View style={[{ height: 65, marginTop: 40 }]}>
                    <FlexButton onPress={onEdit} background={"#283618"}>
                      <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
                    </FlexButton>
                  </View>
                </View>
              </>
            )}
          </View>
        </BottomSheet>
      </Pressable>
    </GestureHandlerRootView>
  );
}
export default PaymentsDisplay;

const styles = StyleSheet.create({
  catHead: {
    justifyContent: "space-between",
    gap: 19,
  },
  text: { fontWeight: "bold", fontSize: 20 },
  recommendedView: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
    gap: 20,
  },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: "contain",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    // borderWidth: 2
  },
});
