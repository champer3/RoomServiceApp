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
function ReviewScreen() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const rating = ['All', '5', '4', '3', '2' , '1']
  return (
    <View>
        <ScrollView>
        <View style={{paddingHorizontal: '1%', paddingRight: '3%', paddingVertical: '6%', flexDirection: 'row', justifyContent: 'space-between'}}>
            {rating.map((rate, idx) => <Pressable key={idx} onPressOut={() => handleSelect(idx)}><Rating  rate={rate} active={index === idx}/></Pressable>)}
        </View>
        <View style={{paddingHorizontal: '1%', paddingRight: '3%', gap: 25}}>
            <Review review={"I stumbled upon Nerds Gummy Clusters, and oh boy, what a find! The blend of fruity and tangy nerds with the chewy gummy inside is a party in my mouth. The 5oz bag disappears way too quickly. Can't get enough!"} date={'5days ago'} rate={3} name={'Jacob Henderson'}/>
            <Review review={"I stumbled upon Nerds Gummy Clusters, and oh boy, what a find! The blend of fruity and tangy nerds with the chewy gummy inside is a party in my mouth. The 5oz bag disappears way too quickly. Can't get enough!"} date={'5days ago'} rate={4} name={'Jacob Henderson'}/>
            <Review review={"I stumbled upon Nerds Gummy Clusters, and oh boy, what a find! The blend of fruity and tangy nerds with the chewy gummy inside is a party in my mouth. The 5oz bag disappears way too quickly. Can't get enough!"} date={'5days ago'} rate={5} name={'Jacob Henderson'}/>
            <Review review={"I stumbled upon Nerds Gummy Clusters, and oh boy, what a find! The blend of fruity and tangy nerds with the chewy gummy inside is a party in my mouth. The 5oz bag disappears way too quickly. Can't get enough!"} date={'5days ago'} rate={2} name={'Jacob Henderson'}/>
            <Review review={"I stumbled upon Nerds Gummy Clusters, and oh boy, what a find! The blend of fruity and tangy nerds with the chewy gummy inside is a party in my mouth. The 5oz bag disappears way too quickly. Can't get enough!"} date={'5days ago'} rate={1} name={'Jacob Henderson'}/>

        </View>
        </ScrollView>

    </View>
  );
}
export default ReviewScreen
const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
})