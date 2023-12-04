import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';
import { RadioButton } from "react-native-paper";

function DeliveryMode({ mode, time }) {
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <MaterialIcons name="timer" size={24} color="black" />
        <RadioButton value="second" status="checked" />
      </View>
      <View>
        <Text style={styles.text}>{mode}</Text>
      </View>
      <View style={styles.downView}>
      <Fontisto name="flash" size={24} color="black" />
      <View style={styles.innerView}>
        <Text style={styles.text}>{time}</Text>
        <Text style={styles.text}>Minutes</Text>
      </View>
      </View>
    </View>
  );
}

export default DeliveryMode;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    width: 150,
    borderColor: "black",
    borderRadius: 16,
    opacity: 0.8,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerView: {
    // marginLeft: 8
  },
  radio: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  text: {
    fontSize: 20
  }
});
