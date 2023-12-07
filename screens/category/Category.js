import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather, EvilIcons } from "@expo/vector-icons";

function Category() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.search}>
        <View style={styles.input}>
          <EvilIcons name="search" size={24} color="#aaa" />
          <TextInput placeholder="Search" />
        </View>
        <View style={styles.cart}>
          <Pressable>
            <View >
              <Feather name="shopping-cart" size={24} color="black" />
            </View>
          </Pressable>
        </View>
      </View>
      <View>
        <Text>Browse All Categories</Text>
      </View>
      <FlatList />
    </SafeAreaView>
  );
}

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 32
  },
  search: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    marginRight: 16,
    borderRadius: 12
  },
  cart: {
    justifyContent: "center",
    alignItems: "center"
  }
});
