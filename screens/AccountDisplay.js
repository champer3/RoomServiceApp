import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BareButton from "../components/Buttons/BareButton";
import ProductAction from "../components/Product/ProductAction";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import Profile from "../components/Profile";
import Content from "../components/Content";
import FlexButton from "../components/Buttons/FlexButton";
import NavBar from "../components/NavBar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
function AccountDisplay() {
  const navigation = useNavigation();
  function pressHandler() {
    navigation.navigate("Profile");
  }
  function paymentHandler() {
    navigation.navigate("Payment");
  }
  function orderHandler() {
    navigation.navigate("Order History");
  }
  function addressHandler() {
    navigation.navigate("Address");
  }
  async function logoutHandler() {
    try{
      await AsyncStorage.removeItem('authToken')
      console.log("item removed")
      navigation.replace("Authentication");
    } catch(error){
      console.error('Error deleting item:', error);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingLeft: "5%",
          paddingTop: "7%",
          paddingBottom: "3%",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>My Account</Text>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView style={{}}>
          <View style={styles.recommendedView}>
            <Profile />
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
                justifyContent: "space-between",
              },
            ]}
          >
            <Content
              title={"My Profile"}
              info={"Make changes to your account"}
              icon={
                <Ionicons name="person-outline" size={30} color="#283618" />
              }
              onPress={pressHandler}
            />
            <Content
              title={"Payments"}
              info={"Manage your payment settings"}
              icon={
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={30}
                  color="#283618"
                />
              }
              onPress={paymentHandler}
            />
            <Content
              title={"Orders"}
              info={"View your orders"}
              icon={<Entypo name="text-document" size={30} color="#283618" />}
              onPress={orderHandler}
            />
            <Content
              title={"Address"}
              info={"Add or manage saved addresses"}
              icon={<Octicons name="location" size={30} color="#283618" />}
              onPress={addressHandler}
            />
          </View>
          <View style={[styles.recommendedView, { flex: 1, paddingTop: "1%" }]}>
            <BareButton color={"#B22334"} onPress={logoutHandler}>
              <Ionicons name="log-out-outline" size={30} color="#B22334" />
              <Text style={{ fontSize: 18, color: "#B22334" }}> Logout</Text>
            </BareButton>
          </View>
        </ScrollView>
        {/*
        <View style={{paddingHorizontal: '5%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , justifyContent: "space-between", flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)'}}>
            <NavBar/>
        </View> */}
      </View>
    </SafeAreaView>
  );
}
export default AccountDisplay;

const styles = StyleSheet.create({
  catHead: {
    justifyContent: "space-between",
    gap: 19,
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20, color: "#aaa" },
  recommendedView: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
});
