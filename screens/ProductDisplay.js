import { Image, StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
function ProductDisplay() {
  const [index, setIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <SafeAreaView>
        <ScrollView>
        <View style={{paddingLeft: '5%', paddingVertical: '6%'}}>
        <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Ionicons name="md-arrow-back-outline" size={40} color="black" />
        </Pressable>
        </View>
        <View style= {{marginBottom: 120}}>
            <View style={{alignItems: 'center', backgroundColor: "#FAFAFA", paddingBottom:'6%'}}>
                
                <Image  source={require("../assets/snack.png")} style ={{width: width/2, height: height/4 }} />
                <View
                    style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    padding: 0.5,
                    paddingHorizontal: 6,
                    borderRadius: 30,
                    zIndex: 1,
                    position: "absolute",top: 0, zIndex: 2 , right: '15%'
                    }}
                >
                    <Text
                    style={{
                        color: "black",
                        fontWeight: "900",
                        fontSize: 20,
                    }}
                    >
                    $3.69
                    </Text>
                </View>
            </View>
            <View  style={{paddingHorizontal: '5%', marginVertical: '4%'}} >
                <View style ={{width: '100%'}}><Text
                    style={{
                        color: "black",
                        fontWeight: "900",
                        fontSize: 22,
                    }}
                    >Nerds Gummy Clusters Candy 5oz </Text></View>
                <View style = {{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor:'#aaa', paddingBottom: '3%'}}>
                    
                    <View >
                    <Pill text ="9289 Sold" type="null"/>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center', gap: 5}}>
                    <AntDesign name="star" size={30} color="black" />
                    <Text>4.0</Text>
                    <Text>(53 Reviews)</Text>
                    </View>
                    <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }} >
                    <Text style={{color: "#BC6C25", fontSize: 12, fontWeight: 'bold'}}>See Reviews</Text>
                    </Pressable>
                </View>
                <View style = {{gap: 15, marginVertical: 30}}>
                    <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }} >Quantity</Text>
                    <View style ={{alignSelf: 'flex-start'}}>
                    <IncrementDecrementBtn/>
                    </View>
                    <View style = {{paddingVertical: 15, gap: 10}}>
                    <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }} >Description</Text>
                    <Text style={{
                        color: "#aaa",
                        fontSize: 16,
                        lineHeight: 35,
                    }} >Rainbow NERDS surround fruity, gummy centers. Those sweet little sparks are fantastic inventors. A poppable cluster, packed with tangy, crunchy NERDS. A candy so tasty, there aren’t even words.
                    NUTRITIONAL INFO</Text>
                    </View>
                    <View style={styles.catHead}>
                        <Text style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 16,
                    }} >Shop Related Products</Text>
                        <ProductCategory items={[1,2,3,4]}/>
                    </View>
                </View>
                <View>

                </View>
            </View>
        </View>
        </ScrollView>
        <View style={{flex: 1, width: "100%", paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
            <View style={{height: '150%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Text
                style={{
                    color: "#aaa",
                    fontWeight: "bold",
                    fontSize: 20,
                }}
                > Total Payment</Text>
                <Text
                    style={{
                        color: "black",
                        fontWeight: "600",
                        fontSize: 20,
                        
                    }}
                    > $3.69
                    </Text>
            </View>
            <View style ={{width: '40%', height: '130%'}}>
                <FlexButton background={'#283618'}><FontAwesome name="shopping-bag" size={24} color="white" /><Text style={{color: 'white'}}>Add to cart</Text></FlexButton>
            </View>
        </View>
        
    </SafeAreaView>
  );
}
export default ProductDisplay

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
})