import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from "react-native";

function Content({icon,  title, info, onPress }) {
  return (
    <Pressable onPress = {onPress} style={[styles.container ]}>
      <View style={styles.icon}>
      {icon && <View style ={{ backgroundColor: "#FAFAFA",
            padding: 20,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",marginRight: 10}}>
        {icon}
        </View>}
      <View style={styles.textContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
          {title}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: 13,
            color: "grey",
            marginTop: 5,
          }}
        >
          {info}
        </Text>
      </View>
      </View>
      <View  style={styles.radio}>
      <Ionicons name="chevron-forward-sharp" size={30} color="rgba(0,0,0,0.35)" />
      </View>
    </Pressable>
  );
}

export default Content;

const styles = StyleSheet.create({
  container: {
    borderColor: "#rgba(0,0,0,0.05)",
    borderRadius: 15,
    paddingVertical: 20,
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
    alignItems: "center",
    flexDirection: 'row'
  },
});

