import { Image, Pressable, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, {Path} from 'react-native-svg';
import Text from '../Text';
import { useState } from "react";
const { width, height } = Dimensions.get("window");



function ProductAction({title, image, price, reviews, category, component, instruction,quantity, action,side, options, onTap, children }) {
  const navigation = useNavigation()
  const [visible,setVisible] = useState(false)
  function pressHandler (){
    navigation.navigate('Product', {title: title, image : image, reviews: reviews, oldPrice: price, category: category })
  }
    function isValidURL(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    
    return str.startsWith("http://") || str.startsWith("https://");
  }
  return (
    <View style={[styles.container,
      {shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5, // Add elevation for Android shadow
    }
    ]}>
      <View style={styles.imageContainer}>
      <View
          style={{
            flex: -1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginRight : 6
          }}
        >
          <TouchableOpacity onPress={onTap} style={{    justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 50,
            paddingVertical: 10,
            paddingHorizontal: 10,}}>
          {image && isValidURL(image) && <Image
              style={styles.image}
              source={{uri:image}}
            />}
          </TouchableOpacity>
          <View>
         </View>
        </View>

        <View style={{ flex: -1.5, justifyContent: 'space-between', }}>
          
            <View style={styles.textContainer}>
                <View style= {{width: '80%'}}>
              <Text
                style={[styles.text]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {title
                  ? title.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ""}
                                 {component && <Text style={{fontSize: 11,  }}>{` (${component})`}</Text>}
              </Text>
              </View>
              {action}
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
  <View
    style={{ flexDirection: "row", alignItems: "center", gap: 9, alignItems: 'center' }}
  >
    <Text style={{ fontSize: 18}}>{`$${(price).toFixed(2)}`}</Text>
    {quantity != null && <View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 5, borderRadius: 50}}>
        <Text>{quantity}</Text>
    </View>}
  </View>
  <View style={{}}>
   {children}
</View>
</View>
            {/* <ScrollView style={{ width: '95%', maxHeight: 97, height: 50, paddingTop: 3 }}>
              {side && <><View
                style={{ alignItems: "center", justifyContent: 'center', marginTop: 2, flexDirection: 'row', flexWrap: 'wrap'}}
              ><Text style={{ fontSize: 11.5}}>Sides:</Text>
                {side.map((item,idx)=><View key={idx} style={{marginHorizontal: 2}}><Image source={{uri: item.images[0]}} style={{width: 25, height: 30, borderRadius: 30}}/><View style={{ position: 'absolute', top: -5,zIndex: 6, backgroundColor: '#FFFDD0', width: 25, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}><Text style={{fontSize: 9}}>${item.price}</Text></View></View>)}
              </View><View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: 3}}></View></>}
              {options.map((option, index) => (option.values?.length > 0 && <View key={index} style={{ alignItems: "center", alignItems: 'center', marginTop: 2}}>
 <Text key={index}  numberOfLines={1} style={{fontSize: 11.5, textAlign: 'center'}}>{option.name}: <Text style={{fontSize: 10, textAlign: 'center'}}>{option.values.map((value, valIndex) => (
            <Text key={valIndex}>{value.name + " , "}</Text>
        ))}</Text></Text>
  <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: 3}}></View>
</View>))}  
{instruction && (
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{  fontSize: 12 }}>Instructions</Text>
        <Text style={{  fontSize: 10, textAlign: 'right' }}>
          {instruction}
        </Text>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: width / 3, height: 3, marginTop: 8 }} />
      </View>
    )}
            </ScrollView> */}
        </View>
       
      </View>
      <View style={[{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', },  visible ? {borderBottomWidth: 1} :{ }]}
      ><><View
                style={{ alignItems: "center",  marginTop: 2, flexDirection: 'row', flexWrap: 'wrap'}}
              >
                {!visible && side?.map((item,idx)=><View key={idx} style={{marginHorizontal: 2}}><Image source={{uri: item.images[0]}} style={{width: 25, height: 30, borderRadius: 30}}/><View style={{ position: 'absolute', top: -5,zIndex: 6, backgroundColor: '#FFFDD0', width: 25, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}><Text style={{fontSize: 9}}>${item.price}</Text></View></View>)}
              </View></>
              <TouchableOpacity onPress={()=>setVisible(prev => !prev)} style={{}}>
                {!visible && <Svg xmlns="http://www.w3.org/2000/svg" width={23} height={23} viewBox="0 0 320 512"><Path class="fa-secondary" opacity=".4" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/><Path class="fa-primary" d=""/></Svg>}
                {visible && <Svg xmlns="http://www.w3.org/2000/svg" width={23} height={23} viewBox="0 0 320 512"><Path class="fa-secondary" opacity=".4" d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/><Path class="fa-primary" d=""/></Svg>}
              </TouchableOpacity>
        </View>
         {visible && <ScrollView style={{ width: '95%',  paddingVertical: 3 }}>
              {side?.length > 0 && <><View
                style={{ alignItems: "center", justifyContent: 'center', marginTop: 2, flexDirection: 'row', flexWrap: 'wrap'}}
              ><Text style={{ fontSize: 11.5}}>Sides</Text>
                {side.map((item,idx)=><View key={idx} style={{marginHorizontal: 2}}><Image source={{uri: item.images[0]}} style={{width: 25, height: 30, borderRadius: 30}}/><View style={{ position: 'absolute', top: -5,zIndex: 6, backgroundColor: '#FFFDD0', width: 25, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}><Text style={{fontSize: 9}}>${item.price}</Text></View></View>)}
              </View><View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: 3}}></View>
              <View>
              {side.map((extraItem, index) => (
                <Text style={{fontSize: 10, textAlign: 'center'}} key={index}>+ {extraItem.name}: ${extraItem.price.toFixed(2)}</Text>
              ))}
            </View>
            <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: 3}}></View>
              </>
              
              }
              {options?.map((option, index) => (option.values?.length > 0 && <View key={index} style={{ alignItems: "center", alignItems: 'center', marginTop: 2}}>
 <Text key={index}  numberOfLines={1} style={{fontSize: 11.5, textAlign: 'center'}}>{option.name}: <Text style={{fontSize: 10, textAlign: 'center'}}>{option.values.map((value, valIndex) => (
            <Text key={valIndex}>{value.name + " , "}</Text>
        ))}</Text></Text>
  <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: 3}}></View>
</View>))}  
{instruction && (
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{  fontSize: 12 }}>Instructions</Text>
        <Text style={{  fontSize: 10, textAlign: 'right' }}>
          {instruction}
        </Text>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: width / 3, height: 3, marginTop: 8 }} />
      </View>
    )}
            </ScrollView>}
           </View>
  );
}
export default ProductAction;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    padding: 15,
    paddingTop: 7,
    paddingRight: 7,
    paddingBottom: 5,
    backgroundColor: "white",
    justifyContent: "space-around",
    marginBottom: 5
    
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
    // borderWidth: 2
  },
  textContainer: {flexDirection: 'row', justifyContent: 'space-between',},
  image: {
    width: width / 5.8,
    height: height / 12,
    borderRadius: 50,
  },
  text: { fontSize: 16, fontWeight: 500, lineHeight: 25,  },
  priceView: {
    position: "absolute",
    top: 15,
    zIndex: 2,
    left: 15,
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "#283618",
    padding: 0.5,
    paddingHorizontal: 6,
    borderRadius: 30,
    zIndex: 1,
  },
  priceText: {
    color: "white",
    // fontWeight: "900",
    fontStyle: "italic",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    // fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
});
{/* <View style={{ flex: -1.5, justifyContent: 'space-between',gap: 9 }}>

<View style={styles.textContainer}>
    <View style= {{width: '80%'}}>
  <Text
    style={[styles.text]}
    ellipsizeMode="tail"
    numberOfLines={2}
  >
    {title
      ? title.replace(/\b\w/g, (char) => char.toUpperCase())
      : ""}
  </Text>
  </View>
  {action}
</View>
<View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
  <View
    style={{ flexDirection: "row", alignItems: "center", gap: 9, alignItems: 'center' }}
  >
    <Text style={{ fontSize: 18}}>{`$${(price).toFixed(2)}`}</Text>
    {quantity != null && <View style={{backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 25, paddingVertical: 5, borderRadius: 50}}>
        <Text>{quantity}</Text>
    </View>}
  </View>
  <View style={{width: '45%'}}>
   {children}
</View>
</View>
</View>
</View>
</Pressable> */}