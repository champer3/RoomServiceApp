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

const { width, height } = Dimensions.get("window");

function Home() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.search}>
            <View style={styles.input}>
              <EvilIcons name="search" size={24} color="#aaa" />
              <TextInput placeholder="Search                                                                          " />
            </View>
            <View style={styles.cart}>
              <Pressable>
                <View>
                  <Feather name="shopping-cart" size={24} color="black" />
                </View>
              </Pressable>
            </View>
          </View>
          <View style={styles.deals}>
            <Pressable>
              <Image
                style={styles.image}
                source={require("../assets/deals.png")}
              />
            </Pressable>
          </View>
          <View style={styles.horizontalCat}>
            <View style={styles.catHead}>
              <Text style={styles.text}>Popular Categories</Text>
              <Pressable>
                <Text style={{ color: "#BC6C25", fontSize: 12 }}>See All</Text>
              </Pressable>
            </View>
            <ItemCategory
              items={[
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
                { text: "Snacks", image: require("../assets/snack.png") },
              ]}
            />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Recommended Foods</Text>
            <ProductHorizontal items={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Snacks For You</Text>
            <ProductHorizontal items={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal text={"Best Grocery Deals!"} />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Recommended Foods</Text>
            <ProductHorizontal items={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
          </View>
          <View style={styles.recommendedView}>
            <Text style={styles.text}>Snacks For You</Text>
            <ProductHorizontal items={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
          </View>
          <View style={[styles.recommendedView, { alignItems: "center" }]}>
            <Deal text={"Best Meal Deals!"} />
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
    marginHorizontal: "2%",
    marginTop: "5%",
  },
  search: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#EFEEEE",
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cart: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginLeft: 8,
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: height / 4.05,
  },
  deals: {
    marginVertical: 16,
  },
  horizontalCat: {
    width: "100%",
  },
  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    marginTop: 16,
  },
});
