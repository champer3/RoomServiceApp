import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
  Image,
  Modal
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import Product from "../../components/Product/Product";
import Input from "../../components/Inputs/Input"
import ProductCategory from "../../components/Category/ProductCategory";
import { useRoute } from "@react-navigation/native";
import {addToCart, removeFromCart} from '../../Data/cart'
import {useSelector, useDispatch} from 'react-redux'
import CartModal from "../../components/Cart/CartModal";
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get("window");
function CategorySearch() {
  const route = useRoute()
  const [visible, setVisible] = useState(false)
  const name = route.params.cat
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  const productItems = useSelector((state) => state.productItems.ids)
  const categoryObject = {};
  
  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 1500);
  }, [visible])
  productItems.forEach(item => {
    const category = item.category;

    if (!categoryObject[category]) {
        // If the category key doesn't exist, create it with an array containing the current item
        categoryObject[category] = [item];
    } else {
        // If the category key already exists, push the current item to the existing array
        categoryObject[category].push(item);
    }
});
function handleAddToCart(product){
  dispatch(addToCart({id : product}))
  setVisible(true)
}
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          borderRadius={16}
          style={styles.backgroundImgStyle}
          source={require("../../assets/categoryPic.png")}
        >
          <View style={styles.catHead}>
            <Text style={styles.text}>{name}</Text>
          </View>
        </ImageBackground>
        <Input icon={<EvilIcons name="search" size={24} color="#aaa" />} text={'Search'}/>
        {/* <View style={styles.input}>
          <EvilIcons name="search" size={24} color="#aaa" />
          <TextInput
            style={{ fontSize: 16 }}
            placeholder="Search                                                                          "
          />
        </View> */}
        <View style={styles.topList}>
          <Text style={{ fontWeight: "700", fontSize: 20 }}>{`All ${name}`}</Text>
          <Pressable>
            <Text style={{ color: "#BC6C25" }}>
              {" "}
              <Ionicons name="filter" size={16} color="#BC6C25" /> Filter By
            </Text>
          </Pressable>
        </View>
        {categoryObject[name.toLowerCase()] && <ProductCategory items={categoryObject[name.toLowerCase()]} onPress={handleAddToCart} />}
        {!categoryObject[name.toLowerCase()] && <View  style={{gap: 19, marginBottom: 45}}><View><Image style={styles.image} source={require('../../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>We don’t have this item yet 😥😥.</Text></View>}
        {visible && <View style ={{
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    alignItems: 'center',opacity: 1, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style ={{ 
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,}}><CartModal/></View>
        </View>}
        {/* <View>
        <Product />
        <Product />
        </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default CategorySearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2%",
    marginTop: "10%",
  },
  catHead: {
    marginVertical: "10%",
  },
  backgroundImgStyle: {
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    paddingVertical: 20,
    paddingLeft: 16,
    marginVertical: 16,
    borderRadius: 16,
  },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },
  text: { color: "white", fontWeight: "500", fontSize: 24 },
  topList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16
  },
});
