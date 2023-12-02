import { StyleSheet, View, Text, Pressable } from "react-native";

function SearchCat({ children, onPress }) {
  return (
    <Pressable onPress={onPress} >
      <View style={styles.container}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default SearchCat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#283618",
    padding: 16,
    borderRadius: 16,
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
