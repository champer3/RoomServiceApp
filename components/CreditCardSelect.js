import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

function CreditCardSelect({ card, number, active= false,image }) {
  return (
    <View style={[styles.container,{borderColor: active ? 'black' : 'rgba(0,0,0,0.05)'}]}>
      <View style={styles.left}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.card}>{card}</Text>
          <Text style={styles.number}>{number} **** **** ****</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Ionicons name={`${active ? "md-radio-button-on" : "md-radio-button-off"  }`} size={30} color="black" />
      </View>
    </View>
  );
}

export default CreditCardSelect;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#rgba(0,0,0,0.05)",
    borderRadius: 15,
    padding: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
  },
  left: {
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row'
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 'auto',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  textContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  image: {
    resizeMode: 'contain',
    maxWidth: width / 10,
    height: height / 20,
    alignSelf: "center",
  },
  card: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6
  },
  number: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '400',
    color: "#333333"
  },

});
