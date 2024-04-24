import { StyleSheet, Text, View, Pressable, ScrollView, Image, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

const { width, height } = Dimensions.get("window");
function AccountDisplay() {
  const [logged, setLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status
  
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
  const retrieveTokenFromAsyncStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("profile");
      if (storedToken !== null) {
        setLogged(true)
      } 
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  async function logoutHandler() {
    try{
      await AsyncStorage.removeItem('authToken')
      console.log("item removed")
    } catch(error){
      console.error('Error deleting item:', error);
    }
    try{
      await AsyncStorage.removeItem('profile')
      console.log("item removed")
      navigation.replace("Authentication",{screen : "NumberLogin"});
    } catch(error){
      console.error('Error deleting item:', error);
    }
  }
  useEffect(()=>{setIsLoading(true); setTimeout(()=>{setIsLoading(false)}, 500)},[])
  useEffect(()=>{retrieveTokenFromAsyncStorage()}, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        // Render loading indicator while loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<>
     {logged ? <><View
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
          <View style={[styles.recommendedView, { flex: 1, paddingVertical: "10%" }]}>
            <BareButton color={"#B22334"} onPress={logoutHandler}>
              <Ionicons name="log-out-outline" size={width/11} color="#B22334" />
              <Text style={{ fontSize: 18, color: "#B22334" }}> Logout</Text>
            </BareButton>
          </View>
        </ScrollView>
        {/*
        <View style={{paddingHorizontal: '5%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , justifyContent: "space-between", flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)'}}>
            <NavBar/>
        </View> */}
      </View></> : <View  style={{flex: 1, alignItems:'center',justifyContent: 'center', paddingHorizontal: 12}}><View><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500'}}>You don’t have an account try logging in or signing up</Text><View style={[styles.recommendedView, {height: 75}]}><FlexButton background={'#283618'} onPress={()=>{navigation.replace('Authentication', {screen: 'NumberLogin'})}}><Text style={{fontSize: 18, color: 'white'}}>Get my account</Text></FlexButton></View></View>}</>)}
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
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain',
    marginBottom: 30
  },
});
