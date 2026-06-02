import { Image, Pressable, Dimensions, ImageBackground, Platform } from "react-native";
import { StyleSheet, View } from "react-native";
import FlexButton from "../Buttons/FlexButton";
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../Text';
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../../Data/cart'
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import IncrementDecrementBtn from "../Buttons/IncrementDecrementBtn";
import CircleButton from "../Buttons/CircleButton";
import IncrementDecrementBton from "../Buttons/IncrementDecrementBtn copy";
import { TouchableOpacity } from "react-native-gesture-handler";
import Svg, { Path } from 'react-native-svg';
const { width, height } = Dimensions.get("window");
import { LinearGradient } from "expo-linear-gradient";
import { buildDefaultFormObject } from "../../utils/productCartForm";
const CARD_WIDTH = 160;

function formatPriceShort(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  return x.toFixed(2);
}

function Product({ product, layout = 'rail' }) {
  function isValidURL(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }

    return str.startsWith("http://") || str.startsWith("https://");
  }
  function handleIncrement() {
    if (!canAddToCart()) {
      navigation.navigate('Product', { product, productData })
      return
    }
    dispatch(addToCart({ id: productData }))
  }
  function handleDecrement(index) {
    dispatch(removeFromCart({ id: { 'index': index } }))
  }
  const canAddToCart = () => {
    // Check if there are at least 2 items in the extra array
    if (product?.extra) {
      return false; // Cannot add to cart if there are fewer than 2 extra items
    }
    if (Array.isArray(product?.components) && product.components.length > 0) {
      return false;
    }
    for (let optionCategory of Array.isArray(product?.options) ? product.options : []) {
      if (optionCategory?.required) {
        return false; // Cannot add to cart if any required category doesn't meet the required quantity
      }
    }
    if (Array.isArray(product?.variantGroups) && product.variantGroups.length > 0) {
      return false;
    }
    if (Array.isArray(product?.addons) && product.addons.length > 0) {
      return false;
    }
    return true;
  };
  // const dummyData = {
  //   id: 1,
  //   title: "Classic Cheese Burger",
  //   image: "https://example.com/cheese-burger.jpg", // Replace with your own image URL
  //   description: "Juicy beef patty topped with melted cheese, fresh lettuce, tomato, pickles, and our special sauce, all nestled in a toasted bun.",
  //   price: 15.50,
  //   rating: 4.8,
  //   time: 12, // in minutes
  //   calories: 145, // in kcal
  //   extras: [
  //     {
  //       name: "More Ham",
  //       price: 4.50,
  //     },
  //     {
  //       name: "Spicy",
  //       price: 0.50,
  //     },
  //     {
  //       name: "Add Egg",
  //       price: 2.00,
  //     },
  //   ],
  //   options: [{'name': 'Flavors', 'value': [
  //     {
  //       name: 'Barbeque',
  //       price: 0
  //     },
  //     {
  //       name: 'Lemon Hot',
  //       price: 0
  //     },
  //     {
  //       name: 'Hot',
  //       price: 0
  //     },
  //     {
  //       name: 'Mild Hot',
  //       price: 0
  //     },
  //   ] ,  'required': false,
  //   'quantity': 2
  // },{'name': 'Drinks', 'value': [
  //     {
  //       name: 'Coca Cola',
  //       price: 2,
  //       images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
  //     },
  //     {
  //       name: 'Smirnoff',
  //       price: 1,
  //       images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
  //     },
  //     {
  //       name: 'Pepsi',
  //       price: 2,
  //       images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
  //     },
  //     {
  //       name: 'Lemonade',
  //       price: 3,
  //       images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
  //     },
  //   ],
  //   'required': false,
  //   'quantity': 4
  // }]
  // };
  const productData = buildDefaultFormObject(product);
  //   const [show, setShow] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  //   const productItems = useSelector((state) => state.productItems.ids);
  //   function handleAddToCart(product){
  //     dispatch(addToCart({id : product}))
  //   }
  //   function handleRemoveFromCart(product){
  //     dispatch(removeFromCart({id : product}))
  //   }
  function addQuantityToObjects(inputList) {
    const result = {};
    inputList.forEach(obj => {
      const title = obj.products[0].title;
      result[title] = (result[title] ?? 0) + obj.products.length
    });
    return result;
  }
  //   // const item = productItems.find(item => product.title === title);


  //   // Example usage:

  const newList = addQuantityToObjects(cartItems);
  var quantity = 0
  if (newList) {
    quantity = newList[product.title]
  }

  function pressHandler() {
    navigation.navigate('Product', { product, productData })

  }

  const meta = product?.metadata && typeof product.metadata === "object"
    ? product.metadata
    : {};
  const brandStr = meta.brand != null ? String(meta.brand).trim() : "";
  const unitStr = meta.unit_size != null ? String(meta.unit_size).trim() : "";
  const metaLine = [brandStr, unitStr].filter(Boolean).join(" · ");
  const tagList = Array.isArray(product?.tags)
    ? product.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];
  const subCats = Array.isArray(product?.subCategory) ? product.subCategory : [];
  const pillLabels = [...new Set([...subCats, ...tagList])].slice(0, 4);
  const morePills =
    [...new Set([...subCats, ...tagList])].length - pillLabels.length;
  const shortBlurb = String(product?.shortDescription || "").trim();
  const longBlurb = String(product?.description || "").trim();
  const blurb = shortBlurb || longBlurb;
  const basePrice = Number(product?.price) || 0;
  const compareRaw = Number(product?.comparePrice);
  const showCompare =
    Number.isFinite(compareRaw) && compareRaw > basePrice + 0.001;

  //   const getAverageRatingByTitle = () => {
  //     const item = productItems.find(item => item.title === title);

  //     if (item && item.reviews.length > 0) {
  //         const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
  //         const averageRating = totalRating / item.reviews.length;
  //         return averageRating;
  //     } else {
  //         return 0; // Indicate that there are no reviews or the item is not found
  //     }
  // };
  //   const rating = getAverageRatingByTitle().toFixed(0)
  //   var rate = []
  //     for (var i = 0; i < 5; i++ ){
  //         if (i < rating){
  //             rate.push('star')
  //         }
  //         else{
  //             rate.push('staro')
  //         }
  //     }

  const cardW = layout === 'grid' ? Math.max(140, Math.floor((width - 52) / 2)) : CARD_WIDTH;
  const imgH = layout === 'grid' ? 108 : 142;
  const listImgUri =
    Array.isArray(product?.images) && product.images[0] && isValidURL(product.images[0])
      ? product.images[0]
      : null;

  if (layout === 'list') {
    return (
      <View style={styles.listContainer}>
        <View style={styles.listRow}>
          <Pressable onPress={pressHandler} style={styles.listMainPress}>
            {listImgUri ? (
              <Image source={{ uri: listImgUri }} style={styles.listImage} resizeMode="cover" />
            ) : (
              <View style={[styles.listImage, styles.listImagePlaceholder]} />
            )}
            <View style={styles.listBody}>
              <Text style={styles.listTitle} numberOfLines={2}>
                {product.title}
              </Text>
              {blurb ? (
                <Text style={styles.listDesc} numberOfLines={2}>
                  {blurb}
                </Text>
              ) : null}
              {pillLabels.length > 0 ? (
                <View style={styles.listPills}>
                  {pillLabels.slice(0, 3).map((item, index) => (
                    <View key={`${item}-${index}`} style={styles.listPill}>
                      <Text style={styles.listPillText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={styles.listPriceRow}>
                {showCompare ? (
                  <Text style={styles.comparePrice}>${formatPriceShort(compareRaw)}</Text>
                ) : null}
                <Text style={styles.listPrice}>${basePrice.toFixed(2)}</Text>
              </View>
            </View>
          </Pressable>
          <Pressable onPress={handleIncrement} style={styles.listAddBtn}>
            <Text style={styles.listAddText}>+ Add</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, layout === 'grid' && { marginRight: 0 }]}>
      <Pressable onPress={pressHandler}>
        {Array.isArray(product?.images) && product.images[0] && isValidURL(product.images[0]) && (
          <ImageBackground
            style={[styles.image, { width: cardW, height: imgH }]}
            imageStyle={{ borderRadius: layout === 'grid' ? 14 : 16 }}
            source={{ uri: product.images[0] }}
          >
            {/* Apply LinearGradient as an overlay */}
            <View
              style={[styles.gradient, { width: cardW }]}
            >
              <Pressable style={styles.minusButton} onPress={handleIncrement}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13Z"
                    fill="#283618"
                  />
                </Svg>
              </Pressable>
              {quantity > 0 && <View style={styles.textButton}><Text style={styles.price}>{quantity}</Text></View>}
              {quantity > 0 && <Pressable disabled={quantity == 0} style={styles.addButton} onPress={quantity > 0 ? () => { handleDecrement(cartItems.findIndex(item => product.title === item.products[0].title)) } : () => { }}>
                <Svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><Path fill="#283618" d="M432 256c0 13.3-10.7 24-24 24L40 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l368 0c13.3 0 24 10.7 24 24z" /></Svg>
              </Pressable>}
              <View style={[styles.detailsContainer, { maxWidth: cardW }]}>
                {pillLabels.map((item, index) => (
                  <View key={`${item}-${index}`} style={styles.pill}>
                    <Text style={styles.pillText}>{item}</Text>
                  </View>
                ))}
                {morePills > 0 ? (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>+{morePills}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </ImageBackground>
        )}</Pressable>
      <Text
        style={[styles.name, { width: cardW }, layout === 'grid' && styles.nameGrid]}
        numberOfLines={layout === 'grid' ? 2 : 1}
        ellipsizeMode="tail"
      >
        {product.title}
      </Text>
      {metaLine ? (
        <Text style={[styles.metaLine, { width: cardW }]} numberOfLines={1} ellipsizeMode="tail">
          {metaLine}
        </Text>
      ) : null}
      {blurb ? (
        <Text
          style={[styles.description, { width: cardW }, layout === 'grid' && styles.descriptionGrid]}
          numberOfLines={layout === 'grid' ? 1 : 2}
          ellipsizeMode="tail"
        >
          {blurb}
        </Text>
      ) : layout !== 'grid' ? (
        <Text style={[styles.description, { width: cardW, opacity: 0.55 }]} numberOfLines={1}>
          Tap for details
        </Text>
      ) : null}
      <View style={{ width: cardW }}>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <View>
            {showCompare ? (
              <Text style={styles.comparePrice}>${formatPriceShort(compareRaw)}</Text>
            ) : null}
            <Text style={[styles.price, layout === 'grid' && styles.priceGrid]}>${basePrice.toFixed(2)}</Text>
          </View>
          <Pressable
            style={{
              backgroundColor: '#2f3f1f',
              paddingHorizontal: layout === 'grid' ? 6 : 8,
              paddingVertical: layout === 'grid' ? 3 : 4,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: layout === 'grid' ? 11 : 12,
                fontFamily: "Poppins-Regular",
                letterSpacing: 0.6,
              }}
            >
              Order
            </Text>
          </Pressable>
        </View>
        {/* <FlexButton></FlexButton> */}
      </View>
    </View>
  )
}

export default Product;
const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 10,
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  }, plus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  }, image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: CARD_WIDTH,
    height: 142,
    borderRadius: 16
  },
  button: {
    // position:'absolute',
    // top: 0,
    // left: width/9,
    alignSelf: 'flex-end'
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    gap: 4,
    bottom: 0,
    paddingHorizontal: 6,
    marginBottom: 6,
    maxWidth: CARD_WIDTH,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(66, 89, 40, 0.4)',
  },
  pillText: {
    fontSize: 10,
    color: '#2d3d22',
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.25,
  },
  name: {
    fontSize: 16,
    width: CARD_WIDTH,
    marginTop: 8,
    color: '#111827',
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 11,
    color: 'rgba(17,24,39,0.48)',
    width: CARD_WIDTH,
    marginVertical: 4,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: "Poppins-Regular",
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  metaLine: {
    fontSize: 10,
    color: 'rgba(17,24,39,0.42)',
    width: CARD_WIDTH,
    marginTop: 2,
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.6,
  },
  comparePrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontFamily: "Poppins-Regular",
  },
  price: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.7)',
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: "#EFF5E9",
    borderRadius: 35,
    width: width / 2.5,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  textContainer: { marginBottom: 5 },
  text: { fontSize: 14 },
  priceView: {
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 5,
    borderColor: '#aaa',
    borderRadius: 10,
    marginTop: 2,
    paddingTop: 0.5,
    borderRadius: 30,
  },
  priceText: {
    color: "white",
    // fontWeight: "900",
    fontSize: 14,
  },
  crossPrice: {
    color: "#aaa",
    // fontWeight: "700",
    fontStyle: "italic",
    textDecorationLine: "line-through",
    fontSize: 14,
  },
  minusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    // backgroundColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    position: 'absolute',
    top: 12,
    right: 58,
    backgroundColor: 'rgba(255,255,255,0.8)', // Orange color for the button
    borderRadius: 16,
    padding: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.8)', // Orange color for the button
    borderRadius: 16,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    width: CARD_WIDTH,
    borderRadius: 16,
  },
  nameGrid: {
    fontSize: 14,
    marginTop: 6,
  },
  descriptionGrid: {
    fontSize: 10,
    marginVertical: 2,
  },
  priceGrid: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  listContainer: {
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  listRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },
  listMainPress: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    minWidth: 0,
  },
  listImage: {
    width: 96,
    height: 96,
    borderRadius: 14,
    backgroundColor: "#e8ebe6",
  },
  listImagePlaceholder: {
    backgroundColor: "#e5e7eb",
  },
  listBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111827",
    letterSpacing: 0.2,
  },
  listDesc: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(17,24,39,0.55)",
    fontFamily: "Poppins-Regular",
    lineHeight: 16,
  },
  listPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  listPill: {
    backgroundColor: "rgba(66, 89, 40, 0.12)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  listPillText: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#2d3d22",
  },
  listPriceRow: {
    marginTop: 10,
  },
  listPrice: {
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },
  listAddBtn: {
    alignSelf: "center",
    backgroundColor: "#2f3f1f",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  listAddText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
});
{/* <View style={{paddingTop: 9}}>
<View style={[styles.container,{  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5, // Add elevation for Android shadow
}]}>
  
  <View style={styles.imageContainer}>
    <View
      style={{
        flex: -1,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
        // width: "10%"
      }}
    >
      <Pressable onPress={pressHandler} style={({ pressed }) => pressed && { opacity: 0.5 }}>
        {Array.isArray(product?.images) && product.images[0] && isValidURL(product.images[0]) && <Image
          style={styles.image}
          source={{uri:product.images[0]}}
        />}
      </Pressable>
    </View>

    <View style={{ flex: -1.5, width: `${size < 50 ? 100 : size * 3.75/6 }%`, gap: 10, paddingTop: 12 }}>
      <Pressable onPress={pressHandler} style={({ pressed }) => pressed && { opacity: 0.5 }}>
        <View style={styles.textContainer}>
          <Text
            style={[styles.text]}
            ellipsizeMode="tail"
            numberOfLines={title.length > 25 ? 2 : 1}
          >
            {product.title
              ? product.title.replace(/\b\w/g, (char) => char.toUpperCase()) + '\n'
              : "" }
          </Text>
          <View style={[styles.priceView, {backgroundColor: newPrice ? "#283618" : 'white', fontStyle: newPrice ? "italic" : 'normal', paddingHorizontal: newPrice ? 6 : 0,}]}>
            <Text style={[styles.priceText, {color : newPrice ? 'white' : 'black'}]}>{`$${oldPrice.toFixed(2)}`}</Text>
          {newPrice && <Text style={styles.crossPrice}>{`$${newPrice}`}</Text>}
          </View>
        </View>
      </Pressable>
    </View>
  </View>
</View>
<View style={{ height: height / 18, position: 'absolute', top: 0 , right: 0,zIndex: 12}}>
  {(!show || !quantity) && <Pressable style={{backgroundColor: 'white', borderRadius: 100, borderRightColor: '#aaa', borderRightWidth: 0.5,   shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5, // Add elevation for Android shadow
}} onPress={()=>{onAdd({image, title, oldPrice, newPrice, addOn, nutrient, extras, options}); setShow(true)}}>
    <AntDesign name="pluscircle" size={32} color="#BC6C25" />
  </Pressable>}
  {show && quantity && <IncrementDecrementBton minValue={quantity} onIncrease={()=>{onAdd({image, title, oldPrice, newPrice, addOn, nutrient, extras, options})}} onDecrease ={()=>{handleRemoveFromCart({ image, title, oldPrice})}}/>}
</View>
</View> */}
