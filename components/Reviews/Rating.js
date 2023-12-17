import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function Rating({rate, color, active = false}) {
  return (
    <View style={[styles.container, {
      backgroundColor: active ? '#283618' : "#FAFAFA",}]}>
        <View style={styles.innerContainer}>
          <AntDesign name="star" size={24} color={active ? 'white' : 'black'} />
          <Text style={[styles.text, {color : active ? 'white' : 'black'}]}>{rate}</Text>
        </View>
    </View>
  );
}

export default Rating;

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        marginLeft: 4,
        fontWeight: "600"
    }
})
