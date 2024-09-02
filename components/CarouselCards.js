import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, Pressable } from "react-native"
import Carousel, { Pagination } from 'react-native-snap-carousel'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH)
function isValidURL(str) {
  if (typeof str !== 'string') {
    str = String(str);
  }
  
  return str.startsWith("http://") || str.startsWith("https://");
}
const CarouselCardItem = ({item, index, onPress }) => {
    const { width, height } = Dimensions.get("window");
    console.log('item',item)
  return (
    <Pressable onPress={onPress} style ={{width: width, alignItems: 'center' }} key={index}>
       {item && isValidURL(item) && <Image
        source={{uri: item}}
        style ={{width: width, height: height/2 }} 
      />}
    </Pressable>
  )
}
const CarouselCards = ({data, index, handleIndex, onView}) => {
  const isCarousel = React.useRef(null)
  return (
    <View>
      <Carousel
        ref={isCarousel}
        data={data}
        renderItem={({item})=> <CarouselCardItem item={item} onPress={onView}/>}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => handleIndex(index)}
        useScrollView={true}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 15,
          height: 15,
          borderRadius: 10,
          marginHorizontal: 0,
          backgroundColor: '#BC6C25'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
    </View>
  )
}

export default CarouselCards

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 8,
      width: ITEM_WIDTH,
      paddingBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    image: {
      width: ITEM_WIDTH,
      height: 300,
    },
    header: {
      color: "#222",
      fontSize: 28,
      fontWeight: "bold",
      paddingLeft: 20,
      paddingTop: 20
    },
    body: {
      color: "#222",
      fontSize: 18,
      paddingLeft: 20,
      paddingLeft: 20,
      paddingRight: 20
    }
  })
  