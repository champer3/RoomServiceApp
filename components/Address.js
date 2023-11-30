import { StyleSheet, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { useState } from "react";

function Address({ title, address }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <MaterialIcons name="location-on" size={34} color="grey" />
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontWeight: "bold", fontSize: "18", marginBottom: 5 }}>
          {title}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: "16",
            color: "grey",
            marginTop: 5,
          }}
        >
          {address}
        </Text>
      </View>
      <View style={styles.radio}>
        <RadioButton
          value="second"
          //   status={checked === "first" ? "checked" : "unchecked"}
          status="checked"
          onPress={() => setChecked("second")}
        />
      </View>
    </View>
  );
}

export default Address;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    borderColor: "grey",
    borderRadius: 15,
    height: 90,
    width: "90%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  radio: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: "50%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#FAFAFA",
    height: "100%",
    width: 60,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});
