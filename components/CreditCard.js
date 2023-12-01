import { Image, View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function CreditCard({ card, number }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require("../assets/mastercard.png")} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.card}>{card}</Text>
          <Text style={styles.number}>{number} **** **** ****</Text>
        </View>
      </View>
      <View style={styles.right}>
        <AntDesign name="edit" size={24} color="#BC6C25" />
      </View>
    </View>
  );
}

export default CreditCard;

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    borderRadius: 16,
    paddingHorizontal: 16
  },
  left: {
    flex: 8,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  right: {
    flex: 1
  },
  imageContainer: {
    flex: 1,
    height: "80%",
    width: 40,
    backgroundColor: "#FAFAFA",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: 4

  },
  textContainer: {
    flex: 3
  },
  image: {
    width: "75%",
    height: "50%",
    backgroundColor: "white",
    marginBottom: 12
  },
  card: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6
  },
  number: {
    fontSize: 12,
    fontWeight: '300',
    color: "#333333"
  },

});
