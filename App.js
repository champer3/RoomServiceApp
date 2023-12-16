import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import BoxItemCategory from "./components/Category/BoxItemCategory";
import Category from "./screens/category/Category";
import CategorySearch from "./screens/category/CategorySearch";
import Home from "./screens/Home";
import Deal from "./components/Category/Deal";
import ProductDisplay from "./screens/ProductDisplay";
import ReviewScreen from "./screens/ReviewScreen";
import CartDisplay from "./screens/CartDisplay";
import CheckoutScreen from "./screens/CheckoutScreen";
import AddressConfirm from "./screens/AddressConfirm";
import PaymentScreen from "./screens/PaymentScreen";
import ConfirmPaymentMethod from "./screens/ConfirmPaymentMethod";
import RecieptScreen from "./screens/RecieptScreen";
import AccountDisplay from "./screens/AccountDisplay";
import ProfileDisplay from "./screens/ProfileDisplay";
import PaymentsDisplay from "./screens/PaymentsDisplay";
import AddressDisplay from "./screens/AddressDisplay";


export default function App() {
  return (
    <>
      <AddressDisplay/>
    </>
  );
  // return (
  //   <PaperProvider>
  //     <View style={styles.container}>
  //       <Text>Code this shit</Text>
  //       <StatusBar style="auto" />
  //     </View>
  //   </PaperProvider>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
