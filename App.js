import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BoxItemCategory from "./components/Category/BoxItemCategory";
import Category from "./screens/category/Category";
import CategorySearch from "./screens/category/CategorySearch";
import Home from "./screens/Home";
import Deal from "./components/Category/Deal";
import ProductDisplay from "./screens/ProductDisplay";
import DealsScreen from "./screens/DealsScreen";
import NumberLogin from "./screens/NumberLogin";
import PinLogin from "./screens/PinLogin";
import OnBoard1 from "./screens/onBoarding/OnBoard1";
import OnBoard2 from "./screens/onBoarding/OnBoard2";
import OnBoard3 from "./screens/onBoarding/onBoard3";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



function OnBoarding() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OnBoard3"
        component={OnBoard3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoard2"
        component={OnBoard2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoard1"
        component={OnBoard1}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="handshake-o" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
