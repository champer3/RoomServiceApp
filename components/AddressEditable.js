import { StyleSheet, View,Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Text from "./Text";
import { Feather } from '@expo/vector-icons';

function AddressEditable({ title, address, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.icon}>
        <View style ={{ 
            padding: 0,
            justifyContent: "center",
            alignItems: "center",}}>
        <MaterialIcons name="location-on" size={30} color="black" />
        </View>
        <View style={styles.textContainer}>
        <Text
          style={{
            fontSize: 14,
            color: "black",
            marginTop: 5,
          }}
        >
          {address.substring(0, 33) + (address.length > 33 ? '...' : '')}
        </Text>
      </View>
      </View>
    </Pressable>
  );
}

export default AddressEditable;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#rgba(0,0,0,0.05)",
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  radio: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row'
  },
});
