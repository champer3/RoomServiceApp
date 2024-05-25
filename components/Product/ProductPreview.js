import { Image, StyleSheet, Text, View, Dimensions,Animated } from "react-native"
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import React, { useState } from 'react'

import Carousel, { Pagination } from 'react-native-snap-carousel'

const { width, height } = Dimensions.get("window");
const ItemPreview = ({item, index }) => {
    const { width, height } = Dimensions.get("window");
  return (
    <View style={styles.container} key={index}>
        <Image
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          source={item.image}
        />
  </View>
  )
}


function ProductPreview({data}){
    const isCarousel = React.useRef(null)
    const [index, setIndex] = useState(0);
    console.log(index, '2nd')
    return <View>
        <Carousel
          ref={isCarousel}
          data={data}
          renderItem={ItemPreview}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index) => setIndex(index)}
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
}

export default ProductPreview

const styles = StyleSheet.create({
    container: {
        width: width,
        // height: height/1.2,
        // justifyContent: "center",
        alignItems: "center",
    },buttonContainer: {
        width: width/1.3,
        height: 65,
      },
    textContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 28
    },
    topText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#283618",
        textAlign: 'center'
    },
    text: {
        fontSize: 12,
        fontWeight: "700",
        color: "#0F1219",
        opacity: 0.7,
        textAlign: 'center',
    }
})