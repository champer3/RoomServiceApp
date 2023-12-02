import { Pressable, StyleSheet, View, Text } from "react-native";
import { RadioButton } from "react-native-paper";

function SortBy({children}) {
  return (
    <Pressable>
      <View style={styles.container}>
        <View style={styles.radio}>
          <RadioButton value="second" status="checked" />
        </View>
        <Text style={styles.text}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default SortBy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#283618",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  radio: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  text: {
    color: "white",
    fontSize: 20,
    marginLeft: 8
  }
});
