import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function Rating({rate, color}) {
  return (
    <View style={styles.container}>
      <Pressable>
        <View style={styles.innerContainer}>
          <AntDesign name="star" size={24} color={color} />
          <Text style={styles.text}>{rate}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Rating;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FAFAFA",
        borderRadius: "50%",
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
