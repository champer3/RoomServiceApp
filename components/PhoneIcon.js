import { StyleSheet, Text, View, TextInput, Image } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

function PhoneIcon(){
    return  <>
    <FontAwesome name="phone" size={24} color="#aaa" />
    <View style = {styles.subItem}>
    <View style = {styles.imageContainer}>
    <Image style={{borderRadius: 4, resizeMode: 'cover',width: 30, height: 20, }} source={require('../assets/dsBuffer.bmp1.png')}/>
    </View>
    <View style = {{flexDirection: "row", alignItems:"center"}}>
    {/* <Ionicons name="chevron-down-outline" size={24} color="#aaa" /> */}
    </View>
    </View>
    </>
}

export default PhoneIcon

const styles = StyleSheet.create({

    imageContainer: {
        alignItems: 'center',
       justifyContent: 'center',
    },
    subItem : {
        borderLeftWidth: 1.5 ,
        borderLeftColor: '#aaa',
        flexDirection: 'row',
        gap: 10,
        padding: 6,
        paddingRight: 0
    },
})