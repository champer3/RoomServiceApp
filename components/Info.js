import { StyleSheet, Text, View } from "react-native"
import { Foundation } from '@expo/vector-icons';

function Info({text}){
    return <View style={styles.container}>
        <Foundation name="info" size={24} color="grey" />
        <Text style={styles.text}>{text}</Text>
    </View>
}

export default Info

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginTop: 16,
        backgroundColor: "#FEFAE0",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        width: "100%"
    },
    text: {
        paddingLeft: 16,
        fontSize: 12,
    }
})