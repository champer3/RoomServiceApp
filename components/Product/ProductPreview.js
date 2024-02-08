import { Image, StyleSheet, Text, View, Dimensions,Animated } from "react-native"
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import React from 'react'

import Carousel, { Pagination } from 'react-native-snap-carousel'

const { width, height } = Dimensions.get("window");
const ItemPreview = ({item, index }) => {
    const { width, height } = Dimensions.get("window");
  return (
    <View style={styles.container}>
    <View style={{flexShrink: 1, height: '100%', width: '100%' }}>
      <ReactNativeZoomableView
        maxZoom={30}
        // Give these to the zoomable view so it can apply the boundaries around the actual content.
        // Need to make sure the content is actually centered and the width and height are
        // dimensions when it's rendered naturally. Not the intrinsic size.
        // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
        // Therefore, we'll feed the zoomable view the 300x150 size.
        contentWidth={300}
        contentHeight={350}
        disablePanOnInitialZoom= {true}
      >
        <Image
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          source={item.image}
        />
      </ReactNativeZoomableView>
    </View>
  </View>
  )
}


function ProductPreview({data, index, handleIndex}){
    const isCarousel = React.useRef(null)
    console.log(index)
    return <View>
        <Carousel
          ref={isCarousel}
          data={data}
          renderItem={ItemPreview}
          sliderWidth={width}
          itemWidth={width}
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
        height: height/1.2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 35,

        shadowColor: 'black',
        shadowOffset: {
            width: 10,
            height: 100
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        zIndex: 4
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