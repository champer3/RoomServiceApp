import { Image, Pressable, Dimensions, ScrollView } from "react-native";
import { StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';


function ProductDescription({title, image, price, reviews, category, side,flavour,option,instruction,quantity, action,onPress, onTap, children }) {
  
  return (
    <View style={[styles.container]}>
      <View style={styles.imageContainer}>
        <View
          style={{
            flex: -1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10
          }}
        >
            <View style={{
            justifyContent: "center",
            alignItems: "center",
            marginRight: 20,
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 50,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
            <Image
              style={styles.image}
              source={image}
            />
          </View>
          <Text style={{fontWeight: 900, fontSize: 14}}>{`Total: $${(price).toFixed(2)}`}</Text>
          {option && <Text style={{fontWeight: 900, fontSize: 14}}>{`Picked: ${option}`}</Text>}
        </View>

        <View style={{ flex: -1.5, justifyContent: 'space-between',gap: 9 }}>
          
            <View style={styles.textContainer}>
                <View style= {{width: '65%'}}>
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
              {(side || option  || instruction  || !flavour.length == 0) && onPress && <Pressable onPress={onPress} style={styles.right}>
        <AntDesign name="edit" size={25} color="#BC6C25" />
      </Pressable>}
              {action && <Pressable onPress={action} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={35} color="#B22334" /></Pressable>}
              
            </View>
            <ScrollView style={{gap: 12}}>
              {side && <View
                style={{ alignItems: "center", gap: 9, alignItems: 'center', marginTop: 8 }}
              >
                
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Sides</Text>
                {side.map((item,idx)=><Text key={idx} style={{fontWeight: 'bold', fontSize: 10}}>{item}</Text>)}
                <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: width/3, height: 3}}></View>
              </View>}
              {flavour.length > 0 && <View
                style={{ alignItems: "center", gap: 9, alignItems: 'center' , marginTop: 8}}
              >
                {/* <Text style={{fontWeight: 'bold', fontSize: 18}}>{`$${(price).toFixed(2)}`}</Text> */}
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Flavours</Text>
                {flavour.map((item,idx)=><Text key={idx} style={{fontWeight: 'bold', fontSize: 10}}>{item}</Text>)}
                <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: width/3, height: 3}}></View>
              </View>}
              
              {instruction && <View style={{ alignItems: "center", alignItems: 'center' }}>
                <Text style={{fontWeight: 'bold', fontSize: 13}} >Instructions</Text>
               <Text style={{fontWeight: 'bold', fontSize: 10, textAlign: 'right'}}>{instruction}</Text>
               <View style={{backgroundColor: 'rgba(0,0,0,0.5)', width: width/3, height: 3}}></View>
                </View>}
            </ScrollView>
        </View>
      </View>
    </View>
  );
}
export default ProductDescription;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 45,
    // marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "space-around",
    
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'
    // borderWidth: 2
  },
  textContainer: {flexDirection: 'row',justifyContent: 'space-between'},
  image: {
    maxWidth: width / 5,
    height: height / 10,
    borderRadius: 50,
  },
  text: { fontSize: 16, fontWeight: 900, lineHeight: 25, },
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
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
});
