import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import ItemCategory from "../components/Category/ItemCategory";
import ProductHorizontal from "../components/Category/ProductHorizontal";
import Deal from "../components/Category/Deal";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Inputs/Input";
const { width, height } = Dimensions.get("window");

function Home() {
  const navigation = useNavigation()
  function pressHandler (cat){
    navigation.navigate('Category', {cat})
  }
  function chooseHandler (){
    navigation.navigate('All Categories')
  }
  function cartHandler (){
    navigation.navigate('Cart')
  }
  function dealHandler (){
    navigation.navigate('All Deals')
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: "5%", paddingTop: '10%'}}>
            <View style={{gap: 6}}>
              <Text style={{color: 'white', fontSize: 13, letterSpacing: 0.4, fontWeight: 'bold'}}>Good Afternoon</Text>
              <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', letterSpacing: 1}}>Josh Brooks</Text>
            </View>
          <View style={[styles.cart, {flex: 0.3}]}>
              <Pressable onPress={cartHandler}>
                <View>
                  <Feather name="shopping-cart" size={24} color="black" />
                </View>
              </Pressable>
            </View>
          </View>
          <View style={styles.search}>
            {/* <View style={styles.input}> */}
            
              <Input color={'white'} icon={<EvilIcons name="search" size={30} color="white" />} text={'Search items'}></Input>
           
             
              {/* <EvilIcons name="search" size={24} color="black" />
              <TextInput style={{fontSize: 16}} placeholderTextColor="black" placeholder="Search RoomService                                                                         " /> */}
            {/* </View> */}
            
          </View>
        <ScrollView style={{backgroundColor: "white"}}>
          
          <View style={[styles.horizontalCat,{marginTop: 20}]}>
            <View style={styles.catHead}>
              <Text style={styles.text}>Popular Categories</Text>
              <Pressable onPress={chooseHandler}>
                <Text style={{ color: "#BC6C25", fontSize: 12 }}>See All</Text>
              </Pressable>
            </View>
            <ItemCategory
              items={[
                { text: "Alcohol", image: require("../assets/Alcohol.png") },
                { text: "Frozen", image: require("../assets/frozen.png") },
                { text: "Ice Cream", image: require("../assets/icecream.png") },
                { text: "Food", image: require("../assets/food.png") },
                { text: "Snacks", image: require("../assets/snack.png") }
              ]}
             
            />
              
            {/* <ScrollView style={{borderWidth: 1}} horizontal={true}>
              <View style={{flex: 1}}>
            <Pressable onPress={dealHandler} stylye ={{borderWidth: 1}}>
              <Image
                style={styles.image}
                source={require("../assets/deals.png")}
              />
              
            </Pressable>
            </View>
            <Pressable onPress={dealHandler}>
              <Image
                style={styles.image}
                source={require("../assets/deals.png")}
              />
            </Pressable>
            <Pressable onPress={dealHandler}>
              <Image
                style={styles.image}
                source={require("../assets/image 16.png")}
              />
            </Pressable>
          </ScrollView> */}
          <ScrollView   horizontal={true} >
            <View  style={{flexDirection: 'row', flexWrap: 'nowrap', 
        gap: 15}}>
                <Pressable onPress={dealHandler}><View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/deal1.png")} />
        </View></Pressable>
                <Pressable onPress={dealHandler}><View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/deal2.png")} />
        </View></Pressable>
                <Pressable onPress={dealHandler}><View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/deal3.png")} />
        </View></Pressable>
                <Pressable onPress={dealHandler}><View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/deal4.png")} />
        </View></Pressable>
                <Pressable onPress={dealHandler}><View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/deal5.png")} />
        </View></Pressable>
            </View>
          </ScrollView>
          </View>
          
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Recommended Foods</Text>
            <ProductHorizontal items={[
              {title: '4 Piece Chicken McNuggets', oldPrice: 3.69, image : require('../assets/food6.png')},
              {title: 'Double Quarter Pounder with Cheese', oldPrice: 3.69, image : require('../assets/food1.png')},
              {title: 'Sausage McMuffin® with Egg Meal', oldPrice: 3.69, image : require('../assets/food2.png')},
              {title: '10 PC. Spicy Chicken Nuggets', oldPrice: 3.69, image : require('../assets/food3.png')},
              {title: 'Asiago Ranch Classic Chicken Club', oldPrice: 3.69, image : require('../assets/food4.png')},
              {title: 'Sour Cream and Chive Baked Potato', oldPrice: 3.69, image : require('../assets/food5.png')},
          ]} />
          </View>
          
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal text={"Best Grocery Deals!"} onPress={dealHandler} item={[
    {
      title: "Woodstock Organic Frozen Broccoli Florets 10oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/cr3.png"),
    },
    {
      title: "Woodstock Frozen Organic Mixed Berries 10oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/cr2.png"),
    },
    {
      title: "Sambazon Original Blend Smoothie Superfruit Pack",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/cr1.png"),
    }
  ]} color = '#039F03' />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Snacks For You</Text>
            <ProductHorizontal items={[
              {title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', oldPrice: 3.69, image : require('../assets/snacks1.png')},
              {title: 'Hostess Donettes Chocolate Mini Donuts Bag 10.75oz', oldPrice: 3.69, image : require('../assets/snacks2.png')},
              {title: 'Kit Kat Candy Bar King Size 3oz', oldPrice: 3.69, image : require('../assets/snacks3.png')},
              {title: 'Basically, Sour Rainbow Bites 5oz', oldPrice: 3.69, image : require('../assets/snacks4.png')},
              {title: 'Ferrero Rocher Hazelnut Chocolate Candy 1.3oz', oldPrice: 3.69, image : require('../assets/snacks5.png')},
              {title: 'OREO Original Chocolate Sandwich Cookies 13.29oz $5.49', oldPrice: 3.69, image : require('../assets/snacks6.png')},
          ]} /> 
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Alcohol</Text>
            <ProductHorizontal items={[
              {title: 'White Claw Seltzer Flavor No. 3 Variety 12pk 12oz Can 5.0% ABV $22.99', oldPrice: 3.69, image : require('../assets/alcohol1.png')},
              {title: 'White Claw Surge Variety 12pk 12oz Can 8% ABV $22.99', oldPrice: 3.69, image : require('../assets/alcohol2.png')},
              {title: 'White Claw Seltzer Variety 12pk 12oz Can 5.0% ABV $22.99', oldPrice: 3.69, image : require('../assets/alcohol3.png')},
              {title: 'Dolce Vita Italy Sparkling Prosecco 750ml $39.49', oldPrice: 3.69, image : require('../assets/alcohol4.png')},
              {title: "Jack Daniel's & Coca-Cola 355ml Can 7% ABV", oldPrice: 3.69, image : require('../assets/alcohol5.png')},
              {title: 'Don Romeo Blanco Tequila 750ml (80 Proof)', oldPrice: 3.69, image : require('../assets/alcohol6.png')},
          ]} /> 
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal text={"Health Deals"} onPress={dealHandler} item={[
    {
      title: "Theraflu Green Tea & Honey Lemon Multi-",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/h1.png"),
    },
    {
      title: "Stix Early Pregnancy Test 2ct",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/h2.png"),
    },
    {
      title: "Equaline Cotton Swabs 375ct",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/h3.png"),
    },
    {
      title: "Q-Tips Cotton Swabs 170ct",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/h4.png"),
    },
    {
      title: "Equaline Cotton Swabs 375ct",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/h3.png"),
    }
  ]} color = '#00CED1' />
          </View>
     
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Drinks</Text>
            <ProductHorizontal items={[
              {title: 'CELSIUS Peach Mango Green Tea, Essential', oldPrice: 3.69, image : require('../assets/drink1.png')},
              {title: 'GHOST® Energy Sour Patch Kids Blue Raspberry 16oz Can $2.99', oldPrice: 3.69, image : require('../assets/drink2.png')},
              {title: 'Mountain Valley Spring Water Sparkling Glass', oldPrice: 3.69, image : require('../assets/drink3.png')},
              {title: 'Tiger Eye Iced Coconut Latte 8.5oz', oldPrice: 3.69, image : require('../assets/drink4.png')},
              {title: "La Colombe Cold Brew Colombian Light Roast Coffee 42oz $8.59", oldPrice: 3.69, image : require('../assets/drink5.png')},
              {title: 'La Colombe Cold Brew Brazilian Medium Roast', oldPrice: 3.69, image : require('../assets/drink6.png')},
          ]} /> 
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal text={"Pantry Deals"} onPress={dealHandler} item={[
    {
      title: "Post Fruity Pebbles Cereal 11oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/p1.png"),
    },
    {
      title: "Stix Early Pregnancy TGeneral Mills Cinnamon Toast Crunch Cereal 12ozest 2ct",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/p2.png"),
    },
    {
      title: "Post Marshmallow Fruity Pebbles Cereal 11oz $5.69",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/p3.png"),
    },
    {
      title: "Post Cocoa Pebbles Cereal 11oz",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/p4.png"),
    },
    {
      title: "Post Honey Bunches of Oats Honey Roasted 12oz",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/p5.png"),
    }
  ]} color = '#D2B48C' />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Home</Text>
            <ProductHorizontal items={[
              {title: 'Basically, 4ct Large Roll Soft Toilet Paper $22.99', oldPrice: 3.69, image : require('../assets/home1.png')},
              {title: 'Bounty Select-A-Size Paper Towels, Double Roll', oldPrice: 3.69, image : require('../assets/home2.png')},
              {title: 'Gain Ultra Original Liquid Dish Soap 8oz', oldPrice: 3.69, image : require('../assets/home4.png')},
              {title: 'Tide PODS Liquid Laundry Detergent Pacs Spring Meadow Scent 42ct $15.49', oldPrice: 3.69, image : require('../assets/home3.png')},
              {title: "Febreze April Fresh Fabric Refreshener with Downy", oldPrice: 3.69, image : require('../assets/home5.png')},
              {title: 'Tide Liquid Laundry Detergent Original Scent', oldPrice: 3.69, image : require('../assets/home6.png')},
          ]} /> 
          </View>
          <View style={styles.recommendedView}>
          <Deal text={"Yummy Ice Creams!"} onPress={dealHandler} item={[
    {
      title: "Ben & Jerry's Churray for Churros Ice Cream Pint",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/i1.png"),
    },
    {
      title: "Milk Bar Gingerbread Latte Pint 14oz",
      oldPrice: 4.99,
      newPrice: "10.00",
      image: require("../assets/i2.png"),
    },
    {
      title: "Milk Bar Candy Cane Cookies & Cream Pint 14oz$7.99",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/i3.png"),
    },
    {
      title: "Jeni's, Boozy Eggnog Ice Cream Pint 16oz",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/i4.png"),
    },
    {
      title: "Jeni's, White Chocolate Peppermint Ice Cream Pi",
      oldPrice: 4.99,
      newPrice: '10.00',
      image: require("../assets/i5.png"),
    }
  ]} color = '#98FB98' />
       
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
          <View  style={{flexDirection: 'row', flexWrap: 'nowrap', 
        gap: 15}}>
                <Pressable onPress={dealHandler}><View style={[styles.imageContainer, {width: width - 30}]}>
          <Image style={styles.image} source={require("../assets/deals.png")} />
        </View></Pressable></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#283618"
  },
  search: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingBottom: "5%"

  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cart: {
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    paddingHorizontal: 16,
    paddingRight: 18,
    borderRadius: 13,
    backgroundColor: "white",


  },
  image: {
    resizeMode: "contain",
    height: height /2,
    width: '100%'
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: height/3,
    width: width/1.5
  },
  deals: {
    marginVertical: 16,
    marginHorizontal: "2%",
    flexDirection: 'row',
  },
  horizontalCat: {
    width: "100%",
    paddingHorizontal: "2%",
  },
  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center"
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    marginTop: 16,
    marginHorizontal: "2%",
  },
});
