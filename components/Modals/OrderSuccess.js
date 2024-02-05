import { Image, StyleSheet, Text, View, Dimensions } from "react-native"
import BareButton from "../Buttons/BareButton";
import FlexButton from "../Buttons/FlexButton";
import { useNavigation , useRoute} from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

function OrderSuccess({onPress, onMove}){
    
    return <View style={styles.container}>
            <Image style={{maxWidth: width / 3.8,height: height / 7, resizeMode: 'contain', marginBottom: 20}} source={require('../../assets/Group.png')} />
        <View style={styles.textContainer}>
            <Text style={styles.topText}>Order Successful</Text>
            <Text style={styles.text}>Your order has been received and will be delivered shortly</Text>
        </View>
        <View style={[styles.buttonContainer, {
            marginBottom: 8
        }]}>
          <FlexButton onPress={onMove} background={'#283618'}>
            <Text style={{color: 'white'}}>View order</Text>
          </FlexButton>
        </View>
        <View style={[styles.buttonContainer, {
            }]}>
          <BareButton onPress={onPress} background={'#F9F9F9'} color={'white'}>
            <Text style ={{color : "#0F1219"}}>Order receipt</Text>
          </BareButton>
        </View>
    </View>
}

export default OrderSuccess

const styles = StyleSheet.create({
    container: {
        height: height / 1.8,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 35,
        paddingHorizontal: 30,
        shadowColor: 'black',
        shadowOffset: {
            width: 10,
            height: 100
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        zIndex: 4
    },buttonContainer: {
        width: width/1.3,
        height: 65,
      },
    textContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 28
    },
    topText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#283618",
        textAlign: 'center'
    },
    text: {
        fontSize: 12,
        fontWeight: "700",
        color: "#0F1219",
        opacity: 0.7,
        textAlign: 'center',
    }
})