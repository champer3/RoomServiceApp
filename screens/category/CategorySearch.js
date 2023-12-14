import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import Product from "../../components/Product/Product";
import ProductCategory from "../../components/Category/ProductCategory";


function CategorySearch() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          borderRadius={16}
          style={styles.backgroundImgStyle}
          source={require("../../assets/categoryPic.png")}
        >
          <View style={styles.catHead}>
            <Text style={styles.text}>Snacks</Text>
          </View>
        </ImageBackground>
        <View style={styles.input}>
          <EvilIcons name="search" size={24} color="#aaa" />
          <TextInput
            style={{ fontSize: 16 }}
            placeholder="Search                                                                          "
          />
        </View>
        <View style={styles.topList}>
          <Text style={{ fontWeight: "700", fontSize: 20 }}>All Snacks</Text>
          <Pressable>
            <Text style={{ color: "#BC6C25" }}>
              {" "}
              <Ionicons name="filter" size={16} color="#BC6C25" /> Filter By
            </Text>
          </Pressable>
        </View>
        <ProductCategory items={[1,2,3,4,5,6,7]} />
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
  text: { color: "white", fontWeight: "500", fontSize: 24 },
  topList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
});
