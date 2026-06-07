import { Image, StyleSheet, TextInput, View, Pressable, Dimensions, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppImage from "../components/AppImage";
import { postAppApplyCoupon } from "../api/appPromotions";
import { cartLinesForPromoApi } from "../utils/cartPromoPayload";
import CartPromotionSummary from "../components/promotions/CartPromotionSummary";
import CouponEntrySection from "../components/promotions/CouponEntrySection";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Review from "../components/Reviews/Review"
import Rating from "../components/Reviews/Rating"
import Pill from '../components/Pills/Pills'
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import { EvilIcons } from '@expo/vector-icons';
import ProductAction from "../components/Product/ProductAction";
import Svg, {Path} from 'react-native-svg';
import Input from "../components/Inputs/Input";
import Deal from "../components/Category/Deal";
import Text from '../components/Text';
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import {addToCart, removeFromCart, deleteFromCart, addOptions, addItem, updateCart} from '../Data/cart'
import useThrottledPress from '../hooks/useThrottledPress'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '../components/Modals/BottomSheet';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
// import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import ProductDescription from "../components/Product/ProductDescription";
import IncrementDecrementBton from "../components/Buttons/IncrementDecrementBtn copy";
const { width, height } = Dimensions.get("window");

function CartDisplay() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids)
  const [extra, setExtra] = useState()
  const [plus, setPlus] = useState([])
  function findPrice(foodName) {
    for (let i = 0; i < pro.extras.length; i++) {
      if (pro.extras[i][0] === foodName) {
        return pro.extras[i][1];
      }
    }
    return "Item not found in the menu";
  }

const [option, setOption] = useState()
const ref = useRef(null);
function createFoodDictionary(foodArray) {
  let foodDictionary = {};
  for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
  }
  return foodDictionary;
}
function countFoodDictionary(foodArray, index) {
  let foodDictionary = {};
  for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
  }
  if (display[index].Sides){
  for (let i = 0; i < display[index].Sides.length; i++){
    foodDictionary[display[index].Sides[i]]++;
  }
}
  return foodDictionary;
}

// Example usage:
let [foodStore, setFood] = useState({})
const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro , setPro] = useState({})
  const [selected, setSelected] = useState([])
  const productItems = useSelector((state) => state.productItems.ids);
  
  function handleAddToCart(index) {
    dispatch(addItem({ id: {'index': index} }));
  }
  function handleRemoveFromCart(index) {
    dispatch(removeFromCart({ id: {'index': index} }));
  }
  function handleDeleteFromCart(index) {
    dispatch(deleteFromCart({ id: {'index': index} }));
  }
  function getTotalSum() {
    var totalPrice = 0;
    cartItems.forEach(obj => {
      const title = Object.keys(obj)[0];
        const titleArray = Object.values(obj)[0];
        
        titleArray.forEach(item => {
            totalPrice += item.oldPrice;
        });
        cost[title] = totalPrice
    });
    return totalPrice
  }
  const calculateTotalPrice = (formObject) => {
    const productQuantity = formObject.products.length;
    let totalPrice = formObject.products[0].price * productQuantity;

    formObject.extra?.forEach((extraItem) => {
      totalPrice += (Number(extraItem.price) || 0) * productQuantity;
    });

    (formObject.options || []).forEach((optionCategory) => {
      (optionCategory.values || []).forEach((selectedOption) => {
        const p = Number(selectedOption.price) || 0;
        totalPrice += optionCategory.required ? p * productQuantity : p;
      });
    });

    (formObject.variantSelections || []).forEach((group) => {
      (group.selected || []).forEach((choice) => {
        totalPrice += (Number(choice.priceDelta) || 0) * productQuantity;
      });
    });

    (formObject.schemaAddonsSelected || []).forEach((addon) => {
      totalPrice += (Number(addon.price) || 0) * productQuantity;
    });

    return totalPrice;
  };
  const cost = {}
  function addQuantityToObjects(inputList) {
      const titleCountMap = {};

      const result = {};
    inputList.forEach(obj => {
        const title = Object.keys(obj)[0];
        let count = 0;
        const arrayLength = obj[title].forEach(item => count += item.products.length);
        result[title] = count;
    });
      // Loop through the inputList to count occurrences of each title
      inputList.forEach((obj) => {
          const title = obj.title;

          // Increment the count for the title or initialize to 1 if it doesn't exist
          titleCountMap[title] = (titleCountMap[title] || 0) + 1;
      });
      
      
    inputList.forEach(obj => {
      var totalPrice = 0;
      const title = Object.keys(obj)[0];
        const titleArray = Object.values(obj)[0];
        
        titleArray.forEach(item => {
            totalPrice += calculateTotalPrice(item)
        });
        cost[title] = totalPrice
    });
      // Loop through the inputList again to create a new list with quantity key
      const newList = inputList.map((obj) => {
          const title = Object.keys(obj)[0];
          const quantity = result[title];

          // Remove duplicates by setting quantity to 0 for subsequent occurrences of the same title
          titleCountMap[title] = 0;

          return { ...obj[title][0], ['oldPrice'] : cost[title], quantity };
      });
      const filteredList = newList.filter((obj) => obj.quantity !== 0);

      return filteredList;
  }
  const [display, setDisplay] = useState([])
  const ref2 = useRef(null)
  function handleSelect(name){
    const indexToUpdate = cartItems.findIndex(obj => Object.keys(obj)[0] === name);
    setDisplay(cartItems[indexToUpdate][name])
  }
  const [plus1, setSides] = useState([])
  const [instruction, setInstruction] = useState('')
  const [addOn1, setAddOn] = useState([])
  const [option1, setOption1] = useState(null)
  const [index, setIndex] = useState()

  function handleEdit(name, index){
    ref3?.current?.scrollTo(-570); ref2?.current?.scrollTo(0); 
    let product = []
    productItems.forEach((item) => {if(item.title == name ){product = item}})
    if (product.extras){
    setFoodDictionary(countFoodDictionary(product.extras, index))
    }
    setIndex(index)
    setPro(product)
    setSides(display[index].Sides)
    if (display[index].Flavour){
    setAddOn(display[index].Flavour)}
    else{
      setAddOn([])
    }
    setOption1(display[index].Picked)
    setInstruction(display[index].instruction)
  }
    const navigation = useNavigation()
    const [appliedCouponUi, setAppliedCouponUi] = useState(null);
    const [promoSummaryLines, setPromoSummaryLines] = useState([]);
    const [couponError, setCouponError] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);

    const promoDiscount = promoSummaryLines.reduce((s, l) => s + (Number(l.appliedAmount) || 0), 0);

    const handleApplyCoupon = async (code) => {
      setCouponLoading(true);
      setCouponError(null);
      try {
        const items = cartLinesForPromoApi(cartItems);
        const res = await postAppApplyCoupon({
          code,
          items,
          orderType: "delivery",
        });
        const body = res.data;
        if (res.status === 200 && body?.status === "success" && body?.data) {
          const d = body.data;
          setAppliedCouponUi(d.coupon);
          const amt = Number(d.appliedAmount || 0);
          setPromoSummaryLines([
            {
              id: d.coupon?.id,
              title: d.coupon?.title || code,
              subtitle: d.coupon?.pricing?.formattedDiscount,
              appliedAmount: amt,
            },
          ]);
          await AsyncStorage.setItem(
            "@checkout_promo_v1",
            JSON.stringify({
              title: d.coupon?.title || code,
              subtitle: d.coupon?.pricing?.formattedDiscount,
              appliedAmount: amt,
            })
          );
        } else {
          const err = body?.error || body?.message;
          setCouponError(
            typeof err === "string" ? err : err?.message || "Could not apply coupon"
          );
        }
      } catch (e) {
        const msg =
          e?.response?.data?.error?.message ||
          e?.response?.data?.message ||
          e?.message ||
          "Network error";
        setCouponError(msg);
      } finally {
        setCouponLoading(false);
      }
    };
    const pressHandler = useThrottledPress(() => {
      if (cartItems.length > 0){
        navigation.navigate('Checkout')}
    }, 600);
    const dealHandler = useThrottledPress(() => {
        navigation.navigate('All Deals')
      }, 600);
      function toggleNumberInArray(number) {
        setSelected((prev)=> {
            const array = [...prev]
            const index = array.indexOf(number);
        if (index === -1) {
            // Number is not in the array, so add it
            array.push(number);
        } else {
            // Number is already in the array, so remove it
            array.splice(index, 1);
        }
        return array
        })
      }
      function toggleNumberInArray1(number) {
        setAddOn((prev)=> {
            const array = [...prev]
            const index = array.indexOf(number);
        if (index === -1) {
            // Number is not in the array, so add it
            array.push(number);
        } else {
            // Number is already in the array, so remove it
            array.splice(index, 1);
        }
        return array
        })
      }
      function handleAdd(){
        let price = 0;
        let newItem ={}
        console.log(selected)
        if (plus && plus.length > 0){
        for (var i = 0; i < plus.length; i ++){
            price += findPrice(plus[i])
          }
          newItem = {...newItem, ...{ 'Sides' : plus}}
        }
        if (option != undefined){
          newItem = {...newItem, ... {'Picked' : pro.options[option]}}
        }
        if (selected && selected.length > 0){
          newItem = {...newItem, ... {'Flavour' : selected}}
        }
        setPlus([])
        setOption()
        
        ref?.current?.scrollTo(0)
        setFoodDictionary(foodStore)
        dispatch(addToCart({id : {title: pro.title, ...{...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
      }
    function handleUpdate(){
      let price = 0;
      let newItem ={}
      if (plus1){
      for (var i = 0; i < plus1.length; i ++){
          price += findPrice(plus1[i])
        }
        newItem = {...newItem, ...{ 'Sides' : plus1}}
      }
      if (option1){
        newItem = {...newItem, ... {'Picked' : option1}}
      }
      if (addOn1 && addOn1.length > 0){
        newItem = {...newItem, ... {'Flavour' : addOn1}}
      }
      ref3?.current?.scrollTo(0); ref2?.current?.scrollTo(0);
      dispatch(updateCart({id : {title: pro.title, index: index, newItem: {...pro, ...newItem, ['oldPrice'] : pro.oldPrice + price} }}))
    }
    function getFlavors(flavor){
      if (flavor){
      var res = []
      for (var i = 0; i < flavor.length; i++ ){
        res.push(display[0].extras[flavor[i]])
      }
      return res
    }
    return []
    }
    console.log(display)
    const ref3 = useRef()
   // Helper function to calculate the subtotal for all items
   const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => {
      const productPrice = calculateTotalPrice(item)
      return total + productPrice 
    }, 0);
  };
  const handleProductClick = useThrottledPress((item, index) => {
    const product = item.products[0];
    const productData = { ...item };
    navigation.navigate('Product', { product, productData });
    requestAnimationFrame(() => {
      dispatch(deleteFromCart({ id: { 'index': index } }));
    });
  }, 600);
  const fmtShort = (v) => { const n = Number(v); return n % 1 === 0 ? String(n) : n.toFixed(2); };

  function isValidURL(str) {
    if (typeof str !== 'string') str = String(str);
    return str.startsWith("http://") || str.startsWith("https://");
  }

  const renderCartItem = ({ item, index }) => {
    const product = item.products[0];
    const qty = item.products.length;
    const lineTotal = calculateTotalPrice(item);
    const unitPrice = product?.price ?? 0;
    const imgSrc = product?.images?.[0];
    const title = product?.title || "";
    const extras = item.extra;
    const opts = item.options;
    const instr = item.instructions;
    const variants = item.variantSelections;
    const addons = item.schemaAddonsSelected;
    const comp = item.components;

    const hasDetails = (extras?.length > 0) || (opts?.some(o => o.values?.length > 0)) ||
      (variants?.some(v => v.selected?.length > 0)) || (addons?.length > 0) || instr;

    return (
      <Pressable
        onPress={() => handleProductClick(item, index)}
        style={styles.cartCard}
      >
        <View style={styles.cartCardTop}>
          <AppImage
            uri={imgSrc && isValidURL(imgSrc) ? imgSrc : null}
            style={styles.cartItemImage}
          />
          <View style={styles.cartItemInfo}>
            <View style={styles.cartItemTitleRow}>
              <Text style={styles.cartItemTitle} numberOfLines={2} ellipsizeMode="tail">
                {title.replace(/\b\w/g, (c) => c.toUpperCase())}
                {comp ? <Text style={styles.cartItemComp}>{` (${comp})`}</Text> : null}
              </Text>
              <Pressable
                onPress={() => handleDeleteFromCart(index)}
                hitSlop={8}
                style={({ pressed }) => pressed && { opacity: 0.5 }}
              >
                <EvilIcons name="trash" size={38} color="#B22334" />
              </Pressable>
            </View>
            <Text style={styles.cartItemPrice}>${unitPrice.toFixed(2)} each</Text>

            {hasDetails && (
              <View style={styles.cartItemDetails}>
                {opts?.map((opt, i) =>
                  opt.values?.length > 0 ? (
                    <Text key={`opt-${i}`} style={styles.detailChip} numberOfLines={1}>
                      {opt.name}: {opt.values.map(v =>
                        v.name + (Number(v.price) > 0 ? ` (+$${fmtShort(v.price)})` : "")
                      ).join(", ")}
                    </Text>
                  ) : null
                )}
                {variants?.map((g, i) =>
                  g.selected?.length > 0 ? (
                    <Text key={`var-${i}`} style={styles.detailChip} numberOfLines={1}>
                      {g.groupName}: {g.selected.map(s =>
                        s.name + (Number(s.priceDelta) > 0 ? ` (+$${fmtShort(s.priceDelta)})` : "")
                      ).join(", ")}
                    </Text>
                  ) : null
                )}
                {extras?.slice(0, 3).map((e, i) => (
                  <Text key={`ext-${i}`} style={styles.detailChip} numberOfLines={1}>
                    + {e.name}{Number(e.price) > 0 ? ` (+$${fmtShort(e.price)})` : ""}
                  </Text>
                ))}
                {extras?.length > 3 && (
                  <Text style={styles.detailChip}>+{extras.length - 3} more</Text>
                )}
                {addons?.slice(0, 3).map((a, i) => (
                  <Text key={`add-${i}`} style={styles.detailChip} numberOfLines={1}>
                    + {a.name}{Number(a.price) > 0 ? ` (+$${fmtShort(a.price)})` : ""}
                  </Text>
                ))}
                {instr ? (
                  <Text style={[styles.detailChip, { fontStyle: "italic" }]} numberOfLines={1}>
                    Note: {instr}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        </View>
        <View style={styles.cartCardBottom}>
          <IncrementDecrementBton
            minValue={qty}
            onIncrease={() => handleAddToCart(index)}
            onDecrease={() => handleRemoveFromCart(index)}
          />
          <Text style={styles.cartItemLineTotal}>${lineTotal.toFixed(2)}</Text>
        </View>
      </Pressable>
    );
  };
  const subtotal = calculateSubtotal();
  const taxesAndFees = 0.3 * subtotal;
  const total = Math.max(0, subtotal + taxesAndFees - promoDiscount);

  return (
    <View style={styles.container}>
      <View style={[styles.navRow, { paddingTop: insets.top + 10 }]}>
        <View style={styles.navSide}>
          <Pressable
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home"))}
            style={styles.backOuter}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BlurView
              intensity={Platform.OS === "ios" ? 82 : 58}
              tint="light"
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              pointerEvents="none"
              colors={[
                "rgba(255, 255, 255, 0.78)",
                "rgba(252, 252, 251, 0.52)",
                "rgba(248, 249, 246, 0.44)",
              ]}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(255, 255, 255, 0.35)", "transparent"]}
              style={styles.backHighlight}
            />
            <View style={styles.backIconWrap} pointerEvents="none">
              <Ionicons name="chevron-back" size={18} color="#111827" />
            </View>
          </Pressable>
        </View>
        <View style={styles.navTitleCenter} pointerEvents="none">
          <Text style={styles.navTitleText} numberOfLines={1}>My Cart</Text>
        </View>
        <View style={styles.navSide} />
      </View>
      {cartItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Image style={styles.emptyImage} source={require('../assets/cartEmpty.png')} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyHint}>Add items to get started</Text>
          <Pressable onPress={() => navigation.navigate('HomeTabs')} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Search items</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            <CartPromotionSummary appliedLines={promoSummaryLines} />

            {cartItems.map((item, index) => (
              <View key={index.toString()}>
                {renderCartItem({ item, index })}
              </View>
            ))}

            <CouponEntrySection
              appliedCoupon={appliedCouponUi}
              onApply={handleApplyCoupon}
              isApplying={couponLoading}
              error={couponError}
            />

            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes & Fees</Text>
                <Text style={styles.summaryValue}>${taxesAndFees.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.08)" }]}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>
          </KeyboardAvoidingView>

          <View style={[styles.checkoutBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
            <View style={styles.checkoutTotalWrap}>
              <Text style={styles.checkoutTotalLabel}>Total</Text>
              <Text style={styles.checkoutTotalValue}>${total.toFixed(2)}</Text>
            </View>
            <Pressable onPress={pressHandler} style={styles.checkoutButton}>
              <Ionicons name="bag-check-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f2",
    paddingHorizontal: 10,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  navSide: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitleCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  navTitleText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#111827",
    letterSpacing: 0.2,
  },
  backOuter: {
    width: 35,
    height: 35,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 14,
  },
  backHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  backIconWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  emptyImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  emptyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: "rgba(66, 89, 40, 0.12)",
  },
  emptyBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#425928",
  },
  cartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cartCardTop: {
    flexDirection: "row",
    gap: 12,
  },
  cartItemImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#f3f1ed",
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cartItemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cartItemTitle: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
  cartItemComp: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#6b7280",
  },
  cartItemPrice: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  cartItemDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  detailChip: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#425928",
    backgroundColor: "rgba(66, 89, 40, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  cartCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  cartItemLineTotal: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#111827",
  },
  orderSummary: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#111827",
  },
  totalText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#111827",
  },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 14,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  checkoutTotalWrap: {
    gap: 2,
  },
  checkoutTotalLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#6b7280",
  },
  checkoutTotalValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#111827",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(188, 108, 37, 0.94)",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: "#BC6C25",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutButtonText: {
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
export default CartDisplay



// <ScrollView onTouchStart={()=>{ref2?.current?.scrollTo(0);ref?.current?.scrollTo(0); ref3?.current?.scrollTo(0); }} style={{marginBottom: '19%' , paddingTop: 20 }}>

// {cartItems.length == 0 && <View  style={[styles.recommendedView,{gap: 50, marginVertical: 45}]}><View><Image style={styles.image} source={require('../assets/cartEmpty.png')}/></View><Text style={{textAlign: 'center'}}>Your cart is currently empty, Check out people’s favorite items!</Text></View>}
// {cartItems.length > 0 && <><View style={{marginHorizontal: '10%', alignItems: 'center', justifyContent: 'flex-start', gap: 35}}>
//     {cartItems.map((item, idx)=>  <ProductAction onTap={()=>{ref2?.current?.scrollTo(-570); }} key={idx} title={item.products[0].title} price={calculateTotalPrice(item)} image={item.products[0].images[0]} quantity={item.products.length} action={<Pressable onPress={()=>handleDeleteFromCart()} style={({ pressed }) => pressed && { opacity: 0.5 }}><EvilIcons name="trash" size={45} color="#B22334" /></Pressable>}><IncrementDecrementBtn minValue={item.products.length} onIncrease={()=>{handleAddToCart()}} onDecrease ={()=>{handleRemoveFromCart()}}/></ProductAction>)}
// </View>
// <View  style={{paddingHorizontal: '5%', paddingVertical: '10%'}}>
//     <Text style={{
//                 color: "black",
//                 fontSize: 16,
//             }}>Have a coupon code?</Text>
//     <Input text={'Enter Coupon'} buttonText={'Apply code'}/>
// </View></>}
// <View style={{paddingHorizontal: '1%', paddingVertical: '10%'}}>
// <Deal text={"Best Grocery Deals!"} onPress={dealHandler} 
// onAdd={handleAddCart}
// item={[
// { title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', newPrice: 4.99, oldPrice: 1.99, image: require('../assets/snacks1.png'), reviews: [], category: 'snacks' },
// { title: 'Kit Kat Candy Bar King Size 3oz', newPrice: 3.69, oldPrice: 1.99, image: require('../assets/snacks3.png'), reviews: [], category: 'snacks' },
// { title: 'Tiger Eye Iced Coconut Latte 8.5oz', newPrice: 3.79, oldPrice: 1.99, image: require('../assets/drink4.png'), reviews: [], category: 'drink' },

// ]} color = '#039F03' />
// </View>
// </ScrollView>
// <BottomSheet ref={ref}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 590}}>
//   {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
//                         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//                     </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=>toggleNumberInArray(idx)}>
//                         <MaterialCommunityIcons name={`${selected.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${selected.length < 2 || selected.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
//                         </Pressable>
//                     </View>)}

//                 </View>}
//       {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',  borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, alignItems: 'center'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
//                         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//                         <View style ={{width: width/3.7, height: '170%'}}>
//                             <FlexButton onPress = {option >= 0 ? handleAdd : ()=>{}} background={option == undefined  ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
//                         </View>
//                     </View>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
//       {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=> {setOption(idx)}}>
//                         <Ionicons name={`${idx == option ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" />
//                         </Pressable>
//                     </View>)}</View>}
//       {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
//                         <View style ={{width: width/4.7, height: '170%'}}>
//                             <FlexButton onPress = {plus.length == 2 ? handleAdd : ()=>{}} background={plus.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 13}}>Add</Text></FlexButton>
//                         </View>
                        
//                     </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
//                             <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
//                         </View>
//                         {(plus.length < 2 || (plus.length && plus.indexOf(item[0]) !== -1)) && <View>
//                           <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setPlus((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setPlus((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
//                         </View>}
//                     </View>)}

//                 </View>}
//             {pro.instructions && <View 
// style ={{color: 'white', backgroundColor : 'rgba(0,0,0,0.05)'}}><TextInput
// multiline
// placeholder="Special Instructions?"
// cursorColor={'#aaa'}
// numberOfLines={6}
// clearButtonMode="always"
// style={{paddingHorizontal: 10}}
// /></View>
// }</View>
// </ScrollView>
// </BottomSheet>
// <BottomSheet ref={ref2}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 590, gap: 30}}>
//     {display.map(({Flavour, instruction, Sides, Picked, title,images, oldPrice}, idx)=><View key={idx}><ProductDescription onPress={()=>handleEdit(title, idx)} action={()=>{dispatch(deleteItem({id : {title: title, index: idx}}));  ref2?.current?.scrollTo(0)}} option={Picked} instruction={instruction} flavour={getFlavors(Flavour)} side={Sides} price={oldPrice} image={images[0]} title={title}/></View>)}
//     </View>
// </ScrollView>
// </BottomSheet>
// <BottomSheet ref={ref3}>
// <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
//   <View style={{ marginBottom: 590}}>
// {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
//                         {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
//                     </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=>{addOn1.length < 2 || addOn1.indexOf(idx) !== - 1 ? toggleNumberInArray1(idx): {}}}>
//                         <MaterialCommunityIcons name={`${addOn1.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${addOn1.length < 2 || addOn1.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
//                         </Pressable>
//                     </View>)}

//                 </View>}
//       {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center', marginTop: 15, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15,}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
//                         <View style ={{width: width/3.7, height: '170%'}}>
//                             <FlexButton onPress = {option1 ? handleUpdate : ()=>{}} background={option1 < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 15}}>Update</Text></FlexButton>
//                         </View>
//                     </View>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
//                     {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
//                         </View>
//                         <Pressable onPress={()=> {setOption1(pro.options[idx])}}>
//                         <Ionicons name={`${pro.options[idx] == option1 ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" />
//                         </Pressable>
//                     </View>)}</View>}
//       {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
//                         <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
//                         <View style ={{width: width/3.7, height: '170%'}}>
//                             <FlexButton onPress = {plus1.length == 2 ? handleUpdate : ()=>{}} background={plus1.length < 2 ? "rgba(0,0,0,0.5)" :  '#283618'}><Text style={{color: 'white', fontWeight: 900,fontSize: 15}}>Update</Text></FlexButton>
//                         </View>
//                         </View>
//                     <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
//                     <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)', width : width/5, alignItems : 'center'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                    
//                     {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
//                         <View>
//                             <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
//                             <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
//                         </View>
//                         {(plus1.length < 2 || (plus1.length && plus1.indexOf(item[0]) !== -1)) && <View>
//                           <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus1.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setSides((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus1.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setSides((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
//                         </View>}
//                     </View>)}

//                 </View>}
//             {pro.instructions && <View 
// style ={{color: 'white', backgroundColor : 'rgba(0,0,0,0.05)'}}><TextInput
// multiline
// placeholder="Special Instructions?"
// cursorColor={'#aaa'}
// numberOfLines={6}
// clearButtonMode="always"
// style={{paddingHorizontal: 10}}
// /></View>
// }</View>
// </ScrollView>
// </BottomSheet>
// <View style={{flex: 1, width: "100%", paddingVertical: '7%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' , flexDirection: 'row', justifyContent: "space-around", alignItems: 'center'}}>
//     <View style={{height: '150%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
//         <Text
//         style={{
//             color: "#aaa",
//             // fontWeight: "bold",
//             fontSize: 20,
//         }}
//         > Total Payment</Text>
//         <Text
//             style={{
//                 color: "black",
//                 fontWeight: "600",
//                 fontSize: 20,

//             }}
//             > 
//             $65
//             {/* {`$${getTotalSum().toFixed(2)}`} */}
//             </Text>
//     </View>
//     <View style ={{width: '40%', height: '130%'}}>
//         <FlexButton onPress = {pressHandler} background={cartItems.length == 0 ? "rgba(0,0,0,0.5)" :  '#283618'}><FontAwesome name="shopping-bag" size={width/13} color="white" /><Text style={{color: 'white'}}>Checkout</Text></FlexButton>
//     </View>
// </View>
