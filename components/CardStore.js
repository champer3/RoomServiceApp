import { StyleSheet, View, Text, Image } from "react-native";
import { RadioButton } from "react-native-paper";

function CardStore({ card, number }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
      <Image style={styles.image} source={require("../assets/mastercard.png")} />
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontWeight: "bold", fontSize: "18", marginBottom: 5 }}>
          {card}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: "16",
            color: "grey",
            marginTop: 5,
          }}
        >
          {number} **** **** ****
        </Text>
      </View>
      <View style={styles.radio}>
        <RadioButton
          value="second"
          //   status={checked === "first" ? "checked" : "unchecked"}
          status="checked"
        />
      </View>
    </View>
  );
}

export default CardStore;

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
    flex: 4,
    alignItems: "flex-start",
    marginLeft: 8
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
    flex: 1,
    height: "100%",
    width: 60,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "75%",
    height: "50%",
    backgroundColor: "white",
    marginBottom: 12
  },
});
