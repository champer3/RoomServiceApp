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

const { height } = Dimensions.get("window");
function DealsScreen() {
  const data = [
    { key: "1", text: "Best Meal Deal" },
    { key: "2", text: "Best Snack Deal" },
    { key: "3", text: "Best Alcohol Deal" },
  ];
  const renderItem = ({ item }) => (
    <View style={[styles.recommendedView, { alignItems: "center" }]}>
      <Deal text={item.text} />
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
