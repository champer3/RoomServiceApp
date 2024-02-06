import { StyleSheet, Text, View, Modal, Animated , Dimensions, Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable} from "react-native";
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import { Marker } from "react-native-maps";
import { Polyline } from "react-native-maps";
import { Octicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {TouchableOpacity} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../components/Modals/BottomSheet';
import { getAddress, getPosition, searchAddress } from "../util/location";
import Input from "../components/Inputs/Input";
import PhoneIcon from "../components/PhoneIcon";
import FlexButton from "../components/Buttons/FlexButton";
import { Entypo } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {useSelector, useDispatch} from 'react-redux'
import { updateProfile } from "../Data/profile";
  

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const route = useRoute()
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const [results, setResults] = useState()
    const data = useSelector((state) => state.profileData.profile)
  const [errorMsg, setErrorMsg] = useState(null);
  const [position , setPosition] = useState(null)
  const [info, setInfo] = useState('Hey wassup')
  const ref = useRef(null);
  const [active, setActive] = useState(false)
  ref?.current?.scrollTo(-705);
  const [form , setForm] = useState(route.params)
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    // ref?.current?.scrollTo(0);
    ref?.current?.scrollTo(-705);
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
    
    else if (field == 'address'){
      showSuggestion(value)
    }
    
    setForm((prev) => ({...prev, [field]: value}));
    
  }
  async function showSuggestion(value){
    const m = await searchAddress(value)
    setResults(m)
  }
  async function handleLocation(lat, lng){
      const m = await getAddress(lat, lng)
      handleFormChange('address',m)
  }
  function selectLocationHandler(event){
    const lat = event.nativeEvent.coordinate.latitude
    const lng = event.nativeEvent.coordinate.longitude
    setPosition({latitude: lat, longitude: lng})
    handleLocation(lat,lng)
  }
  async function validateAddress(){
    let locationT = await getPosition(form.address);
    if (locationT.lat){
      setPosition({latitude: locationT.lat, longitude: locationT.lng})
      setLocation({coords: {longitude: locationT.lng, latitude: locationT.lat}});
    const m = await getAddress(locationT.lat, locationT.lng)
    handleFormChange('address',m)
    const newData = { ...data, ['address'] : [] };
      for (let i = 0; i < data.address.length; i++) {
        // If the current index is less than the specified index, copy the existing payment
        if (i !== form.id) {
          newData.address.push(data.address[i])
        }
        // If the current index is equal to the specified index, append the form data
        else if (i === form.id) {
          newData.address.push({...form, ['address']: m})
        }
      }
      // Return the new data object
      dispatch(updateProfile({id : newData}))
      if (active){
        setActive(false)
        makeDefault(form.id)
      }
    
        navigation.navigate('Address')
  }
    else{
      return false
    }
    
  }
  useEffect(() => {
    (async () => {
      
      
      let locationT = await getPosition(route.params.address);
      
      setLocation({coords: {longitude: locationT.lng, latitude: locationT.lat}});
      if (locationT) {
        setPosition({latitude: locationT.lat,
          longitude: locationT.lng })
      }
    })();
  }, []);
  const onLayoutRootView = useCallback(async () => {
      await SplashScreen.hideAsync();
  }, [text]);

  async function findLocation(){
    if (position){
      const m = await getAddress(location.coords.latitude,location.coords.longitude)
      handleFormChange('address',m)
      setPosition({latitude: location.coords.latitude,
        longitude: location.coords.longitude ,})
    }
  }
  function makeDefault(id){
    const newData = { ...data, ['address'] : [{...data.address[id], ['id']: 0}] };
    var j = 1
    for (let i = 0; i < data.address.length; i++) {
      // If the current index is less than the specified index, copy the existing payment
      if (data.address[i].id != id) {
        newData.address.push({...data.address[i], ['id']: j})
        j += 1
      }
      
    }
    dispatch(updateProfile({id : newData}))
  }
  function deleteAndUpdate() {
    // Delete the object at the specified index
    const newData = { ...data, ['address'] : [] };
    var j = 0
    for (let i = 0; i < data.address.length; i++) {
      // If the current index is less than the specified index, copy the existing payment
      if (i != form.id) {
        newData.address.push({...data.address[i], ['id']: j})
        j += 1
      }
      
    }
    // Update the id property of other objects


  // Return the new data object
  dispatch(updateProfile({id : newData}))
  navigation.navigate('Address')
  }
  // function handleFormSubmit(){
  //   if (form.address.length > 0){
  //     const newData = { ...data, ['address'] : [] };
  //     for (let i = 0; i < data.address.length; i++) {
  //       // If the current index is less than the specified index, copy the existing payment
  //       if (i !== form.id) {
  //         newData.address.push(data.address[i])
  //       }
  //       // If the current index is equal to the specified index, append the form data
  //       else if (i === form.id) {
  //         newData.address.push({...form})
  //       }
  //     }
  //     // Return the new data object
  //     dispatch(updateProfile({id : newData}))
  //     if (active){
  //       setActive(false)
  //       makeDefault(form.id)
  //     }
    
  //       // navigation.navigate('Address')
  //     }
  //   }

  
  let text = <Text>Waiting.............</Text>
  SplashScreen.preventAutoHideAsync();
  if (errorMsg) {
    text = errorMsg;
  } else if (position) {
    
    text =  <MapView
    onPress={(e)=>{selectLocationHandler(e); onPress(); Keyboard.dismiss()}}
    zoomEnabled= {true}
      style={styles.map}
      //specify our coordinates.
      initialRegion={{
        latitude:  location.coords.latitude - 0.002,
        longitude: location.coords.longitude,
        latitudeDelta: 0.001002,
        longitudeDelta: 0.003401,
      }}
      customMapStyle={styles.mapStyle}
    >
    <Marker coordinate={{
      latitude: position.latitude,
      longitude: position.longitude,

    }} pinColor="#C91C1C" style={{elevation: 2}}/>
    
    </MapView>
    
  }
  return (
    <View
    style={{flex: 1}}>
      <View style={{flex: 1}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        
      <View style={styles.container}>
      {text}
        {/* <TouchableOpacity style={styles.button} onPress={onPress} /> */}
        
        <BottomSheet ref={ref}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%' }} >
            <View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>{form.name}</Text><Pressable onPress={deleteAndUpdate} style={({pressed}) => pressed && {opacity: 0.5}}><View style ={{flexDirection: 'row', gap:6, alignItems: 'center'}}><Octicons name="trash" size={24} color="#B22334" /><Text style={{fontWeight: 'bold', color: '#B22334'}}>Delete Address</Text></View></Pressable></View>
            <Input text={'Address Name'} textInputConfig={{cursorColor: '#aaa',value: form.name, onChangeText: handleFormChange.bind(this, 'name')}}/>
            <View>
              <Input text={'Address'} onPress={()=>{findLocation(); Keyboard.dismiss()}} type="address" textInputConfig={{cursorColor: '#aaa',value: form.address, onChangeText: handleFormChange.bind(this, 'address')}}/>
              {results && results.length > 0 && <View style={{ zIndex: 2, backgroundColor: 'white' , width: '100%', paddingTop: 10, marginHorizontal: 10, alignSelf: 'center',  backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, marginTop: 7 }}>
                          {results.slice(0, 4).map((address, index) => (<Pressable onPress={() => {handleFormChange('address', results[index]); Keyboard.dismiss()}} key={index} style={{flexDirection: 'row', gap: 10, marginBottom: 10,  width: '90%', padding: 10}}>
                            <Octicons name="location" size={24} color="black" />
                            {/* <ScrollView horizontal> */}
                            <Text style={{fontSize: 16, fontWeight: 'bold',}} >{address}</Text>
                            {/* </ScrollView> */}
                            </Pressable>
                            
                          ))}
                        </View>}
              </View><Input text={'Contact Name'} textInputConfig={{cursorColor: '#aaa',value: form.nameNo, onChangeText: handleFormChange.bind(this, 'nameNo')}}/>
              <Input keyboard="number-pad" length={14} icon={<PhoneIcon/>} text={'Contact Number'} textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}}/>
              <View style ={{marginTop: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default address</Text>
              </View>
              <View style={[styles.recommendedView, {height: 65, marginTop: 30}]}>
                  <FlexButton onPress={validateAddress} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
              </View>
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
    </View>
        </View>
        
  );
}

//create our styling code:
const styles = StyleSheet.create({
  container: {
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