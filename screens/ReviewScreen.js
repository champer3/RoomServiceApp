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
import { useRoute } from "@react-navigation/native";

function ReviewScreen() {
  const route = useRoute()
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const rating = ['All', '5', '4', '3', '2' , '1']
  return (
    <SafeAreaView>
        <ScrollView>
        <View style={{paddingHorizontal: '1%', paddingRight: '3%', paddingVertical: '6%', flexDirection: 'row', justifyContent: 'space-between'}}>
            {rating.map((rate, idx) => <Pressable key={idx} onPressOut={() => handleSelect(idx)}><Rating  rate={rate} active={index === idx}/></Pressable>)}
        </View>
        <View style={{paddingHorizontal: '1%', paddingRight: '3%', gap: 25}}>
          {route.params.reviews.length > 0 && route.params.reviews.map(({comment, rating, user, days}, idx)=><Review key={idx} review={comment} date={days} rate={rating} name={user}/>)}
        </View>
        </ScrollView>
      
    </SafeAreaView>
  );
}
export default ReviewScreen
const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
})