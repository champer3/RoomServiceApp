import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, EvilIcons } from "@expo/vector-icons";
import BoxItemCategory from "../../components/Category/BoxItemCategory";
import ItemCategory from "../../components/Category/ItemCategory";
import SearchCat from "../../components/Category/SearchCat";
import Pill from "../../components/Pills/Pills";
import Search from "../../components/Search/Search";
import RecentList from "../../components/RecentList";

function Category() {
  let browse = (
    <>
      <View style={styles.browseView}>
        <Text style={styles.browseText}>Browse All Categories</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <BoxItemCategory
          items={[
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
            { text: "hbjdbc", image: require("../../assets/snack.png") },
          ]}
        />
      </View>
    </>
  );

  let check = (
    <View style={styles.browseView}>
      <View style={styles.horizontalCat}>
        <Text style={styles.text}>Categories</Text>
        <ItemCategory
          items={[
            { text: "Snacks", image: require("../../assets/snack.png") },
            { text: "Snacks", image: require("../../assets/snack.png") },
            { text: "Snacks", image: require("../../assets/snack.png") },
            { text: "Snacks", image: require("../../assets/snack.png") },
            { text: "Snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
            { text: "snacks", image: require("../../assets/snack.png") },
          ]}
        />
      </View>
      <View style={styles.history}>
        <Text style={styles.text}>Most Searched</Text>
        <Search
          items={[
            "water",
            "Gatorade",
            "bottle",
            "chips",
            "ice cream",
            "milk",
            "candy",
            "cookies",
            "food",
            "salmon",
            "bread",
            "gifts",
            "diary",
            "hat",
          ]}
        />
      </View>
    </View>
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
        {check}
        {/* <View style={styles.recentView}>
        <Text style={styles.text}>Recent</Text>
        <RecentList items={["water", "Gatorade", "bottle", "chips", "ice cream", "milk", "candy", "cookies", "food", "salmon"]} />
      </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2%",
    marginTop: "10%",
  },
  search: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    // marginRight: 16,
    borderRadius: 16,
  },
  cart: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginLeft: 8,
  },
  browseText: {
    fontSize: 24,
    fontWeight: "800",
  },
  browseView: {
    marginVertical: 8,
  },
  searchView: {
    flex: 1,
  },
  recentView: {
    flex: 1,
    marginTop: 16,
  },
  horizontalCat: {
    width: "100%",
  },
  history: {
    marginTop: "10%"
  },
  text: { fontWeight: "500", fontSize: 20, marginBottom: 20 },
});
