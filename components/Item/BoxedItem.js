import { Image, Pressable } from "react-native"
import { StyleSheet, Text, View } from "react-native"


function BoxedItem({type='normal'}){
    return <Pressable style={({pressed}) => pressed && {opacity: 0.5} }>
        <View style = {styles.container}>
        <View style = {styles.imageContainer} >
           <Image style = {styles.image} source={require('../../assets/dsBuffer.bm.png')}/>   
        </View>
        <View style = {styles.textContainer}>
        <Text style = {styles.text} >Alcohol</Text>
        </View>
    </View>
    </Pressable>
}

export default BoxedItem

const styles = StyleSheet.create({
    imageContainer: { 
                      flex: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      
                    },
    textContainer:{flex:1.25,
                    paddingHorizontal: 10},
    container :{ alignItems: 'center',
                 borderWidth: 0.5,
                 borderColor: 'grey',
                 borderRadius: 10,
                 height: 135,
                 marginHorizontal: 10, marginTop: 20, flexDirection: "row", width: 260},
    image: {maxWidth: '100%', maxHeight: '100%', resizeMode: 'center' },
    text : {fontWeight: 'bold', fontSize: 20}
})