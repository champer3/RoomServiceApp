import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Dimensions,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import Text from '../../components/Text';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ProductCategory from "../../components/Category/ProductCategory";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SERVER_URL } from "../../config";
import { useRoute, useNavigation } from "@react-navigation/native";
import {addToCart, removeFromCart} from '../../Data/cart'
import {useSelector, useDispatch} from 'react-redux'
import BottomSheet from '../../components/Modals/BottomSheet';
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import IncrementDecrementBtn from "../../components/Buttons/IncrementDecrementBtn";
import { useEffect, useState, useRef, useMemo } from "react";
import { fetchAppCategory } from "../../api/appPromotions";
import CategoryHeaderPromotion from "../../components/promotions/CategoryHeaderPromotion";
import ProductInlinePromotion from "../../components/promotions/ProductInlinePromotion";
import { productDepartmentSlug, guessCategorySlug } from "../../utils/departmentProducts";
const { height } = Dimensions.get("window");
const HERO_HEIGHT = Math.min(Math.round(height * 0.38), 130);
const CAT_SEARCH_RADIUS = 15;
const PLACEHOLDER_BG = require("../../assets/categoryPic.png");

function mediaUri(url) {
 return url
}
// function guessCategorySlug(name) {
//   return String(name || "")
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");
// }

function itemCategoryMatchesName(item, categoryName) {
  const n = String(categoryName || "").toLowerCase().trim();
  if (!n) return true;
  const c = item.category;
  if (typeof c === "string") return c.toLowerCase() === n;
  if (c && typeof c === "object") {
    if (c.name && String(c.name).toLowerCase() === n) return true;
    const slug = c.slug != null ? String(c.slug).toLowerCase().trim() : "";
    if (slug && slug === guessCategorySlug(n)) return true;
  }
  return false;
}

function CategorySearch() {
  const route = useRoute()
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false)
  const name = route.params?.cat ?? "";
  const departmentSlug =
    route.params?.departmentSlug != null ? String(route.params.departmentSlug).toLowerCase().trim() : "";
  const departmentName = route.params?.departmentName ?? "";
  const routeCategorySlug =
    route.params?.categorySlug != null ? String(route.params.categorySlug).toLowerCase().trim() : "";
  const routeImageUrl = route.params?.imageUrl;
  const routeIconUrl = route.params?.iconUrl;
  const [categoryData, setCategoryData] = useState(null);

  const categorySlugForApi = useMemo(() => {
    if (routeCategorySlug) return routeCategorySlug;
    return guessCategorySlug(name);
  }, [routeCategorySlug, name]);

  useEffect(() => {
    if (!categorySlugForApi) {
      setCategoryData(null);
      return undefined;
    }
    let cancelled = false;
    fetchAppCategory(categorySlugForApi, { departmentSlug: departmentSlug || undefined })
      .then((d) => {
        if (!cancelled) setCategoryData(d ?? null);
      })
      .catch(() => {
        if (!cancelled) setCategoryData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlugForApi, departmentSlug]);

  const categoryAppPromos = categoryData?.promotions ?? null;
  const categoryMeta = categoryData?.category;
  const heroImageUri = useMemo(() => {
    const fromRoute = mediaUri(routeImageUrl || routeIconUrl);
    if (fromRoute) return fromRoute;
    return mediaUri(categoryMeta?.imageUrl || categoryMeta?.iconUrl);
  }, [
    routeImageUrl,
    routeIconUrl,
    categoryMeta?.imageUrl,
    categoryMeta?.iconUrl,
  ]);

  const headerTitle = useMemo(() => {
    const fromApi = String(categoryMeta?.name || "").trim();
    if (fromApi) return fromApi;
    const fromRoute = String(name || "").trim();
    if (fromRoute) return fromRoute;
    const dept = String(departmentName || "").trim();
    if (dept) return dept;
    return "Search";
  }, [categoryMeta?.name, name, departmentName]);
  const [restrictions, setRestrictions] = useState([])
  const dispatch = useDispatch();
  const [chosen, setChosen] = useState([])
  const cartItems = useSelector((state) => state.cartItems.ids)
  const productItems = useSelector((state) => state.productItems.ids)
  const scopedProductItems = useMemo(() => {
    if (!departmentSlug) return productItems;
    return productItems.filter((p) => productDepartmentSlug(p) === departmentSlug);
  }, [productItems, departmentSlug]);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const res = {'Meal Type': ["Breakfast", "Brunch", "Lunch", "Dinner",  "Appetizer", "Dessert",], 'Cooking Method': ["Grilled", "Baked", "Fried", "Steamed", "Roasted", "Sauteed", "Boiled", "Stir-Fried", "Smoked", "Slow-Cooked",], 'Ingredients': [ "Chicken", "Beef", "Fish", "Shrimp", "Rice", "Pasta", "Vegetables", "Fruits", "Cheese",], 'Nutrients': ['Protein']}
  const [filter, setFilter] = useState({'Meal Type': false,'Cooking Method': false, 'Ingredients': false, 'Nutrients': false })
  function toggleValueInObject(value) {
    setFilter((prev)=>{
      const obj = {...prev}
    if (!(value in obj)) {
        obj[value] = true; // Add the value to the object and set its value to false
    } else {
        obj[value] = !obj[value]; // Toggle its value
    }return obj})
}
  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, 1500);
  }, [visible])
function createFoodDictionary(foodArray) {
  let foodDictionary = {};
  for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
  }
  return foodDictionary;
}
const [option, setOption] = useState()
// Example usage:
let [foodStore, setFood] = useState({})
const [foodDictionary, setFoodDictionary] = useState(foodStore);
  const [pro , setPro] = useState({})

const [extra, setExtra] = useState()
const [plus, setPlus] = useState([])
function findPrice(foodName) {
  for (let i = 0; i < extra.length; i++) {
    if (extra[i][0] === foodName) {
      return extra[i][1];
    }
  }
  return "Item not found in the menu";
}
useEffect(()=>{
  if (plus.length == 2){
    
    dispatch(addToCart({ id: pro }))
      for (var i = 0; i < plus.length; i ++){
        dispatch(addToCart({ id: {'title': plus[i], 'oldPrice': findPrice(plus[i]), quantity: 1} }))
      }
      setPlus([])
      ref2?.current?.scrollTo(0)
      setFoodDictionary(foodStore)
  }
},[plus])
function handleAddToCart(product) {
  setPro(product)
  if (product.extras){
    setExtra(product.extras)
    setFoodDictionary(createFoodDictionary(product.extras))

}
if (product.extras || product.options ){
  ref?.current?.scrollTo(0)
  ref2?.current?.scrollTo(-570);}else{
  dispatch(addToCart({ id: product }));}
}
const [selected, setSelected] = useState({})
function toggleNumberInArray(val,number) {
  setRestrictions((prev)=>{
    const array = [...prev]
    const index = array.indexOf(res[val][number])
    if (index === -1) {
      // Number is not in the array, so add it
      array.push(res[val][number]);
  } else {
      // Number is already in the array, so remove it
      array.splice(index, 1);
  }
  return array
  })
  
  setSelected((prev)=> {
      const array = {...prev}
      if (!(val in array )){
        array[val] = []
      }
      const index = array[val].indexOf(number);
  if (index === -1) {
      // Number is not in the array, so add it
      array[val].push(number);
  } else {
      // Number is already in the array, so remove it
      array[val].splice(index, 1);
  }
  return array
  })
}
useEffect(()=>{setFilteredItems(filterItems(restrictions))}, [restrictions, scopedProductItems, name])
function toggleNumberInArray2(number) {
  setChosen((prev)=> {
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
  // Sample array of items


// Function to filter items based on the provided filtering options
function filterItems(filteringOptions) {
  if (filteringOptions.length === 0) {
    return scopedProductItems.filter(
      (item) =>
        itemCategoryMatchesName(item, name) ||
        (Array.isArray(item.subCategory) && item.subCategory.some((s) => String(s).toLowerCase() === String(name).toLowerCase()))
    );
  }
  return scopedProductItems.filter(item => {
    // Check if the item's related array includes any of the filtering options
    const hasFilteringOption = item.related ?  filteringOptions.some(option =>
      item.related.includes(option.toLowerCase())
    ): false;
    
    const isname = itemCategoryMatchesName(item, name);
    
    // You can add additional conditions based on nutrients or any other criteria here
    
    // Return true if the item should be kept, false otherwise
    return hasFilteringOption && isname;
  });
}
const [value, setValue] = useState("");
// Example usage:
const [filteredItems, setFilteredItems] = useState(filterItems(restrictions));
function searchTitles(items, searchPhrase) {
  const result = [];
  if (searchPhrase.length < 1){
    return items
  }
  // Iterate through each item in the array
  items.forEach((item) => {
    // Check if the title or related keywords contain the search phrase
    if (item.title.toLowerCase().includes(searchPhrase.toLowerCase())) {
      // If found, push the title into the result array
      result.push(item);
    }
     else if (item.related) {
      // If the item has related keywords, check each related keyword
      item.related.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
     else if (item.subCategory) {
      // If the item has related keywords, check each related keyword
      item.subCategory.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
     else if (item.nutrients) {
      // If the item has related keywords, check each related keyword
      item.nutrients.forEach((keyword) => {
        if (keyword.name.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
     else if (item.components) {
      // If the item has related keywords, check each related keyword
      item.components.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchPhrase.toLowerCase())) {
          // If found, push the title into the result array
          result.push(item);
        }
      });
    }
  });

  return result;
}
const result = searchTitles(filteredItems, value);

  const openFilterSheet = () => {
    ref?.current?.scrollTo(-570);
    ref2?.current?.scrollTo(0);
  };

  const dismissSheets = () => {
    ref?.current?.scrollTo(0);
    ref2?.current?.scrollTo(0);
  };

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>

        <View style={[styles.heroWrap, { height: HERO_HEIGHT }]}>
          <Image
            source={heroImageUri ? { uri: heroImageUri } : PLACEHOLDER_BG}
            style={styles.heroImageFill}
            resizeMode="cover"
          />
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.45)"]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[styles.heroNavRow, { paddingTop: insets.top + 10 }]}>
            <View style={styles.heroNavSide}>
              <Pressable
                onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home"))}
                style={styles.deptBackOuter}
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
                  style={styles.deptBackHighlight}
                />
                <View style={styles.deptBackIconWrap} pointerEvents="none">
                  <Ionicons name="chevron-back" size={18} color="#111827" />
                </View>
              </Pressable>
            </View>
            <View style={styles.heroTitleCenter} pointerEvents="none">
              <Text style={styles.heroTitleText} numberOfLines={1}>
                {headerTitle}
              </Text>
            </View>
            <View style={styles.heroNavSide} />
          </View>
        </View>

        <View style={[styles.searchOverlap, { marginTop: 16 }]}>
          <View style={styles.glassBackdrop}>
            <View style={styles.glassOuter}>
              <BlurView
                intensity={Platform.OS === "ios" ? 40 : 32}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.glassWash} pointerEvents="none" />
              <LinearGradient
                pointerEvents="none"
                colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                style={styles.glassShine}
              />
              <LinearGradient
                pointerEvents="none"
                colors={["transparent", "rgba(17, 24, 39, 0.04)"]}
                style={styles.glassFloor}
              />
              <View style={styles.glassRow}>
                <View style={styles.glassSearchHit}>
                  <Feather name="search" size={18} color="#111827" style={styles.glassSearchIcon} />
                  <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder="Search this category"
                    placeholderTextColor="rgba(107,114,128,0.82)"
                    style={styles.glassTextInput}
                    cursorColor="#425928"
                    returnKeyType="search"
                    onFocus={dismissSheets}
                  />
                </View>
                <Pressable
                  onPress={openFilterSheet}
                  style={styles.glassFilterSegment}
                  accessibilityRole="button"
                  accessibilityLabel={`Filters, ${restrictions.length} active`}
                >
                  <Ionicons name="options-outline" size={20} color="#425928" />
                  {restrictions.length > 0 ? (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>
                        {restrictions.length > 9 ? "9+" : String(restrictions.length)}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.body, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {categoryAppPromos?.topBanner?.length ? (
          <View style={styles.promoBlock}>
            {categoryAppPromos.topBanner.map((p) => (
              <CategoryHeaderPromotion
                key={p.id}
                promotion={p}
                navigation={navigation}
                products={productItems}
              />
            ))}
          </View>
        ) : null}
        {categoryAppPromos?.inline?.length ? (
          <View style={styles.promoBlockInline}>
            {categoryAppPromos.inline.map((p) => (
              <ProductInlinePromotion
                key={p.id}
                promotion={p}
                navigation={navigation}
                products={productItems}
              />
            ))}
          </View>
        ) : null}
        {result.length > 0 ? (
          <ProductCategory onTouch={dismissSheets} items={result} onPress={handleAddToCart} />
        ) : (
          <View style={styles.emptyWrap}>
            <View>
              <Image style={styles.image} source={require('../../assets/empty.png')} />
            </View>
            <Text style={styles.emptyText}>We don’t have this item yet 😥😥.</Text>
          </View>
        )}
        </View>
        {/* {visible && <View style ={{
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
        </View>} */}
               {/* <View>
        <Product />
        <Product />
        </View> */}

      <BottomSheet ref={ref}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 ,}} >
          <View style={{ paddingBottom: 250}}>
            {Object.keys(filter).map((item, idx)=><View style ={{ marginBottom: 19}} key={idx}><View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{item}</Text>
                                <Pressable onPress={()=>toggleValueInObject(item)} style={{padding: 6, borderRadius: 15, backgroundColor:`${!(filter[item]) ?'white' :  'rgba(0,0,0,0.1)'}`}}><MaterialIcons name="arrow-drop-down" size={24} color="black" /></Pressable>
                            </View>
                            {filter[item] && res[item].map((name, idx)=><View key={idx} style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 15, paddingRight: 7}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{name}</Text>
                                </View>
                                <Pressable onPress={()=>toggleNumberInArray(item,idx)}>
                                <MaterialCommunityIcons name={`${!selected[item] || selected[item].indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color='black' />
                                </Pressable>
                            </View>)}</View>)}
               </View>
          </ScrollView>
        
            
        </BottomSheet>
        <BottomSheet ref={ref2}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', gap: 20 }} >
          <View style={{ marginBottom: 230}}>
        {pro.addOn && <View style={{gap: 25, paddingTop: 30, marginBottom: 50}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose Exotic Flavor'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                            </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose up to ${2}`}</Text>
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=>{chosen.length < 2 || chosen.indexOf(idx) !== - 1 ? toggleNumberInArray2(idx): {}}}>
                                <MaterialCommunityIcons name={`${chosen.indexOf(idx) === - 1 ? "checkbox-blank-outline" : "checkbox-marked"  }`} size={24} color={`${chosen.length < 2 || chosen.indexOf(idx) !== - 1 ?  'black': 'rgba(0,0,0,0.05)' }`} />
                                </Pressable>
                            </View>)}

                        </View>}
              {pro.options &&<View><View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15,}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Choose One'}</Text>
                                {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                            </View>
              {pro.options.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingVertical: 13,}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item}</Text>
                                </View>
                                <Pressable onPress={()=> { dispatch(addToCart({ id: pro }));ref2?.current?.scrollTo(0); setChosen([])}}>
                                <Ionicons name={`${idx == option ? "md-radio-button-on" : "md-radio-button-off"  }`} size={24} color="black" />
                                </Pressable>
                            </View>)}</View>}
              {pro.nutrient && pro.nutrient == 'protein' && <View style={{gap: 25, paddingTop: 30}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: "black",fontWeight: "900",fontSize: 19,}}>{'Pick Your Sides'}</Text>
                                <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View>
                            </View>
                            <Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>{`Choose ${2}`}</Text>
                            {pro.extras.map((item, idx)=><View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth : 1, borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 15}}>
                                <View>
                                    <Text  style={{color: "black",fontWeight: "900",fontSize: 16,}}>{item[0]}</Text>
                                    <Text>{item[1] ? `+ $${item[1]}` : ''}</Text>
                                </View>
                                <View>
                                <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setPlus((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}  onDecrease={()=>{setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}}); setPlus((prev)=>{const arr = [...prev]; arr.splice(prev.indexOf(item[0]), 1); return arr})}}/>
                                </View>
                            </View>)}

                        </View>}
                    {pro.instructions && <View 
        style ={{color: 'white', backgroundColor : 'white'}}><TextInput
        multiline
        placeholder="Special Instructions?"
        cursorColor={'#aaa'}
        numberOfLines={6}
        clearButtonMode="always"
        style={{paddingHorizontal: 10}}
      /></View>
      }</View>
        </ScrollView>
        </BottomSheet>


      </GestureHandlerRootView>
  );
}

export default CategorySearch;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: "#f8f6f2",
  },
  heroWrap: {
    width: "100%",
    backgroundColor: "#2f3b28",
    overflow: "hidden",
  },
  heroImageFill: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroNavRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    zIndex: 2,
  },
  heroNavSide: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitleCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  heroTitleText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  /** Same glass back pill as DepartmentScreen */
  deptBackOuter: {
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
  deptBackHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  deptBackIconWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  searchOverlap: {
    paddingHorizontal: 14,
    zIndex: 12,
  },
  glassBackdrop: {
    width: "100%",
  },
  glassOuter: {
    width: "100%",
    borderRadius: CAT_SEARCH_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  glassWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(254, 252, 248, 0.36)",
  },
  glassShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: CAT_SEARCH_RADIUS,
    borderTopRightRadius: CAT_SEARCH_RADIUS,
  },
  glassFloor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    borderBottomLeftRadius: CAT_SEARCH_RADIUS,
    borderBottomRightRadius: CAT_SEARCH_RADIUS,
  },
  glassRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 4,
    minHeight: 50,
  },
  glassSearchHit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    paddingRight: 8,
  },
  glassSearchIcon: {
    marginLeft: 2,
  },
  glassTextInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#111827",
    minWidth: 0,
    minHeight: 48,
    paddingVertical: Platform.OS === "ios" ? 14 : 0,
    ...Platform.select({
      android: { textAlignVertical: "center" },
    }),
  },
  glassFilterSegment: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(17, 24, 39, 0.12)",
    paddingLeft: 12,
    paddingRight: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#BC6C25",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Poppins-Bold",
  },
  body: {
    flex: 1,
    marginTop: 12,
    paddingTop: 4,
    paddingHorizontal: 10,
  },
  promoBlock: {
    marginBottom: 8,
  },
  promoBlockInline: {
    marginBottom: 8,
  },
  emptyWrap: {
    gap: 19,
    marginBottom: 45,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#4b5563",
  },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },
});
