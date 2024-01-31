import { Image, StyleSheet, Text, View, Pressable, Dimensions, Keyboard, ScrollView } from "react-native";
import FlexButton from "../components/Buttons/FlexButton";
import AddressEditable from "../components/AddressEditable";
import {useSelector, useDispatch} from 'react-redux'
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
function AddressDisplay() {
  const navigation = useNavigation()
  const address = useSelector((state) => state.profileData.profile).address
  function addHandler (){
    navigation.navigate('Add Address')
} 
  function pressHandler (address){
    console.log(address)
    navigation.navigate('Map', address)
} 
    
  return (
    <View style={{flex: 1}}>
        
        <ScrollView style={{paddingBottom: '50%' }}>
        
        <View style={styles.recommendedView}>
           {address.length > 0 && address.map(({name, address, nameNo, id, number}, idx) => <View  key={idx}><Pressable onPress={()=>pressHandler({name, address, nameNo, id, number})} ><AddressEditable address={address} title={name} /></Pressable></View>)}
           {!address.length && <View  style={{gap: 19, marginBottom: 45}}><View><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>You currently have no saved address, add one to ease your order delivery.</Text></View>}
           <View style={[{height: 75}]}>
                <FlexButton onPress={()=> {addHandler()}}><Text style={{fontSize: 18}}>Add new address</Text></FlexButton>
            </View>
        </View>
        
        </ScrollView>
    </View>
  );
}
export default AddressDisplay

const styles = StyleSheet.create({
    catHead: {
        justifyContent: "space-between",
        gap: 19
      },
      text: { fontWeight: "600", fontSize: 20, marginBottom: 20 },
  recommendedView: {
    paddingHorizontal: '5%', paddingTop: '5%', gap: 20
  },
  image: {
    height: height / 3,
    alignSelf: "center",
    resizeMode: 'contain'
  },container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'red',
    opacity: 0.6,
  },
 
});