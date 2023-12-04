import { Pressable, StyleSheet, Text, View } from "react-native"
import { RadioButton } from "react-native-paper"

function CardCat({children}){
    return <Pressable>
        <View style={styles.container}>
        <View style={styles.radio}>
        <RadioButton
          value="second"
          status="checked"
        />
      </View>
      <Text>{children}</Text>
        </View>
    </Pressable>
}

export default CardCat

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FAFAFA",
        borderRadius: 16,
        padding: 16,
        paddingHorizontal: 32,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    radio: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8
      },
})