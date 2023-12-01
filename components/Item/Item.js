import { Image, Pressable } from "react-native"
import { StyleSheet, Text, View } from "react-native"


function Item({text, image}){
    return <Pressable style={({pressed}) => pressed && {opacity: 0.5} }>
        <View style = {styles.container}>
        <View style = {styles.imageContainer} >
           <Image style = {styles.image} source={{uri: image}}/>   
        </View>
        <Text style = {styles.text} >{text}</Text>
    </View>
    </Pressable>
}

export default Item

const styles = StyleSheet.create({
    imageContainer: { width: 120,
                      height: 120, 
                      backgroundColor: '#f7eebe',
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10
                    },
    container :{alignItems: 'center', marginHorizontal: 10, marginVertical: 10},
    image: {width: 90, height: 90, resizeMode: 'contain',},
    text : {fontWeight: 'bold', fontSize: 16}
})