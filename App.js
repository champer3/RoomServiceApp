import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Category from "./screens/category/Category";
import CategorySearch from "./screens/category/CategorySearch";
import Home from "./screens/Home";
import { Octicons } from "@expo/vector-icons";
import ProductDisplay from "./screens/ProductDisplay";
import Svg, {Path} from 'react-native-svg';
import DealsScreen from "./screens/DealsScreen";
import NumberLogin from "./screens/NumberLogin";
import PinLogin from "./screens/PinLogin";
import OnBoard1 from "./screens/onBoarding/OnBoard1";
import OnBoard2 from "./screens/onBoarding/OnBoard2";
import OnBoard3 from "./screens/onBoarding/onBoard3";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from './components/CustomTabBar';
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
import Settings from "./screens/Settings";
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
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import FalseHomeScreen from "./screens/FalseHomeScreen";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {GoogleAuthProvider, onAuthStateChanged, signInWithCredential} from 'firebase/auth'
import { auth } from "./firebaseConfig";
WebBrowser.maybeCompleteAuthSession();
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
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="NumberLogin"
        component={NumberLogin}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="PinLogin"
        component={PinLogin}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLogin}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="EmailSignUp"
        component={EmailSignUp}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="AddNumber"
        component={AddNumber}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="AddPin"
        component={AddPin}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="CreatePassword"
        component={CreatePassword}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
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
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="Category"
        component={CategorySearch}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="All Categories"
        component={CategoryAll}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="All Deals"
        component={DealsScreen}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
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
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="CategorySearch"
        component={CategorySearch}
        options={{ headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
    </Stack.Navigator>
  );
}
function Account() {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: 'Custom Back'}}>
      <Stack.Screen
        name="Profile"
        component={{ ProfileDisplay }}
        options={{ headerShadowVisible: false, title: "My Profile", headerBackTitle: '', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Payment"
        component={{ PaymentsDisplay }}
        options={{ headerShadowVisible: false, title: "Payments", headerBackTitle: '', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Order History"
        component={{ OrderDisplay }}
        options={{ headerShadowVisible: false, title: "Orders", headerBackTitle: '', headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name="Address"
        component={{ AddressDisplay }}
        options={{ headerShadowVisible: false, title: "Address", headerBackTitle: '', headerBackTitleVisible: false}}
      />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "#EFF5E9",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          right: 80,
          left: 80,
          bottom: 10,
          height: 45,
          backgroundColor: '#4F6B30',
          borderRadius: 40,
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 3,
        },
      }}
      
    >
      <Tab.Screen
        name="Home"
        component={Home2}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (<>
         { !focused && <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><Path fill={color} d="M293.3 2c-3-2.7-7.6-2.7-10.6 0L2.7 250c-3.3 2.9-3.6 8-.7 11.3s8 3.6 11.3 .7L64 217.1 64 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-230.9L562.7 262c3.3 2.9 8.4 2.6 11.3-.7s2.6-8.4-.7-11.3L293.3 2zM80 448l0-245.1L288 18.7 496 202.9 496 448c0 26.5-21.5 48-48 48l-320 0c-26.5 0-48-21.5-48-48zM240 184c-13.3 0-24 10.7-24 24l0 96c0 13.3 10.7 24 24 24l96 0c13.3 0 24-10.7 24-24l0-96c0-13.3-10.7-24-24-24l-96 0zm-8 24c0-4.4 3.6-8 8-8l96 0c4.4 0 8 3.6 8 8l0 96c0 4.4-3.6 8-8 8l-96 0c-4.4 0-8-3.6-8-8l0-96z"/></Svg>}
          {focused && <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><Path class="fa-secondary" opacity=".4" fill={color} d="M64 270.5L64.1 448c0 35.3 28.7 64 64 64l320.4 0c35.4 0 64-28.7 64-64c-.1-59.2-.3-118.3-.4-177.4L288 74.5 64 270.5zM224 264c0-13.3 10.7-24 24-24l80 0c13.3 0 24 10.7 24 24l0 80c0 13.3-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24l0-80z"/><Path class="fa-primary" fill={color} d="M266.9 7.9C279-2.6 297-2.6 309.1 7.9l256 224c13.3 11.6 14.6 31.9 3 45.2s-31.9 14.6-45.2 3L288 74.5 53.1 280.1c-13.3 11.6-33.5 10.3-45.2-3s-10.3-33.5 3-45.2l256-224z"/></Svg>}
          </>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <>
         { !focused && <Svg width={23} height={23} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path fill={color} d="M400 208A192 192 0 1 0 16 208a192 192 0 1 0 384 0zM349.3 360.6C312.2 395 262.6 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 54.6-21 104.2-55.4 141.3L511.3 499.9l-11.3 11.3L349.3 360.6z"/></Svg>}
         { focused && <Svg width={23} height={23} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path fill={color} class="fa-secondary" opacity=".4" d="M0 208a208 208 0 1 0 416 0A208 208 0 1 0 0 208zm352 0A144 144 0 1 1 64 208a144 144 0 1 1 288 0z"/><Path fill={color} class="fa-primary" d="M330.7 376L457.4 502.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L376 330.7C363.3 348 348 363.3 330.7 376z"/></Svg>}
          </>
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <>
            { !focused && <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><Path fill={color} d="M384 48c26.5 0 48 21.5 48 48l0 320c0 26.5-21.5 48-48 48L64 464c-26.5 0-48-21.5-48-48L16 96c0-26.5 21.5-48 48-48l320 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm96 128c0 4.4 3.6 8 8 8l192 0c4.4 0 8-3.6 8-8s-3.6-8-8-8l-192 0c-4.4 0-8 3.6-8 8zm0 96c0 4.4 3.6 8 8 8l192 0c4.4 0 8-3.6 8-8s-3.6-8-8-8l-192 0c-4.4 0-8 3.6-8 8zm0 96c0 4.4 3.6 8 8 8l192 0c4.4 0 8-3.6 8-8s-3.6-8-8-8l-192 0c-4.4 0-8 3.6-8 8zM96 144a16 16 0 1 0 0 32 16 16 0 1 0 0-32zm16 112a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM96 336a16 16 0 1 0 0 32 16 16 0 1 0 0-32z"/></Svg>}
            { focused && <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><Path fill={color} class="fa-secondary" opacity=".4" d="M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm0 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM168 160c0 13.3 10.7 24 24 24l160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0c-13.3 0-24 10.7-24 24zm0 96c0 13.3 10.7 24 24 24l160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0c-13.3 0-24 10.7-24 24zm0 96c0 13.3 10.7 24 24 24l160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0c-13.3 0-24 10.7-24 24z"/><Path fill={color} class="fa-primary" d="M168 160c0-13.3 10.7-24 24-24l160 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-160 0c-13.3 0-24-10.7-24-24zm0 192c0-13.3 10.7-24 24-24l160 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-160 0c-13.3 0-24-10.7-24-24zm24-120l160 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-160 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></Svg>}
             </>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountDisplay}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <>
            { !focused && <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path fill={color} d="M256 496c-54 0-103.9-17.9-144-48c0 0 0 0 0 0c0-61.9 50.1-112 112-112l64 0c61.9 0 112 50.1 112 112c0 0 0 0 0 0c5.3-4 10.4-8.2 15.4-12.6C409.1 370.6 354.5 320 288 320l-64 0c-66.5 0-121.1 50.6-127.4 115.4C47.2 391.5 16 327.4 16 256C16 123.5 123.5 16 256 16s240 107.5 240 240s-107.5 240-240 240zm0 16A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm80-304a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zm-80-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></Svg>}
            { focused && <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path fill={color} class="fa-secondary" opacity=".4" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM113 384.2c22.1-38.3 63.5-64.2 111-64.2l64 0c47.4 0 88.9 25.8 111 64.2C363.8 423.3 312.8 448 256 448s-107.8-24.7-143-63.8zM328 200a72 72 0 1 1 -144 0 72 72 0 1 1 144 0z"/><Path fill={color} class="fa-primary" d="M256 272a72 72 0 1 0 0-144 72 72 0 1 0 0 144zm0 176c56.8 0 107.8-24.7 143-63.8C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8z"/></Svg>}
             </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState()
  const [request, response, promptAsync] = Google.useAuthRequest({iosClientId: '867770443500-4d7duu63ncch51i43vsas1itfr94q4pm.apps.googleusercontent.com', androidClientId: '867770443500-rfes4l80dc3buvcpqk5fet59tf3tdupu.apps.googleusercontent.com'})
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  const loadFonts = () => {
    return Font.loadAsync({
      'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
      // 'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      // Add other Poppins font styles if needed
    });
  };
  useEffect(()=>{if (response?.type== 'success'){
    const {id_token} = response.params;
    const credential = GoogleAuthProvider.credential(id_token)
    signInWithCredential(auth, credential)
  }}, [response])
  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }
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
              initialParams={{ promptAsync: promptAsync }}
            />
             {isLoading ? (
              <Stack.Screen name="HomeTabs" component={FalseHomeScreen} options={{ headerShown: false }} />
        
            ) : (
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{ headerShown: false }}
            />)}
            <Stack.Screen
              name="Product"
              component={ProductDisplay}
              options={{ headerShadowVisible: false, title: "",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{ headerShadowVisible: false, title: "",  headerBackTitle: '', headerBackTitleVisible: false }}
            />

            <Stack.Screen
              name="Cart"
              component={CartDisplay}
              options={{ headerShadowVisible: false, title: "Cart",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileDisplay}
              options={{ headerShadowVisible: false, title: "My Profile",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{ headerShadowVisible: false, title: "My Settings",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentsDisplay}
              options={{ headerShadowVisible: false, title: "Payments",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Order History"
              component={OrderDisplay}
              options={{ headerShadowVisible: false, title: "Orders",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Address"
              component={AddressDisplay}
              options={{ headerShadowVisible: false, title: "Address",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShadowVisible: false, title: "Checkout",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Confirm Address"
              component={AddressConfirm}
              options={{
                headerShadowVisible: false,
                title: "Shipping Address",
                headerBackTitle: '', headerBackTitleVisible: false
              }}
            />
            <Stack.Screen
              name="Make Payment"
              component={PaymentScreen}
              options={{ headerShadowVisible: false, title: "Make Payment",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Manage Payment"
              component={ConfirmPaymentMethod}
              options={{ headerShadowVisible: false, title: "Manage Payment",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Order Receipt"
              component={RecieptScreen}
              options={{ headerShadowVisible: false, title: "Order Receipt",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ headerShadowVisible: false, title: "Address",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Add Address"
              component={AddAddressScreen}
              options={{ headerShadowVisible: false, title: "New Address",  headerBackTitle: '', headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="Delivery Status"
              component={Delivery}
              options={{ headerShadowVisible: false, title: "Status",  headerBackTitle: '', headerBackTitleVisible: false }}
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
  tabBarStyle: {
    position: 'absolute',
    backgroundColor:"transparent",
    borderTopWidth: 0,
    bottom: 15,
    right: 10,
    left: 10,
    height: 92,
  },
});