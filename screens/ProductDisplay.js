import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  RefreshControl,
  TextInput,
  Animated
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Pill from "../components/Pills/Pills";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import Deal from "../components/Category/Deal";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, deleteFromCart } from "../Data/cart";
import CartModal from "../components/Cart/CartModal";
import CarouselCards from "../components/CarouselCards";
import OrderSuccess from "../components/Modals/OrderSuccess";
import ProductPreview from "../components/Product/ProductPreview";
import FancyTextInput from "../components/Inputs/FancyTextInput";
import ErrorMessage from "../components/ErrorMessage";
import CartButton from "../components/Buttons/CartButton";
import IncrementDecrementBton from "../components/Buttons/IncrementDecrementBtn copy";

function ProductDisplay() {
  const route = useRoute();
  const title = route.params.title;
  const [animatedValue] = useState(new Animated.Value(0));
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [option, setOption] = useState();
  const { width, height } = Dimensions.get("window");
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);
  const [plus, setPlus] = useState([]);
  console.log(route.params)
  const timer = useRef();
  let background = '#aaa'
  if((plus.length >= 2 ) || (option >= 0 && plus.length == 0)){
    background = "#283618";
}else if(!route.params.extras && !route.params.options){ background = '#283618'}
  const image = route.params.image;
  const [index, setIndex] = useState(0);
  console.log(index)
  const [selected, setSelected] = useState([]);
  const [display, setDisplay] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems.ids);
  const productItems = useSelector((state) => state.productItems.ids);
  const categoryObject = {};
  function findPrice(foodName) {
    for (let i = 0; i < route.params.extras.length; i++) {
      if (route.params.extras[i][0] === foodName) {
        return route.params.extras[i][1];
      }
    }
    return "Item not found in the menu";
  }
  const getAverageRatingByTitle = (title) => {
    const item = productItems.find((item) => item.title === title);

    if (item && item.reviews.length > 0) {
      const totalRating = item.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / item.reviews.length;
      return averageRating;
    } else {
      return 0; // Indicate that there are no reviews or the item is not found
    }
  };
  // useEffect(() => {
  //   if (plus.length == 2) {
  //     handleAddToCart(route.params);
  //     setPlus([]);
  //     setFoodDictionary(foodStore);
  //   }
  // }, [plus]);
  productItems.forEach((item) => {
    const category = item.category;

    if (!categoryObject[category]) {
      // If the category key doesn't exist, create it with an array containing the current item
      categoryObject[category] = [item];
    } else {
      // If the category key already exists, push the current item to the existing array
      categoryObject[category].push(item);
    }
  });
  function handleAddToCart() {
    let price = 0;
    let newItem ={}
    if (plus && plus.length > 0){
    for (var i = 0; i < plus.length; i ++){
        price += findPrice(plus[i])
      }
      newItem = {...newItem, ...{ 'Sides' : plus}}
    }
    if (option != undefined){
      newItem = {...newItem, ... {'Picked' : route.params.options[option]}}
    }
    if (selected && selected.length > 0){
      newItem = {...newItem, ... {'Flavour' : selected}}
    }
    setPlus([])
    setOption()
    setSelected([])
    
    setFoodDictionary(foodStore)
    dispatch(addToCart({id : {title: route.params.title, ...{...route.params, ...newItem, ['oldPrice'] : route.params.oldPrice + price} }}))

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }),
    ]).start();
  
    // if (option >= 0 && route.params.options) {
    //   dispatch(addToCart({ id: product }));
    //   setVisible(true);
    //   setOption();
    // } else if (!route.params.options) {
    //   dispatch(addToCart({ id: product }));
    //   setVisible(true);
    // }
  }
  function handleRemoveFromCart(product){
    dispatch(removeFromCart({id : product}))
  }
const [errorVisible, setErrorVisible] = useState(false);

const showError = () => {
  setErrorVisible(true);
  setTimeout(() => {
    setErrorVisible(false);
  }, 3000); // Hide the error message after 3 seconds
};


const interpolateRotation = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

const animatedStyle = {
  transform: [
    {
      rotateX: interpolateRotation,
    },
    {
      rotateY: interpolateRotation
    }
  ],
};
function cartHandler() {
  navigation.navigate("Cart");
}

// useEffect(() => {
//   let timer;
//   if (modalVisible) {
//     timer = setTimeout(() => {
//       setModalVisible(false);
//     }, 1000); // Hide the modal after 3 seconds
//   }
//   return () => clearTimeout(timer); // Clear the timeout if the component unmounts or the modal is closed manually
// }, [modalVisible]);
const cost = {}
function addQuantityToObjects(inputList) {
    const titleCountMap = {};

    const result = {};
  inputList.forEach(obj => {
      const title = Object.keys(obj)[0];
      const arrayLength = obj[title].length;
      result[title] = arrayLength;
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
          totalPrice += item.oldPrice;
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

    return result;
}
function createFoodDictionary(foodArray) {
    let foodDictionary = {};
    for (let i = 0; i < foodArray.length; i++) {
      foodDictionary[foodArray[i][0]] = 0;
    }
    return foodDictionary;
  }

  // Example usage:
  let foodStore = {};
  if (route.params.extras) {
    foodStore = createFoodDictionary(route.params.extras);
  }

  function toggleNumberInArray(number) {
    setSelected((prev) => {
      const array = [...prev];
      const index = array.indexOf(number);
      if (index === -1) {
        // Number is not in the array, so add it
        array.push(number);
      } else {
        // Number is already in the array, so remove it
        array.splice(index, 1);
      }
      return array;
    });
  }
  const [foodDictionary, setFoodDictionary] = useState(foodStore);
  
  const newList = addQuantityToObjects(cartItems);
  console.log(newList);
  var quantity = 0;
  if (newList) {
    quantity = newList[route.params.title];
  }
  useEffect(() => {
    const timer = setTimeout(() => setRefresh(false), 1000);
  }, [refresh]);
  const navigation = useNavigation();
  function pressHandler() {
    navigation.navigate("Review", { reviews: route.params.reviews });
  }
  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setRefresh(true);
            }}
            refreshing={refresh}
          />
        }
      >
        <View style={{ marginBottom: 120 }}>
          <View style={{ backgroundColor: "#FAFAFA", paddingTop: 0 }}>
            <CarouselCards
              data={[
                { image: image },
                { image: image },
                { image: image },
                { image: image },
                { image: image },
                { image: image },
              ]}
              index={index}
              handleIndex={setIndex}
              onView={() => setDisplay(true)}
            />
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                padding: 0.5,
                paddingHorizontal: 6,
                borderRadius: 30,
                zIndex: 1,
                position: "absolute",
                top: 20,
                right: "15%",
              }}
            >
             
            </View>
          </View>
          <View style={{ paddingHorizontal: "5%", marginVertical: "4%" }}>
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "900",
                  fontSize: 22,
                }}
              >
                {title}{" "}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 0.5,
                borderBottomColor: "#aaa",
                paddingBottom: "3%",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "900",
                  fontSize: 24,
                }}
              >
                {`$${route.params.oldPrice}`}
              </Text>
              <View>
                <Pill text="9289 Sold" type="null" />
              </View>
            </View>
            <View style={{ gap: 15, marginVertical: 30 }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Quantity
              </Text>
              <View style={{ height: "auto", width: "25%" }}>
                <IncrementDecrementBton
                  minValue={quantity}
                  onIncrease ={() => {
                    if ((plus.length >= 2 ) || (option >= 0 && plus.length == 0)){
                      handleAddToCart();
                  }else if(!route.params.extras && !route.params.options){handleAddToCart();}else{
                    showError()
                  }
                }}
                  onDecrease={() => handleRemoveFromCart(route.params)}
                />
              </View>
              <View style={{ paddingVertical: 15, gap: 10 }}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Description
                </Text>
                <Text
                  onTextLayout={onTextLayout}
                  numberOfLines={textShown ? undefined : 4}
                  style={{ lineHeight: 31, color: "#aaa", fontSize: 15 }}
                >
                  {route.params.description ??
                    `Rainbow NERDS surround fruity, gummy centers. Those sweet little sparks are fantastic inventors. A poppable cluster, packed with tangy, crunchy NERDS. A candy so tasty, there aren’t even words.
              NUTRITIONAL INFO`}
                </Text>

                {lengthMore && (
                  <Text
                    onPress={toggleNumberOfLines}
                    style={{
                      lineHeight: 21,
                      marginVertical: 10,
                      textAlign: "right",
                      color: "#BC6C25",
                    }}
                  >
                    {textShown ? "Read less..." : "Read more..."}
                  </Text>
                )}
                {route.params.addOn && (
                  <View style={{ gap: 25, paddingTop: 30, marginBottom: 50 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: 19,
                        }}
                      >
                        {"Choose Exotic Flavor"}
                      </Text>
                      {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                    </View>
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >{`Choose up to ${2}`}</Text>
                    {route.params.extras.map((item, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderBottomWidth: 1,
                          borderColor: "rgba(0,0,0,0.05)",
                          paddingBottom: 15,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "black",
                              fontWeight: "900",
                              fontSize: 16,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                        <Pressable onPress={() => {selected.length < 2 || selected.indexOf(idx) !== - 1 ? toggleNumberInArray(idx): {}}}>
                          <MaterialCommunityIcons
                            name={`${
                              selected.indexOf(idx) === -1
                                ? "checkbox-blank-outline"
                                : "checkbox-marked"
                            }`}
                            size={24}
                            color={`${
                              selected.length < 2 ||
                              selected.indexOf(idx) !== -1
                                ? "black"
                                : "rgba(0,0,0,0.05)"
                            }`}
                          />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
                {route.params.options && (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderBottomWidth: 1,
                        borderColor: "rgba(0,0,0,0.05)",
                        paddingBottom: 15,
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "900",
                          fontSize: 19,
                        }}
                      >
                        {"Choose One"}
                      </Text>
                      {/* <View style={{padding: 6, borderRadius: 15, backgroundColor:'rgba(0,0,0,0.1)'}}><Text  style={{color: "black",fontWeight: "bold",fontSize: 13,}}>Required</Text></View> */}
                    </View>
                    {route.params.options.map((item, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderBottomWidth: 1,
                          borderColor: "rgba(0,0,0,0.05)",
                          paddingVertical: 13,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "black",
                              fontWeight: "900",
                              fontSize: 16,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                        <Pressable onPress={() => setOption(idx)}>
                          <Ionicons
                            name={`${
                              idx == option
                                ? "radio-button-on"
                                : "radio-button-off"
                            }`}
                            size={24}
                            color="black"
                          />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
                {route.params.nutrient &&
                  route.params.nutrient == "protein" && (
                    <View style={{ gap: 25, paddingTop: 30 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "900",
                            fontSize: 19,
                          }}
                        >
                          {"Pick Your Sides"}
                        </Text>
                        <View
                          style={{
                            padding: 6,
                            borderRadius: 15,
                            backgroundColor: "rgba(0,0,0,0.1)",
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            Required
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: 13,
                        }}
                      >{`Choose ${2}`}</Text>
                      {route.params.extras.map((item, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: "rgba(0,0,0,0.05)",
                            paddingBottom: 15,
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                color: "black",
                                fontWeight: "900",
                                fontSize: 16,
                              }}
                            >
                              {item[0]}
                            </Text>
                            <Text>{item[1] ? `+ $${item[1]}` : ""}</Text>
                          </View>
                          <View>
                          {(plus.length < 2 || (plus.length && plus.indexOf(item[0]) !== -1)) && <View>
                                  <IncrementDecrementBtn minValue={foodDictionary[item[0]]} onIncrease={()=>{if (plus.length < 2){setFoodDictionary((prev)=>{return {...prev, [item[0]] : foodDictionary[item[0]]+1}});setPlus((prev)=> {const arr = [...prev]; arr.push(item[0]); return arr})}}}  onDecrease={()=>{if (plus.length > 0){setFoodDictionary((prev)=>{return {...prev, [item[0]] : (foodDictionary[item[0]] ?foodDictionary[item[0]] : 1) -1}});setPlus((prev)=>{const arr = [...prev]; const index = prev.indexOf(item[0]); if (index != -1){arr.splice(index, 1)}; return arr}) }}}/>
                                </View>}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                {route.params.instructions && (
                    <FancyTextInput />
                )}
              </View>
              {/* <View style={styles.catHead}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Shop Related Products
                </Text>
                <ProductCategory
                  items={categoryObject[route.params.category]
                    .slice(0, 7)
                    .filter((item) => item.title !== route.params.title)}
                  onPress={handleAddToCart}
                />
              </View> */}
              <View style={styles.catHead}>
                {/* <Deal text={'Shop Related Products'}/> */}
              </View>
            </View>
            <View></View>
          </View>
        </View>
      </ScrollView>
      <ErrorMessage visible={errorVisible} message="Please choose an option!" />
      <View style={styles.animatedItem}>
      <Animated.View style={[ animatedStyle]} >
      <CartButton onPress={cartHandler} itemCount={quantity}/>
      </Animated.View>
      <View style={{width: '100%', height: 3, backgroundColor: 'black', marginTop:10, borderRadius: 4}}></View>
    </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          minHeight: "60%",
          flexWrap: "wrap",
          paddingVertical: "7%",
          position: "absolute",
          bottom: 0,
          zIndex: 1,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              color: "#aaa",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {" "}
            Total Payment
          </Text>
          <Text
            style={{
              color: "black",
              fontWeight: "600",
              fontSize: 20,
            }}
          >
            {" "}
            {`$${
              !quantity ? 0 : cost[route.params.title]
            }`}
          </Text>
        </View>
        <View style={{ width: "40%", height: 70 }}>
          <FlexButton
            onPress={() => {
              if ((plus.length >= 2 ) || (option >= 0 && plus.length == 0)){
                handleAddToCart();
            }else if(!route.params.extras && !route.params.options){handleAddToCart();}else{
              showError()
            }}}
            background={background} 
          >
            <FontAwesome name="shopping-bag" size={24} color="white" />
            <Text style={{ color: "white" }}>Add to cart</Text>
          </FlexButton>
        </View>
      </View>
      {/* {visible && <View style ={{
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    zIndex: 3, position: "absolute",bottom : 0,
    width: width -20,
    alignItems: 'center',opacity: 1, backgroundColor: 'rgba(0,0,0,0)'}}>
        <View style ={{
    backgroundColor: 'white',
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
      {display && (
        <Pressable
          // onTouchStart={() => setDisplay(false)}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            justifyContent: "center",
            zIndex: 3,
            position: "absolute",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
        >
          <Pressable
            onPress={() => setDisplay(false)}
            style={{ position: "absolute", top: 5, left: 5, zIndex: 100 }}
          >
            <AntDesign name="closecircle" size={34} color="white" />
          </Pressable>
          <ProductPreview
            data={[
              { image: image },
              { image: image },
              { image: image },
              { image: image },
              { image: image },
              { image: image },
            ]}
            index={index}
            handleIndex={setIndex}
          />
        </Pressable>
      )}
    </View>
  );
}
export default ProductDisplay;

const styles = StyleSheet.create({
  catHead: {
    justifyContent: "space-between",
    gap: 19,
  },
  animatedItem: {
    position: 'absolute',
    borderRadius: 10,
    top: 20, // Adjust as needed
    right: 20, // Adjust as needed
  },
});
