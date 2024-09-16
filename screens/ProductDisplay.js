import {
  Image,
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  RefreshControl,
  TextInput,
  ImageBackground,
  Animated, TouchableOpacity,FlatList
} from "react-native";
import Text from '../components/Text';
import { useState, useEffect, useRef, useCallback } from "react";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, deleteFromCart } from "../Data/cart";
import IncrementDecrementBton from "../components/Buttons/IncrementDecrementBtn copy";
import { LinearGradient } from "expo-linear-gradient";
const {width:screenWidth, height} = Dimensions.get('window');
function ProductDisplay() {
  const route = useRoute();
  const {product, productData} = route.params
  const [formObject, setFormObject] = useState({...productData})
  const dummyData = {
    id: 1,
    title: "Classic Cheese Burger",
    image: "https://example.com/cheese-burger.jpg", // Replace with your own image URL
    description: "Juicy beef patty topped with melted cheese, fresh lettuce, tomato, pickles, and our special sauce, all nestled in a toasted bun.",
    price: 15.50,
    rating: 4.8,
    time: 12, // in minutes
    calories: 145, // in kcal
    extras: [
      {
        name: "More Ham",
        price: 4.50,
      },
      {
        name: "Spicy",
        price: 0.50,
      },
      {
        name: "Add Egg",
        price: 2.00,
      },
    ],
    options: [{'name': 'Flavors', 'value': [
      {
        name: 'Barbeque',
        price: 0
      },
      {
        name: 'Lemon Hot',
        price: 0
      },
      {
        name: 'Hot',
        price: 0
      },
      {
        name: 'Mild Hot',
        price: 0
      },
    ] ,  'required': false,
    'quantity': 2
  },{'name': 'Drinks', 'value': [
      {
        name: 'Coca Cola',
        price: 2,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
      {
        name: 'Smirnoff',
        price: 1,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
      {
        name: 'Pepsi',
        price: 2,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
      {
        name: 'Lemonade',
        price: 3,
        images: ['https://res.cloudinary.com/dvxcif0nt/image/upload/v1725432157/x7jxtxiy3fwhnxp4v51f.webp']
      },
    ],
    'required': false,
    'quantity': 4
  }]
  };
  
  const title = route.params.title;
  const [animatedValue] = useState(new Animated.Value(0));
  const [refresh, setRefresh] = useState(false);
  const [option, setOption] = useState();
  const { width, height } = Dimensions.get("window");
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); 
  }, []);
  const [plus, setPlus] = useState([]);
  const [selected, setSelected] = useState([]);
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
  productItems.forEach((item) => {
    const category = item.category;

    if (!categoryObject[category]) {
      categoryObject[category] = [item];
    } else {
      categoryObject[category].push(item);
    }
  });
const [notes, setNotes] = useState('');
const [price, setPrice] = useState(product.price);
  const ingredients = [
    {
      id: 1,
      name: 'Mushroom',
      quantity: '50g',
      unit: 'g',
      price: 0.40,
      selected: false,  // Can be used to track if the ingredient is selected
      images:  ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],  // Add image URL if needed
    },
    {
      id: 2,
      name: 'Mayonnaise',
      quantity: '1/4 cup',
      unit: 'cup',
      price: 0.20,
      selected: false,
      images:  ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],
    },
    {
      id: 3,
      name: 'Peeled boiled egg',
      quantity: '1 piece',
      unit: 'piece',
      price: 0.50,
      selected: false,
      images:  ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],
    },
    {
      id: 4,
      name: 'Lemon juice',
      quantity: '1 tbsp',
      unit: 'tbsp',
      price: 0.10,
      selected: false,
      images:  ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],
    },
    {
      id: 5,
      name: 'Cheddar Cheese',
      quantity: '20g',
      unit: 'g',
      price: 0.75,
      selected: false,
      images: ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],
    },
    {
      id: 6,
      name: 'Tomato Sauce',
      quantity: '2 tbsp',
      unit: 'tbsp',
      price: 0.30,
      selected: false,
      images:  ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],
    },
    {
      id: 7,
      name: 'Bacon Bits',
      quantity: '30g',
      unit: 'g',
      price: 1.00,
      selected: false,
      images:  ["https://res.cloudinary.com/dvxcif0nt/image/upload/v1725305973/opx1ndmu1ux9e3drpl38.jpg"],
    }
  ];
  console.log(formObject)
  useEffect(() => {
    const timer = setTimeout(() => setRefresh(false), 1000);
  }, [refresh]);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0); 
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offsetX / (screenWidth - 50));
    setActiveIndex(index);
  };
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [quantity, setQuantity] = useState({});

  const handleSelectIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };
  const handleSelectVariation = (ingredient) => {
    if (formObject.components == (ingredient)) {
      setFormObject(prevForm => ({
        ...prevForm,
       components: ''
      }));
    } else {
      setFormObject(prevForm => ({
        ...prevForm,
        components: ingredient
      }));
    }
  };
  function handleIncrement() {
    const newExtra = [...formObject.products];
    newExtra.push(product);
    setFormObject(prevForm => ({
      ...prevForm,
      products: newExtra
    }));
   }
   function handleDecrement(product){
    const newExtra = [...formObject.products];
    const currentQuantity = newExtra.length; 
    if (currentQuantity > 1) {
      newExtra.splice(0, 1);
    }
    setFormObject(prevForm => ({
      ...prevForm,
      products: newExtra
    }));
   }
  const handleQuantityChange = (item) => {
    const newExtra = [...formObject.extra];
    const isSelected = newExtra.findIndex(i => i.name === item.name) !== -1;
    newValues = isSelected
     ? newExtra.filter((val) => val.name !== item.name) 
     : [...newExtra, item]; 
   
    setFormObject(prevForm => ({
      ...prevForm,
      extra: newValues
    }));
  };
  const renderIngredient = ({ item }) => {
    const quantity = formObject.extra.filter(i => i.name === item.name).length;
    return <View style={styles.optionRow}>
    <View style={{flexDirection: 'row', width: 150, alignItems: 'center'}}>{item?.images?.length > 0 && <ImageBackground style={{height: 30, width: 32, marginRight:12,}} imageStyle={{borderRadius: 6, backgroundColor: '#666'}} source={{uri: item.images[0]}}/>}
    <Text style={styles.optionName}>{item.name}</Text></View>
    {item.price > 0 && <Text style={styles.ingredientDetails}>+${item.price.toFixed(2)}</Text>}
    <Pressable onPress={()=> handleQuantityChange(item)}><Ionicons name={`${ formObject.extra.findIndex((opt) => opt.name === item.name) !== -1 ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" /></Pressable>

  </View>
  };
  const [selectedOptions, setSelectedOptions] = useState({});
  const calculateTotalPrice = () => {
    const productQuantity = formObject.products.length; // The quantity of the main product
    let totalPrice = product.price * productQuantity; // Start with the base product price times the quantity
  
    // Calculate the total price of extra items
    formObject.extra?.forEach((extraItem) => {
      totalPrice += extraItem.price * productQuantity;
    });
  
    // Calculate the total price of selected options
    formObject.options.forEach((optionCategory) => {
      if (optionCategory.required) {
        // If the option category is required, multiply the price of each selected option by the product quantity
        optionCategory.values.forEach((selectedOption) => {
          totalPrice += selectedOption.price * productQuantity;
      });
      } else {
        // If the option category is not required, just add the price of each selected option
        optionCategory.values.forEach((selectedOption) => {
            totalPrice += selectedOption.price;
        });
      }
    });
  
    return totalPrice;
  };
  const scrollViewRef = useRef(null);
  function fuflfilCart(){
    if (canAddToCart()){
    dispatch(addToCart({id : formObject }))
    setFormObject({...productData})
    navigation.replace("Cart");
  }else{
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 500, animated: true });
      }
      alert("Choose all required options")
    }
  }
  const handleSelectOption = (category, item, required, change = 0) => {
    setFormObject((prevForm) => {
      const updatedOptions = prevForm.options.map((opt) => {
        if (opt.name === category ) {
          let newValues = [...opt.values];
          const currentQuantity = newValues.filter((val) => val.name === item.name).length;
          if (item.price == 0 || required || change == 0){
            const isSelected = opt.values.findIndex(i => i.name === item.name) !== -1;
            if (!(!required && (formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity ))|| isSelected){
           newValues = isSelected
            ? opt.values.filter((val) => val.name !== item.name) 
            : [...opt.values, item]; 
            }
          }
          else if (change > 0) {
            // Add the item to the array
            newValues.push(item);
          } else if (change < 0 && currentQuantity > 0) {
            // Remove one instance of the item
            const index = newValues.findIndex(i => i.name === item.name);
            if (index !== -1) newValues.splice(index, 1);
          }

          return { ...opt, values: newValues };
        }
        return opt;
      });
      return { ...prevForm, options: updatedOptions };
    });
  };

  const renderOptionItem = ({ item, category, required }) => {
    const getQuantity = (category, option) => {
      const optionCategory = formObject.options.find((opt) => opt.name === category);
      if (!optionCategory) return 0;
      
      // Calculate quantity based on how many times the item exists in the values array
      const quantity = optionCategory.values.filter((val) => val.name === option).length;
      return quantity;
    };
    const quantity = getQuantity(category, item.name);
    return <View style={styles.optionRow}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>{item?.images?.length > 0 && <ImageBackground style={{height: 30, width: 32, marginRight:12,}} imageStyle={{borderRadius: 6, backgroundColor: '#666'}} source={{uri: item.images[0]}}/>}
      <Text style={styles.optionName}>{item.name}</Text></View>
      {item.price > 0 && <Text style={styles.ingredientDetails}>+${item.price.toFixed(2)}</Text>}
      {(item.price > 0  && !required ) &&   <View style={styles.ingredientActions}>{((!required && quantity > 0) || !(formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity )) && <>
        <TouchableOpacity onPress={()=> handleSelectOption(category, item, required,-1)} disabled={quantity == 0}>
        <View style={{alignItems: 'center', justifyContent: 'center',  borderRadius: 200, borderWidth: 0 }}><AntDesign name="minuscircleo" size={17} color="#BC6C25" /></View>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}{quantity != 0 && `${'x'}`}</Text>
        <TouchableOpacity onPress={()=> handleSelectOption(category, item, required,1)} disabled={(!required && (formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity ))}>
        <View style={{padding: 0, borderRadius: 100, width: 'auto' , alignItems: 'center', justifyContent: 'center', }}><AntDesign name="pluscircleo" size={17} color="#BC6C25" /></View>
        </TouchableOpacity></>}</View>}
        {(((item.price == 0 && !formObject.options.find((opt) => opt.name === category).quantity ) || required) || ((!required && quantity > 0) || !(formObject.options.find((opt) => opt.name === category)?.values.length >= formObject.options.find((opt) => opt.name === category).quantity ))) && <Pressable  onPress={()=> handleSelectOption(category, item, required)}><Ionicons name={`${ formObject.options.find((opt) => opt.name === category)?.values.findIndex(i => i.name === item.name) != -1 ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" /></Pressable>
    }
    </View>
  };

  const renderOptions = ({ items }) => {
    return <View style={styles.optionSection}>
        <View style={styles.separator} />
        <View style={styles.sectionTitle}><Text >{items.name}</Text><Text style={[styles.pill ,{color: formObject.options.find((opt) => opt.name === items.name)?.values.length < items.quantity ? items.required ? '#A52A2A' : '#654321': '#2E6F'}]}> {(!items.required) ? 'Optional' : 'Required' }</Text></View>
      {items.required && <Text style={{marginBottom: 4}}>{`Pick ${items.quantity} item(s)`}</Text>}
      {!items.required && items.quantity && <Text style={{marginBottom: 4}}>{`Pick up to ${items.quantity} item(s)`}</Text>}
      <View style={styles.separator} />
      <FlatList
        data={items.value}
        renderItem={({ item }) => renderOptionItem({ item, category: items.name, required: items.required })}
        keyExtractor={(option) => option.name}
      />

      {/* Separator */}
      {/* <View style={styles.separator} /> */}
    </View>
  };

  const renderVariations = ({ item }) => (
    <View style={styles.ingredientRow}>
      <Text style={styles.optionName}>{item}</Text>
      <View style={{}}>
        {/* Quantity buttons */}
        <Pressable onPress={()=> handleSelectVariation(item)}><Ionicons name={`${formObject.components == (item)? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" /></Pressable>
      </View>
    </View>
  );

    console.log("testing formObject",formObject)
  const renderImageCarousel = () => {
    return (
      <View style = {{height: height/1.7, }}>
        <View style = {{height: height/1.5,}}>
        <FlatList
          data={[...product.images, ...product.images]}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ImageBackground
            style={[styles.productImage, { width: screenWidth  }]}
            source={{ uri: item }}
          >
            {/* Apply LinearGradient as an overlay */}
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']} // Customize gradient colors
              style={styles.gradient}
            >
            {/* <TouchableOpacity style={styles.addButton} onPress={() => onAdd(product)}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13Z"
                    fill="#BC6C25"
                  />
                </Svg>
              </TouchableOpacity> */}
             
              {/* <View style={styles.detailsContainer}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>African</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Sides</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>2+</Text>
            </View>
          </View> */}
            </LinearGradient>
          </ImageBackground>
          )}
          onScroll={handleScroll}
        />
        </View>

        {/* Dots indicator */}
        <View style={styles.dotsContainer}>
          <View style={{ flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    borderRadius: 25,
    marginTop: 10,  backgroundColor: 'rgba(255,255,255,0.8)', }}>
          {[...product.images, ...product.images].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
        </View>
      </View>
    );
  };
  console.log(product)
  const canAddToCart = () => {
    // Check if there are at least 2 items in the extra array
    if (formObject.extra?.length < 2) {
      return false; // Cannot add to cart if there are fewer than 2 extra items
    } if (formObject.components?.length == 0){
return false
    }
    for (let optionCategory of formObject.options) {
      if (optionCategory.required) {
        const selectedCount = optionCategory.values.length;
  
        // Check if the selected count meets the required quantity
        if (selectedCount < optionCategory.quantity) {
          return false; // Cannot add to cart if any required category doesn't meet the required quantity
        }
      }
    }
  
    return true; // All conditions met, can add to cart
  };

  return (<>
    <ScrollView  ref={scrollViewRef}  style={styles.container}>
      {/* Header Section */}

      {/* Product Image Carousel */}
      <View style={styles.carouselContainer}>
        {renderImageCarousel()}
      </View>
        <View style={styles.detailsContainer}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>African</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Sides</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Seafood</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Top Category</Text>
            </View>
          </View>
      {/* Product Title and Quantity Selector */}
      <View style={{  borderTopRightRadius: 25,
  borderTopLeftRadius: 25,
  backgroundColor: 'white',
  padding: 10,
  // paddingTop: 15,
  paddingBottom: 60,
  // iOS shadow properties
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 }, // shadow towards the top
  shadowOpacity: 0.3,
  shadowRadius: 6,
  // Android elevation
  elevation: 6,}}>
      <View style={styles.titleSection}>
        <View>
        <Text style={styles.productTitle}>{product.title}</Text>
        </View>
          {/* Price Section */}
      <View style={styles.priceSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <Text style={styles.priceInteger}>{product.price.toFixed(2).split('.')[0]}</Text>
          <Text style={styles.priceDecimal}>.{product.price.toFixed(2).split('.')[1]}</Text>
        </View>
      </View>
      </View>
      <View style={{flexDirection: 'row',
    alignItems: 'flex-start', paddingRight: 15,}}>
      <View style={styles.verticalLine} />
      <View style={{ flexDirection:'column'}}><Text
                  onTextLayout={onTextLayout}
                  numberOfLines={textShown ? undefined : 4}
                  style={styles.aboutDescription}
                >
                 {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non blandit metus, non posuere elit. Proin vitae vehicula purus. Nullam id dui sodales, elementum sem dictum, pellentesque urna. Nullam mattis efficitur vehicula. Donec mollis eleifend tempus. Morbi rutrum viverra egestas. Etiam ut nisl erat. Proin semper lectus non justo commodo varius. In purus nibh, volutpat gravida scelerisque luctus, pharetra eget ipsum. Donec nibh augue, vulputate quis ipsum lacinia, volutpat sollicitudin massa."}
      </Text>
      {lengthMore && (
                  <Text
                    onPress={toggleNumberOfLines}
                    style={{
                      textAlign: "right",
                      color: "#BC6C25",
                      fontSize: 13
                    }}
                  >
                    {textShown ? "Read less..." : "Read more..."}
                  </Text>
                )}</View>
    </View>
    <View style={styles.separator} />
    <View 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={{
        paddingHorizontal: 10,
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}
    >
      <View style={styles.nutritionItem}>
        <Text style={styles.label}>Calories</Text>
        <Text style={styles.value}>220 kcal</Text>
      </View>
      <View style={{  borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.2)'}} />
      <View style={styles.nutritionItem}>
        <Text style={styles.label}>Total Fat</Text>
        <Text style={styles.value}>12g</Text>
      </View>
      <View style={{  borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.2)'}} />
      <View style={styles.nutritionItem}>
        <Text style={styles.label}>Cholesterol</Text>
        <Text style={styles.value}>25mg</Text>
      </View>
    </View>
    <View style={styles.separator} />
      {/* Extra Options */}
      {/* Ingredients List */}
      {product.components.length > 0 && <><Text style={[styles.sectionTitle, formObject.components.length <= 0 ? { color: '#A52A2A', fontSize: 18 }:{ color : 'black'}]}>Choose one</Text><View style={styles.separator} />
        <FlatList
          data={product.components}
          renderItem={renderVariations}
          keyExtractor={item => item}
          scrollEnabled={false} // Disables scroll for FlatList since it's in ScrollView
        /></>}
      {product.extra && <><View style={styles.sectionTitle}><Text >Add extra Ingredients</Text><Text style={[styles.pill, {color: formObject.extra.length < 2 ? '#A52A2A': '#2E6F'}]}>Required</Text></View>
       <Text style={{marginBottom: 4}}>{`Pick 2 item(s)`}</Text>
       <View style={styles.separator} />
        <FlatList
          data={ingredients}
          renderItem={renderIngredient}
          keyExtractor={item => item.name}
          scrollEnabled={false} // Disables scroll for FlatList since it's in ScrollView
        /></>}
      {/* {product.extra && <><Text style={styles.extraTitle}>Add Extra Additional</Text>
       {dummyData.extras.map((extra) => (
        <TouchableOpacity key={extra.name} onPress={() => handleExtraSelect(extra)} style={styles.extraOption}>
          <Text>{extra.name}</Text>
          <Text>${extra.price.toFixed(2)}</Text>
        </TouchableOpacity>
      ))}</>} */}
      {/* Render each category and its options */}
      <FlatList
        data={dummyData.options}
        renderItem={({item})=>renderOptions({items: item})}
        keyExtractor={(category) => category.name}
        scrollEnabled={false} 
      />
      {/* Notes Section */}
      {product.instructions && <TextInput
        style={styles.notesInput}
        placeholder="Write Notes"
        value={formObject.instructions}
        onChangeText={(text) => 
          setFormObject((prev) => ({ ...prev, instructions: text }))
        }
      />}
        <View style={styles.separator} />

      {/* Bottom CTA (Next Button and Total Price) */}
  
      </View>
    </ScrollView>
    <View>
    <View style={styles.cartSection}>
  <IncrementDecrementBton
                  minValue={formObject.products.length}
                  onIncrease ={
              handleIncrement
                }
                  onDecrease={handleDecrement}
                />
       <TouchableOpacity onPress={fuflfilCart} >
      <LinearGradient
        colors={canAddToCart() ? ['#d9853b','#BC6C25',] : ['#aaa', "#ddd"]} // Example colors, you can change them
        style={styles.nextButton}
        start={{ x: 0, y: 0 }} // Top-left corner
        end={{ x: 1, y: 0 }}   // Top-right corner (horizontal gradient)
      >
        <Text style={styles.nextButtonText}>Next</Text>
        <View style={{  width: 1, height: 30,
    backgroundColor: 'rgba(0,0,0,0.2)', marginHorizontal: 30}} />
        <Text style={styles.nextButtonPrice}>${calculateTotalPrice().toFixed(2)}</Text>
      </LinearGradient>
    </TouchableOpacity>
      </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },detailsContainer: {
    flexDirection: 'row',
    // position: 'absolute',
    gap: 3,
    bottom: 0,
    paddingHorizontal: 10,
    marginBottom: 5,
  },pill: {
    backgroundColor: '#F0F0F0', // Light background for the pill
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    color: '#555', // Darker text for contrast
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6347',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselContainer: {
  },
  productImage: {
    height: height/1.5,
    // resizeMode: 'stretch',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 10,
    width: screenWidth,
 
  },  cartSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 23,
    position: 'absolute',
    bottom: 4,
    borderRadius: 35,
    width: screenWidth - 10,
    height: 60,
    marginHorizontal: 5
  },
  dot: {
    width: 4,
    height:4,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#BC6C25',
    width: 10,
    height: 4
  },
  nutritionItem: {
    alignItems: 'center',
    marginRight: 20, // Space between items
  },
  label: {
    fontSize: 14,
    color: '#777', // Light gray for label
  },sectionTitle: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: "row"
  },
  value: {
    fontSize: 18,
    color: '#333', // Darker color for value
  },
  inactiveDot: {
    backgroundColor: '#666',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
  }, ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientName: {
    fontSize: 16,
    width: '468',
  },
  ingredientDetails: {
    fontSize: 14,
    width: '20%',
  },
  ingredientActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: '30%',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCategory: {
    fontSize: 18,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionName: {
    fontSize: 16,
    width: 118,
  },
  optionPrice: {
    fontSize: 16,
    color: '#555',
    width: '30%',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  dollarSign: {
    fontSize: 18,
    color: '#A0A0A0',
    marginRight: 3,
  },
  priceInteger: {
    fontSize: 28,
    color: '#000',
  },
  priceDecimal: {
    fontSize: 18,
    color: '#A0A0A0',
    marginLeft: 3,
  },
  changeQuantityButton: {
    fontSize: 20,
    color: '#BC6C25',
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 16,
    color:"#BC6C25", 
    marginHorizontal: 1,
  },
  addToCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesInput: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#BC6C25',
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 30,
    borderRadius: 10,
      // iOS shadow properties
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 }, // shadow towards the top
  shadowOpacity: 0.3,
  shadowRadius: 6,
  // Android elevation
  elevation: 6
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    // width: 80,
  },
  nextButtonPrice: {
    color: '#fff',
    fontSize: 18,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 20,
    width: screenWidth/1.5,
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    width: screenWidth,

  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 13,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 12,
    color: '#555',
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  }, verticalLine: {
    width: 3,
    height: '100%',
    backgroundColor: '#BC6C25',   
     marginRight: 13, // Spacing between the line and text
    borderRadius: 2, // Rounded edges for the vertical line
  },
  sizeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSizeOption: {
    backgroundColor: '#FF6347',
  },
  sizeText: {
    fontSize: 16,
    color: '#555',
  },
  selectedSizeText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDisplay;