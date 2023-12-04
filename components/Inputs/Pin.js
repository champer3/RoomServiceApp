import { StyleSheet, View, TextInput } from "react-native"

function Pin(){

    return  <View style = {styles.container} >
        <TextInput style={styles.pinContainer} keyboardType="number-pad" maxLength={1} selectionColor={'#aaa'}/>
    </View>
}
export default Pin

const styles = StyleSheet.create({
        container : {
            height: 49,
            width: 54,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 8
        },
        pinContainer:{
            height: 59,
            width: 65,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: '400'
        }
})