import { Pressable, StyleSheet, Text, View } from "react-native"
import { RadioButton } from "react-native-paper"
import { Ionicons } from '@expo/vector-icons';

function CardCat({children, active}){
    return <View style={[styles.container, {borderColor: active ? 'black' : 'rgba(0,0,0,0.05)', borderWidth: active ? 2 : 0 }]}>
        <View style={styles.radio}>
        <Ionicons name={`${active ? "md-radio-button-on" : "md-radio-button-off"  }`} size={24} color="black" />
      </View>
      <Text>{children}</Text>
        </View>
}

export default CardCat

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FAFAFA",
        borderRadius: 16,
        paddingHorizontal: 32,
        paddingVertical: 25,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    radio: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8
      },
})