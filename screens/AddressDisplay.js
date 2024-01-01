import { Image, StyleSheet, Text, View, Pressable, Dimensions, Keyboard, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Review from "../components/Reviews/Review"
import Rating from "../components/Reviews/Rating"
import Pill from '../components/Pills/Pills'
import { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import IncrementDecrementBtn from "../components/Buttons/IncrementDecrementBtn";
import ProductCategory from "../components/Category/ProductCategory";
import FlexButton from "../components/Buttons/FlexButton";
import { EvilIcons } from '@expo/vector-icons';
import ProductAction from "../components/Product/ProductAction";
import Input from "../components/Inputs/Input";
import { Octicons } from '@expo/vector-icons';
import Deal from "../components/Category/Deal";
import { Fontisto } from '@expo/vector-icons';
import Address from "../components/Address";
import AddressEditable from "../components/AddressEditable";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../components/Modals/BottomSheet';
import { getAddress, getPosition } from "../util/location";
import PhoneIcon from "../components/PhoneIcon";
import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView from "react-native-maps";


const { width, height } = Dimensions.get("window");
function AddressDisplay() {
   const [address, setAddress]  = useState([])
 const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [position , setPosition] = useState(null)
    const [info, setInfo] = useState('Locating.....')
    const [show, setShow] = useState(false)
    const [tap, setTap] = useState(false)
    const navigation = useNavigation()
    const [active, setActive] = useState(false)
    const ref = useRef(null);
    const [form , setForm] = useState({
        name: '',
        nameNo: '',
        address: '',
        number: '',
        id : address.length
      })
      ref?.current?.scrollTo(-665);
    const onPress =() => {
      const isActive = ref?.current?.isActive();
      // ref?.current?.scrollTo(0);
      ref?.current?.scrollTo(-665);
    };
    
    function selectLocationHandler(event){
      const lat = event.nativeEvent.coordinate.latitude
      const lng = event.nativeEvent.coordinate.longitude
      setPosition({latitude: lat, longitude: lng})
      handleLocation()

    }
    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        if (location) {
          setPosition({latitude: location.coords.latitude,
            longitude: location.coords.longitude ,})
        }
        
          
      })();
    }, []);

    function handleFormChange(field, value) {
    if (field == 'number'){
      const cleanedInput = value.replace(/\D/g, '');

    // Add brackets dynamically based on entered digits
    let formattedNumber = '';
    for (let i = 0; i < cleanedInput.length; i++) {
      if (i === 0) {
        formattedNumber += '(';
      } else if (i === 3) {
        formattedNumber += ') ';
      } else if (i === 6) {
        formattedNumber += '-';
      }
      formattedNumber += cleanedInput[i];
    }
    value = formattedNumber
    } 
    
    setForm((prev) => ({...prev, [field]: value}));
    
  }
    function handleFormSubmit(){
        if (form.address.length > 0){
          setAddress((prev)=>{const newCard = [...prev];
            newCard[form.id] = {...form};
            return newCard
      })
            console.log(address)
            setForm({
                name: '',
                nameNo: '',
                address: '',
                number: '',
              })
            setTap(false)
        }
    }
    
    async function handleLocation(){
        if (position){
          handleFormChange('address',await getAddress(position.latitude,position.longitude))
        }
      }
    async function findLocation(){
        if (position){
          handleFormChange('address',await getAddress(location.coords.latitude,location.coords.longitude))
          setPosition({latitude: location.coords.latitude,
            longitude: location.coords.longitude ,})
            setShow(true)
        }
      }
  
    
    let text = <Text>Waiting.............</Text>
    if (errorMsg) {
      text = errorMsg;
    } else if (position) {
      
      text =  <MapView
      onPress={(e)=>{selectLocationHandler(e); onPress(); setShow(true);Keyboard.dismiss()}}
      zoomEnabled= {true}
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude:  position.latitude - 0.002,
          longitude: position.longitude,
          latitudeDelta: 0.001422,
          longitudeDelta: 0.004321,
        }}
        customMapStyle={styles.mapStyle}
      >
      {show && <Marker coordinate={{
        latitude: position.latitude,
        longitude: position.longitude,
  
      }} pinColor="#C91C1C" style={{elevation: 2}}/>}
      
      </MapView>
      
    }
function pressHandler (address){
  setTap('edit')
  setForm(address)
  console.log(form)
}
function addHandler (){
  setTap('add')
  console.log(show)
}
  
  return (
    <View style={{flex: 1}}>
        
        {!tap && <ScrollView style={{paddingBottom: '50%' }}>
        
        <View style={styles.recommendedView}>
           {address.length > 0 && address.map(({name, address}, idx) => <View  key={idx}><Pressable onPress={()=>pressHandler(address[idx])} ><AddressEditable address={address} title={name} /></Pressable></View>)}
           {!address.length && <View  style={{gap: 19, marginBottom: 45}}><View><Image style={styles.image} source={require('../assets/empty.png')}/></View><Text style={{textAlign: 'center'}}>You currently have no saved address, add one to ease your order delivery.</Text></View>}
           <View style={[{height: 75}]}>
                <FlexButton onPress={()=> {addHandler(); onPress()}}><Text style={{fontSize: 18}}>Add new address</Text></FlexButton>
            </View>
        </View>
        
        </ScrollView>}
        {tap  && <><View style={{flex: 1}}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          
        <View style={styles.container}>
        {text}
          {/* <TouchableOpacity style={styles.button} onPress={onPress} /> */}
          <BottomSheet ref={ref}>
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%' }} >
              {tap== 'add' && <><View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>Add an Address</Text></View>
              <Input text={'Address Name'} textInputConfig={{cursorColor: '#aaa',value: form.name, onChangeText: handleFormChange.bind(this, 'name')}}/>
              <Input text={'Address'} onPress={()=>findLocation()} type="address" textInputConfig={{cursorColor: '#aaa',value: form.address, onChangeText: handleFormChange.bind(this, 'address')}}/>
              <Input text={'Contact Name'} textInputConfig={{cursorColor: '#aaa',value: form.nameNo, onChangeText: handleFormChange.bind(this, 'nameNo')}}/>
              <Input keyboard="number-pad" length={14} icon={<PhoneIcon/>} text={'Contact Number'} textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}}/>
              <View style ={{marginTop: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default address</Text>
              </View></>}
              {tap == 'edit' && <><View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>{form.name}</Text><Pressable style={({pressed}) => pressed && {opacity: 0.5}}><View style ={{flexDirection: 'row', gap:6, alignItems: 'center'}}><Octicons name="trash" size={24} color="#B22334" /><Text style={{fontWeight: 'bold', color: '#B22334'}}>Delete Address</Text></View></Pressable></View>
              <Input text={'Address Name'} textInputConfig={{cursorColor: '#aaa',value: form.name, onChangeText: handleFormChange.bind(this, 'name')}}/>
              <Input text={'Address'} onPress={()=>findLocation()} type="address" textInputConfig={{cursorColor: '#aaa',value: form.address, onChangeText: handleFormChange.bind(this, 'address')}}/>
              <Input text={'Contact Name'} textInputConfig={{cursorColor: '#aaa',value: form.nameNo, onChangeText: handleFormChange.bind(this, 'nameNo')}}/>
              <Input keyboard="number-pad" length={14} icon={<PhoneIcon/>} text={'Contact Number'} textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}}/>
            <View style ={{marginTop: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default address</Text>
              </View></>}
            </View>
          </BottomSheet>
          
        </View>
        
      </GestureHandlerRootView>
      </View>
      <View style={{flex: 1, width: '100%', height: '15%', paddingHorizontal: '5%',  paddingVertical: '4%', position: "absolute",bottom: 0, zIndex: 2, backgroundColor: 'white' ,  justifyContent: "space-around",}}>
              <View style={[styles.recommendedView, {height: '100%'}]}>
                  <FlexButton onPress={handleFormSubmit} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
              </View>
              
                  
      
          </View>
      </>}
      

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
  map: {
    ...StyleSheet.absoluteFillObject,
    color: 'black',
    flex: 1,
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'red',
    opacity: 0.6,
  },
  mapStyle: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]
});