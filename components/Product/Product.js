import { Image, Pressable } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import FlexButton from "../Buttons/FlexButton";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


function Product({ image, width = 450 }) {
    let text = 'Hot Pockets Hot Ones Frozen Fiery Hot Pepperoni - 2ct 9oz'
    let size = width / 1.8
    console.log(size)
    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>  
           
            
            <View style = {[ {flex: 1, justifyContent: 'center',  marginRight: 20}]}>
            <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
            <Image style={styles.image} source={require('../../assets/dsBuffer.bm.png')} />
            </Pressable>
            </View>
           
            <View style = {{flex: -1.5, width: size, gap: 10,paddingTop: 20}} >
           
            <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }}>
          <View style={styles.textContainer}>
            <Text style={[styles.text, ]} ellipsizeMode="tail" numberOfLines={2}>
              {text ? text.replace(/\b\w/g, (char) => char.toUpperCase()) : ""}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 2,}} >
            <AntDesign name="star" size={20} color="#BC6C25" />
            <AntDesign name="star" size={20} color="#BC6C25" />
            <AntDesign name="star" size={20} color="#BC6C25" />
            <AntDesign name="star" size={20} color="#BC6C25" />
            <AntDesign name="star" size={20} color="#BC6C25" />
            </View>
            <Text style = {{fontSize: 16, fontWeight: '400', lineHeight: 20}}>53</Text>
            </View>
          </Pressable>
          <View style = {{flex: -1, height: 50}}>
          <FlexButton color = {'#aaa'} borderRadius={5} width={1.5}><Text style={{fontSize: 10}} > <Feather name="shopping-cart" size={10} color="black" /> Add to Cart</Text></FlexButton>
          </View>
          
          </View>
          <View style ={{ width: size, flex: 1, zIndex: 1, position: 'absolute', paddingLeft: (size/3.65) }}>
          <View style={{flexDirection: 'row', alignSelf:"flex-start", gap: 5, backgroundColor: '#283618', padding:0.5, paddingHorizontal: 6, borderRadius: 30, zIndex : 1}}>
                <Text style={{ color: 'white', fontWeight: "900", fontStyle: 'italic', fontSize: 10}}>$2.99</Text>
                <Text style={{color: '#aaa',fontWeight: "700", fontStyle: 'italic', textDecorationLine: 'line-through', fontSize: 10}}>$5.00</Text>
            </View>
          </View>
          </View>
        </View>
    );
  }
export default Product
const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: 'center'
        

    },
    textContainer: { marginBottom: 5},
    container: {
      borderWidth: 2,
      borderColor: "rgba(0,0,0,0.05)",
      borderRadius: 10,
      marginHorizontal: 8,
      marginTop: 20, 
      padding: 16,
      flex: 1,
      overflow: 'scroll'
   
    },
    image: { maxWidth:80 , height: 80, resizeMode: "contain", alignSelf: 'center' },
    text: {fontSize: 16, fontWeight: 500},
  });
