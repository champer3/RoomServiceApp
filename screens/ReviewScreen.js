import { Image, StyleSheet, View, Pressable, Dimensions, ScrollView } from "react-native";
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
import Text from '../components/Text';

const { width, height } = Dimensions.get("window");
function ReviewScreen() {
  const route = useRoute()
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
    setFilteredReviews(filterReviews(reviews, rating[selectedIndex]))
  };  
  var reviews = route.params.reviews
  const rating = ['All', '5', '4', '3', '2' , '1']
  function filterReviews(reviews, ratingFilter) {
    if (ratingFilter === 'All') {
      return reviews;
    }
  
    const filteredReviews = reviews.filter(review => review.rating == ratingFilter);
    return filteredReviews;
  }
  const [filteredReviews , setFilteredReviews] = useState(filterReviews(reviews, rating[index]))
  return (
    <View>
        <ScrollView>
        {reviews.length > 0 && <><View style={{paddingHorizontal: '1%', paddingRight: '3%', paddingVertical: '6%', flexDirection: 'row', justifyContent: 'space-between'}}>
            {rating.map((rate, idx) => <Pressable key={idx} style={{justifyContent: 'space-between'}} onPressOut={() => handleSelect(idx)}><Rating  rate={rate} active={index === idx}/></Pressable>)}
        </View>
        <View style={{paddingHorizontal: '1%', paddingRight: '3%', gap: 25}}>
          {filteredReviews.length > 0 &&  filteredReviews.map(({comment, rating, user, days}, idx)=><Review key={idx} review={comment} date={days} rate={rating} name={user}/>)}
        </View></>}
        {!reviews.length && <View  style={{gap: 19, marginVertical: 45}}><View style={styles.recommendedView}><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>No reviews yet, why don’t you make an order and be the first to review this!!!</Text><View style={[styles.recommendedView, {height: 75}]}><FlexButton background={'#283618'} onPress={()=>{}}><Text style={{fontSize: 18, color: 'white'}}>Start Shopping</Text></FlexButton></View></View>}
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
      
image: {
  height: height / 3,
  alignSelf: "center",
  resizeMode: 'contain'
},recommendedView: {
  paddingHorizontal: '5%', 
}
})