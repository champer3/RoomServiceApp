import { StyleSheet, Image, Text, View, Pressable, ScrollView } from "react-native";
import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import BareButton from "../components/Buttons/BareButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Info from "../components/Info";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import ProductAction from "../components/Product/ProductAction";
import Pill from "../components/Pills/Pills";
import FlexButton from "../components/Buttons/FlexButton";

function OrderDisplay(){
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };
    return  <View style={{flex: 1}}>
    
    <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, marginHorizontal: '5%', gap: 20, borderBottomColor: 'rgba(0,0,0,0.075)'}]}>
        
        <View style={[{width: 'auto',alignItems: 'center', padding: '3%'}, index == 0 ? styles.active : undefined]}>
            <Pressable onPressIn={() => handleSelect(0)}>
            <Text style ={{fontWeight: 'bold', fontSize: 20, color : index == 0 ? 'black' : 'rgba(0,0,0,0.5)'}}>Active Orders</Text>
            </Pressable>
        </View>
        
        <View style={[{width: 'auto',alignItems: 'center', padding: '3%'}, index == 1 ? styles.active : undefined]}>
            <Pressable onPressIn={() => handleSelect(1)}>
                <Text style ={{fontWeight: 'bold', fontSize: 20, color : index == 1 ? 'black' : 'rgba(0,0,0,0.5)'}}>Completed Orders</Text>
            </Pressable>
        </View>
    </View>
    <View style={{flex: 1}}>
    <ScrollView>
    
    <View style={styles.recommendedView}>
        <Input icon={<Ionicons name="search-outline" size={24} color="#aaa" />} text={'Search orders'}/>
    </View>
    {index == 0 && <View style={{marginHorizontal: '6%', paddingVertical: '6%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
        <ProductAction quantity={1}><Pill text={"Delivering"} type="null"/></ProductAction>
        <ProductAction quantity={1}><Pill text={"Delivering"} type="null"/></ProductAction>
        <ProductAction quantity={1}><Pill text={"Delivering"} type="null"/></ProductAction>
    </View>}
    {index == 1 && <View style={{marginHorizontal: '6%', paddingVertical: '6%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
        <ProductAction quantity={1}><View style={{flex: 1}}><BareButton background={'#283618'}><Text style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>Leave a review</Text></BareButton></View></ProductAction>
        <ProductAction quantity={1}><Pill text={"Delivered"} type="null"/></ProductAction>
        <ProductAction quantity={1}><Pill text={"Delivered"} type="null"/></ProductAction>
    </View>}

    
    </ScrollView>
    
   
    </View>
    </View>
}

export default OrderDisplay
const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%', gap: 20
  },
  active : {borderBottomWidth:2, 
    borderBottomColor: 'rgba(0,0,0,0.5)'
}
})