import { ScrollView, StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import Item from "../Item/Item";
import Product from "../Product/Product";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
function Deal({ text, onPress,item, onAdd, color = "#283618"}) {
  let items = [...item]
  let odd = "";
  if (items.length % 2 == 1) {
    odd = items.splice(0, 1)[0];
  }
  return (
          <View style={[styles.container, {backgroundColor: color,}]}>
            <View style={styles.catHead}>
              <Text style={styles.text}>{text}</Text>
              {onPress && <Pressable onPress = {onPress} style={({ pressed }) => pressed && { opacity: 0.5 }}>
                <Text style={{ color: color == "#283618" ? "#BC6C25" : 'white', fontSize: 12 }}>
                  More Deals
                </Text>
              </Pressable>}
            </View>
            {odd && <Product onAdd={onAdd} title={odd.title} newPrice={odd.newPrice} oldPrice={odd.oldPrice} image={odd.image}/>}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 28 }}>
              {items.map((item, index) => (
                <View key={index} style={{ width: "46%", marginBottom: 15 }}>
                  <Product onAdd={onAdd} widths={200} title={item.title} oldPrice={item.oldPrice} newPrice={item.newPrice} image={item.image} />
                </View>
              ))}
            </View>
          </View>
  );
}

export default Deal;

const styles = StyleSheet.create({
  container: {
    flexWrap: "nowrap",
    width: width-10,
    // height: "45%",
    gap: 15,
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  text: { fontWeight: "bold", fontSize: 16, marginBottom: 20, color: "white" },
});
