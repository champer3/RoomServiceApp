import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

function DeliveryMode({ mode, time, active= false, special}) {
  return (
    <View style={[styles.container, {borderColor: active ? 'black' : 'rgba(0,0,0,0.05)'}]}>
      <View style={styles.topView}>
        <MaterialIcons name="timer" size={24} color="black" />
        <Ionicons name={`${active ? "radio-button-on" : "radio-button-off"  }`} size={24} color="black" />
      </View>
      <View>
        <Text style={styles.text}>{mode}</Text>
      </View>
      <View style={styles.downView}>
      <Fontisto name="flash" size={24} color={`${special ? "green" : "black"  }`} />
      <View style={styles.innerView}>
        <Text style={[styles.minitext, {color: special ? 'green' : 'black'}]}>{time}</Text>
      </View>
      </View>
    </View>
  );
}

export default DeliveryMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderRadius: 16,
    gap: 10,
    height: '100%',
  },
  topView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downView: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  innerView: {
    overflow: 'hidden',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  minitext: {
    fontSize: 12
  },
});
