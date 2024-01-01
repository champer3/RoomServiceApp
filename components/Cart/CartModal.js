import { StyleSheet, Text, View } from "react-native"
import { Feather } from '@expo/vector-icons';

function CartModal(){
    return <View style={styles.container}>
        <View style={styles.iconContainer}>
        <Feather name="shopping-cart" size={30} color="white" />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.topText}>Success</Text>
            <Text style={styles.text}>Product has been added to cart, click to checkout</Text>
        </View>
    </View>
}

export default CartModal

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: "100%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        padding: 16,
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.4,
        shadowRadius: 5
    },
    iconContainer: {
        height: 65,
        width: 65,
        borderRadius: 50,
        flex: 1,
        backgroundColor: '#283618',
        justifyContent: "center",
        alignItems: "center"
    },
    textContainer: {
        flex: 4,
        justifyContent: "center",
        alignItems: "flex-start",
        marginLeft: 10
    },
    topText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#283618",
        marginBottom: 5
    },
    text: {
        fontSize: 14,
        fontWeight: "300",
        color: "#283618",
        opacity: 0.7
    }
})