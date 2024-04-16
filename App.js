import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Category from "./screens/category/Category";
import CategorySearch from "./screens/category/CategorySearch";
import Home from "./screens/Home";
import { Octicons } from "@expo/vector-icons";
import ProductDisplay from "./screens/ProductDisplay";
import DealsScreen from "./screens/DealsScreen";
import NumberLogin from "./screens/NumberLogin";
import PinLogin from "./screens/PinLogin";
import OnBoard1 from "./screens/onBoarding/OnBoard1";
import OnBoard2 from "./screens/onBoarding/OnBoard2";
import OnBoard3 from "./screens/onBoarding/onBoard3";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  clearCart,
  completeOrder,
  addToCart,
  removeFromCart,
  deleteFromCart,
  addOptions,
  deleteItem,
  updateCart,
} from "./Data/cart";
import { useSelector, useDispatch } from "react-redux";
import EmailLogin from "./screens/EmailLogin";
import StartScreen from "./screens/StartScreen";
import EmailSignUp from "./screens/EmailSignUp";
import AddNumber from "./screens/AddNumber";
import CreatePassword from "./screens/CreatePassword";
import AccountDisplay from "./screens/AccountDisplay";
import CartDisplay from "./screens/CartDisplay";
import ReviewScreen from "./screens/ReviewScreen";
import MapScreen from "./screens/MapScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddPin from "./screens/AddPin";
import { useEffect, useState, useRef } from "react";
import CategoryAll from "./screens/category/CategoryAll";
import ProfileDisplay from "./screens/ProfileDisplay";
import OrderDisplay from "./screens/OrderDisplay";
import AddressDisplay from "./screens/AddressDisplay";
import PaymentsDisplay from "./screens/PaymentsDisplay";
import PaymentScreen from "./screens/PaymentScreen";
import ConfirmPaymentMethod from "./screens/ConfirmPaymentMethod";
import RecieptScreen from "./screens/RecieptScreen";
import AddressConfirm from "./screens/AddressConfirm";
import CheckoutScreen from "./screens/CheckoutScreen";
import AddAddressScreen from "./screens/AddAddressScreen";
import { store } from "./Data/Store";
import { cart } from "./Data/cart";
import { profile } from "./Data/profile";
import { StripeProvider } from "@stripe/stripe-react-native";
import Delivery from "./screens/Delivery";
import LoaderScreen from "./screens/LoaderScreen";
import LoadScreen from "./screens/LoadScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from 'socket.io-client';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function OnBoarding() {
  return (
    <Stack.Navigator screenOptions={{ animationTypeForReplace: "pop" }}>
      <Stack.Screen
        name="OnBoard1"
        component={OnBoard1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoard2"
        component={OnBoard2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoard3"
        component={OnBoard3}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function Authentication() {

  return (
    <Stack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}
    >
      
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NumberLogin"
        component={NumberLogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PinLogin"
        component={PinLogin}
        options={{ headerShadowVisible: false, title: "" }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLogin}
        options={{ headerShadowVisible: false, title: "" }}
      />
      <Stack.Screen
        name="EmailSignUp"
        component={EmailSignUp}
        options={{ headerShadowVisible: false, title: "" }}
      />
      <Stack.Screen
        name="AddNumber"
        component={AddNumber}
        options={{ headerShadowVisible: false, title: "" }}
      />
      <Stack.Screen
        name="AddPin"
        component={AddPin}
        options={{ headerShadowVisible: false, title: "" }}
      />
      <Stack.Screen
        name="CreatePassword"
        component={CreatePassword}
        options={{ headerShadowVisible: false, title: "" }}
      />
    </Stack.Navigator>
  );
}
function Home2() {
  return (
    <Stack.Navigator
    screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen
        name="HomeDefault"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Category"
        component={CategorySearch}
        options={{ headerShadowVisible: false, title: "" }}
      />
      <Stack.Screen
        name="All Categories"
        component={CategoryAll}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="All Deals"
        component={DealsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function Search() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchDefault"
        component={Category}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategorySearch"
        component={CategorySearch}
        options={{ headerShadowVisible: false, title: "" }}
      />
    </Stack.Navigator>
  );
}
function Account() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={{ ProfileDisplay }}
        options={{ headerShadowVisible: false, title: "My Profile" }}
      />
      <Stack.Screen
        name="Payment"
        component={{ PaymentsDisplay }}
        options={{ headerShadowVisible: false, title: "Payments" }}
      />
      <Stack.Screen
        name="Order History"
        component={{ OrderDisplay }}
        options={{ headerShadowVisible: false, title: "Orders" }}
      />
      <Stack.Screen
        name="Address"
        component={{ AddressDisplay }}
        options={{ headerShadowVisible: false, title: "Address" }}
      />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: "black",
        tabBarActiveTintColor: "#BC6C25",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home2}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ transform: "rotateZ(45deg)" }}>
              <MaterialCommunityIcons
                name="handshake-outline"
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountDisplay}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={"pk_test_51ObTm2K5nIEAEdc3QUu6C68m34aYLTMHdhTGfejheKPDOJ7hqwjRxZ2uMcCubTPaCgLqUIjQxKdrCDm6Lc2e0HB100jZGNB0aV"}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator>
          <Stack.Screen
              name="Begin"
              component={LoadScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Authentication"
              component={Authentication}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Product"
              component={ProductDisplay}
              options={{ headerShadowVisible: false, title: "" }}
            />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{ headerShadowVisible: false, title: "" }}
            />

            <Stack.Screen
              name="Cart"
              component={CartDisplay}
              options={{ headerShadowVisible: false, title: "Cart" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileDisplay}
              options={{ headerShadowVisible: false, title: "My Profile" }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentsDisplay}
              options={{ headerShadowVisible: false, title: "Payments" }}
            />
            <Stack.Screen
              name="Order History"
              component={OrderDisplay}
              options={{ headerShadowVisible: false, title: "Orders" }}
            />
            <Stack.Screen
              name="Address"
              component={AddressDisplay}
              options={{ headerShadowVisible: false, title: "Address" }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShadowVisible: false, title: "Checkout" }}
            />
            <Stack.Screen
              name="Confirm Address"
              component={AddressConfirm}
              options={{
                headerShadowVisible: false,
                title: "Shipping Address",
              }}
            />
            <Stack.Screen
              name="Make Payment"
              component={PaymentScreen}
              options={{ headerShadowVisible: false, title: "Make Payment" }}
            />
            <Stack.Screen
              name="Manage Payment"
              component={ConfirmPaymentMethod}
              options={{ headerShadowVisible: false, title: "Manage Payment" }}
            />
            <Stack.Screen
              name="Order Receipt"
              component={RecieptScreen}
              options={{ headerShadowVisible: false, title: "Order Receipt" }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ headerShadowVisible: false, title: "Address" }}
            />
            <Stack.Screen
              name="Add Address"
              component={AddAddressScreen}
              options={{ headerShadowVisible: false, title: "New Address" }}
            />
            <Stack.Screen
              name="Delivery Status"
              component={Delivery}
              options={{ headerShadowVisible: false, title: "Status" }}
            />
            <Stack.Screen
              name="Loader"
              component={LoaderScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
