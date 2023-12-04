import { StyleSheet, Text, View, TextInput, Image } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

function PhoneIcon(){
    let image = ''
    return  <>
    <FontAwesome name="phone" size={24} color="#aaa" />
    <View style = {styles.subItem}>
    <View style = {styles.imageContainer}>
    <Image style={{borderRadius: 4, resizeMode: 'cover',width: 30, height: 20, }} source={{uri:image}}/>
    </View>
    <View style = {{flexDirection: "row", alignItems:"center"}}>
    <Text>+1{`${code}`}</Text>
    <Ionicons name="chevron-down-outline" size={24} color="#aaa" />
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