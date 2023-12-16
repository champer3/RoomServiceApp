import { Image, StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from "react-native";
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
import AddressEditable from "../components/AddressEditable";
function AddressDisplay() {
   const address  = [{title: 'My address', address: '123 Main Street, Apt 4B, Cityville, USA'}, {title: 'My workplace', address : '123 Main Street, Apt 4B, Cityville, USA'}, 
   {title: "Jackson's", address : '123 Main Street, Apt 4B, Cityville, USA'}
]
   
  return (
    <SafeAreaView style={{flex: 1}}>
        <View>
        
        <View style={{paddingLeft: '5%', paddingVertical: '7%', flexDirection: 'row', alignItems: 'center', gap: 20}}>
        <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Ionicons name="md-arrow-back-outline" size={40} color="black" />
        </Pressable>
        <Text style ={{fontWeight: 'bold', fontSize: 20}}>Address</Text>
        </View>
        <ScrollView style={{marginBottom: '50%' }}>
        
        <View style={styles.recommendedView}>
           {address.map(({title, address}, idx) => <View  key={idx}><Pressable ><AddressEditable address={address} title={title} /></Pressable></View>)}
            </View>
        
        </ScrollView>
        
       
        </View>
        <View style={{flex: 1, width: '100%', height: '25%', paddingHorizontal: '5%',  paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' ,  justifyContent: "space-around",}}>
            <View style={[styles.recommendedView, {height: '50%'}]}>
                <FlexButton><Text style={{fontSize: 18}}>Add new address</Text></FlexButton>
            </View>
            <View style={[styles.recommendedView, {height: '50%'}]}>
                <FlexButton background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
            </View>
            
                
    
        </View>

    </SafeAreaView>
  );
}
export default AddressDisplay

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