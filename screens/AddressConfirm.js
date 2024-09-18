import { Image, StyleSheet,  View, Pressable, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Review from "../components/Reviews/Review"
import Rating from "../components/Reviews/Rating"
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import { EvilIcons } from '@expo/vector-icons';
import ProductAction from "../components/Product/ProductAction";
import Input from "../components/Inputs/Input";
import Deal from "../components/Category/Deal";
import { Fontisto } from '@expo/vector-icons';
import Address from "../components/Address";
import {useSelector, useDispatch} from 'react-redux'
import { updateProfile } from "../Data/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Text from '../components/Text';
function AddressConfirm() {
  const data = useSelector((state) => state.profileData.profile)
  const orders = useSelector((state) => state.orders.ids)
  const address = [...data.address]
  const dispatch = useDispatch();
  const navigation = useNavigation()
   
   
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  function onPress(){
    navigation.navigate('Address')
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

  function makeDefault(id){
    setIsLoading(true)
    const newData = { ...data, ['address'] : [{...data.address[id], ['id']: 0}] };
    var j = 1
    for (let i = 0; i < data.address.length; i++) {
      // If the current index is less than the specified index, copy the existing payment
      if (data.address[i].id != id) {
        newData.address.push({...data.address[i], ['id']: j})
        j += 1
      }
      
    }
    dispatch(updateProfile({id : newData}))
    setTimeout(async ()=>{
      try{
        await AsyncStorage.removeItem('essential')
      } catch(error){
        console.error('Error deleting item:', error);
      }
      try {
        await AsyncStorage.setItem("essential", JSON.stringify({address: newData.address, orders:  orders}));
        console.log("Essential saved successfully.");
      } catch (error) {
        console.error("Error saving token:", error);
      }
      setIsLoading(false)
      navigation.goBack()}, 500)
    
  }
  return (
    <View style={{flex: 1}}>
        {isLoading ? (
        // Render loading indicator while loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<><View >
        
        <ScrollView >
        
        <View style={[styles.recommendedView, {paddingBottom: '20%' }]}>
           {address.length > 0 && address.map(({name, address}, idx) => <View  key={idx}><Pressable onPressIn={() => handleSelect(idx)}><Address address={address} title={name} active={index === idx}/></Pressable></View>)}
           <View style={[styles.recommendedView, {height: 85}]}>
                <FlexButton onPress={onPress}><Text style={{fontSize: 18}}>Add new address</Text></FlexButton>
            </View>
            </View>
            
        </ScrollView>
        
       
        </View>
        <View style={{flex: 1, width: '100%', height: '10%', paddingHorizontal: '5%', paddingTop: 5, position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white'}}>
            
            <View style={[{height: '89%'}]}>
                <FlexButton onPress={()=>makeDefault(index)} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Select</Text></FlexButton>
            </View>
            
                
    
        </View></>)}

    </View>
  );
}
export default AddressConfirm

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%', gap: 20
  }
})