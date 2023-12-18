import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Pressable,
  FlatList,
  Platform
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import Deal from "../components/Category/Deal";
import Input from "../components/Inputs/Input";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");


function DealsScreen() {
  const navigation  = useNavigation()
  function dealHandler (){

    navigation.navigate('All Deals')
  }
  const data = [
    { key: "1", text: "Best Meal Deal" , things: [
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
    ]},
    { key: "2", text: "Best Snack Deal", things : [
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
    ] },
    { key: "3", text: "Best Alcohol Deal" ,things : [
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
    ] },
  ];
  const renderItem = ({ item }) => (
    <View style={[styles.recommendedView, { alignItems: "center" }]}>
      <Deal text={item.text} onPress={dealHandler} item={item.things} />
    </View>
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        
            <Input text={'Search deals'} icon={<EvilIcons name="search" size={24} color="#aaa" />}/>
          <View style={styles.catHead}>
            <Text style={styles.text}>Available Deals</Text>
            <Pressable>
              <Text style={{ color: "#BC6C25" }}>
                {" "}
                <Ionicons name="filter" size={16} color="#BC6C25" /> Filter By
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            // style={{marginBottom: 20}}
          />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default DealsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2%",
    marginTop: "5%",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    // flex: 1,
    paddingVertical: height / 45,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    marginBottom: Platform.OS === 'ios' ? 20 : -30,
  },
});
