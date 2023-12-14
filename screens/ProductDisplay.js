import { Image, StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
// import Carousel from 'react-bootstrap/Carousel';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
function ProductDisplay() {
  const [index, setIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <SafeAreaView>
        <View style={{paddingLeft: '5%', paddingTop: '6%', backgroundColor: "#FAFAFA"}}>
        <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Ionicons name="md-arrow-back-outline" size={40} color="black" />
        </Pressable>
        </View>
        <View>
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
                <View>
                    <Text>Quantity</Text>
                    <View style ={{alignSelf: 'flex-start'}}>
                    <IncrementDecrementBtn/>
                    </View>
                </View>
                <View>

                </View>
            </View>
        </View>
        <View>

        </View>
    </SafeAreaView>
  );
}
export default ProductDisplay