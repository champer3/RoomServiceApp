import { StyleSheet, Text, View } from "react-native"

function Recent({text}){
    return <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.line}></View>
    </View>
}

export default Recent

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: 16,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    line: {
        height: 0.5,
        backgroundColor: 'grey',
        opacity: 0.5,
        width: "100%"
    },
    text: {
        fontSize: 20,
        fontWeight: "300"
    }
})