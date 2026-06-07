import { STRIPE_PUBLISHABLE_KEY } from "./config";
import { StatusBar } from "expo-status-bar";
import { Button, Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Category from "./screens/category/Category";
import CategorySearch from "./screens/category/CategorySearch";
import Home from "./screens/Home";
import DepartmentScreen from "./screens/DepartmentScreen";
import { Octicons } from "@expo/vector-icons";
import ProductDisplay from "./screens/ProductDisplay";
import Svg, {Path} from 'react-native-svg';
import DealsScreen from "./screens/DealsScreen";
import NumberLogin from "./screens/NumberLogin";
import PinLogin from "./screens/PinLogin";
import Constants from 'expo-constants';
import OnBoard1 from "./screens/onBoarding/OnBoard1";
import OnBoard2 from "./screens/onBoarding/OnBoard2";
import OnBoard3 from "./screens/onBoarding/onBoard3";
import { Provider } from "react-redux";
import FloatingPillTabBar from "./components/FloatingPillTabBar";
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
import CreateAccount from "./screens/CreateAccount";
import EmailSignUp from "./screens/EmailSignUp";
import { registerPushNotifications } from './Data/notify';
import NotificationsScreen from "./screens/NotificationsScreen";
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
import FavoritesDisplay from "./screens/FavoritesDisplay";
import { store } from "./Data/Store";
import { cart } from "./Data/cart";
import { profile } from "./Data/profile";
import { StripeProvider } from "@stripe/stripe-react-native";
import Delivery from "./screens/Delivery";
import LoaderScreen from "./screens/LoaderScreen";
import LoadScreen from "./screens/LoadScreen";
import CompleteProfile from "./screens/CompleteProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CartShow from "./screens/CartShow";

SplashScreen.preventAutoHideAsync();
import { ToastProvider } from "./context/ToastContext";
import NetworkProvider from "./context/NetworkProvider";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

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
        name="CreateAccount"
        component={CreateAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NumberLogin"
        component={NumberLogin}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="PinLogin"
        component={PinLogin}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EmailSignUp"
        component={EmailSignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddNumber"
        component={AddNumber}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPin"
        component={AddPin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfile}
        options={{ headerShown: false }}
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
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
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
      <Stack.Screen
        name="Department"
        component={DepartmentScreen}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="CategorySearch"
        component={CategorySearch}
        options={{ headerShown: false, headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false }}
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
        options={{ headerShown: false, headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
    </Stack.Navigator>
  );
}
function Browse() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BrowseDefault"
        component={CategoryAll}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
      <Stack.Screen
        name="CategorySearch"
        component={CategorySearch}
        options={{ headerShown: false, headerShadowVisible: false, title: "", headerBackTitle: '', headerBackTitleVisible: false  }}
      />
    </Stack.Navigator>
  );
}
function Orders() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrdersDefault"
        component={OrderDisplay}
        options={{ headerShown: false, headerBackTitle: '', headerBackTitleVisible: false  }}
      />
    </Stack.Navigator>
  );
}
function Account() {
  return (
    <Stack.Navigator screenOptions={{headerBackTitle: 'Custom Back'}}>
      <Stack.Screen
        name="Profile"
        component={ProfileDisplay}
        options={{ headerShown: false }}
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
      tabBar={(props) => <FloatingPillTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute', elevation: 0, borderTopWidth: 0, backgroundColor: 'transparent' },
      }}
    >
      <Tab.Screen name="Home" component={Home2} />
      <Tab.Screen name="Browse" component={Browse} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Account" component={AccountDisplay} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
      'SFPRO-Regular': require('./assets/fonts/SFPRODISPLAYREGULAR.ttf'),
      'SFPRO-Medium': require('./assets/fonts/SFPRODISPLAYMEDIUM.ttf'),
      'SFPRO-Bold': require('./assets/fonts/SFPRODISPLAYBOLD.ttf'),
    }).then(() => {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <ThemeProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <SafeAreaProvider>
        <NavigationContainer>
          <NetworkProvider>
          <ToastProvider>
          <ThemedStatusBar />
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


              options={{ headerShown: false, title: "", headerMode: 'screen',  }}

            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ headerShown: false, title: "", headerMode: 'screen',  }}
            />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{ headerShadowVisible: false, title: "",  headerBackTitle: '', headerBackTitleVisible: false }}
            />

            <Stack.Screen
              name="Cart"
              component={CartDisplay}
              options={{ headerShown: false, title: "", headerMode: 'screen',  }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileDisplay}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentsDisplay}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Favorites"
              component={FavoritesDisplay}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Order History"
              component={OrderDisplay}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Address"
              component={AddressDisplay}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Confirm Address"
              component={AddressConfirm}
              options={{ headerShown: false }}
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
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Add Address"
              component={AddAddressScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Delivery Status"
              component={Delivery}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Loader"
              component={LoaderScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          </ToastProvider>
          </NetworkProvider>
        </NavigationContainer>
        </SafeAreaProvider>
      </StripeProvider>
      </ThemeProvider>
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