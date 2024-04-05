import { StyleSheet, View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';

function AddressEditable({ title, address, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.icon}>
        <View style ={{ backgroundColor: "#FAFAFA",
            padding: 10,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",}}>
        <MaterialIcons name="location-on" size={30} color="grey" />
        </View>
        <View style={styles.textContainer}>
        
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
          {title}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: 14,
            color: "grey",
            marginTop: 5,
          }}
        >
          {address.substring(0, 33) + (address.length > 33 ? '...' : '')}
        </Text>
      </View>
      </View>
      
      <Pressable onPress={onPress} style={styles.radio}>
      <Feather name="edit-3" size={30} color="#BC6C25" />
      </Pressable>
    </Pressable>
  );
}

export default AddressEditable;

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
