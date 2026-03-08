import { StyleSheet, View, Modal, Animated , Dimensions, Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ActivityIndicator} from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Text from '../components/Text';

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const route = useRoute()
    const orders = useSelector((state) => state.orders.ids)
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const [results, setResults] = useState()
    const data = useSelector((state) => state.profileData.profile)
  const [errorMsg, setErrorMsg] = useState(null);
  const [position , setPosition] = useState(null)
  const [info, setInfo] = useState('Hey wassup')
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [active, setActive] = useState(false)
  ref?.current?.scrollTo(-705);
  const [form , setForm] = useState(route.params ? { ...route.params } : { name: '', address: '', nameNo: '', number: '', id: 0 })
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    // ref?.current?.scrollTo(0);
    ref?.current?.scrollTo(-705);
  }, []);
  const [saveError, setSaveError] = useState(null)
  const suggestionTimeoutRef = useRef(null)

  function handleFormChange(field, value) {
    if (field == 'number'){
      const cleanedInput = value.replace(/\D/g, '');
      let formattedNumber = '';
      for (let i = 0; i < cleanedInput.length; i++) {
        if (i === 0) formattedNumber += '(';
        else if (i === 3) formattedNumber += ') ';
        else if (i === 6) formattedNumber += '-';
        formattedNumber += cleanedInput[i];
      }
      value = formattedNumber
    } else if (field == 'address'){
      setSaveError(null)
      if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current)
      if ((value || '').trim().length >= 2) {
        suggestionTimeoutRef.current = setTimeout(() => showSuggestion(value), 300)
      } else {
        setResults([])
      }
    }
    setForm((prev) => ({...prev, [field]: value}));
  }
  async function showSuggestion(value) {
    const m = await searchAddress(value)
    setResults(Array.isArray(m) ? m : [])
  }
  async function handleLocation(lat, lng) {
    try {
      const m = await getAddress(lat, lng)
      if (m) setForm((prev) => ({ ...prev, address: m }))
    } catch (e) { console.warn(e?.message) }
  }
  function selectLocationHandler(event){
    const lat = event.nativeEvent.coordinate.latitude
    const lng = event.nativeEvent.coordinate.longitude
    setPosition({latitude: lat, longitude: lng})
    handleLocation(lat,lng)
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

  async function validateAddress() {
    setSaveError(null)
    const addr = (form.address || '').trim()
    if (!addr) {
      setSaveError('Please enter an address.')
      return
    }
    setIsLoading(true)
    const locationT = await getPosition(form.address)
    if (!locationT?.lat) {
      setIsLoading(false)
      setSaveError('Address not found. Please check the address or try selecting a suggestion.')
      return
    }
    const m = await getAddress(locationT.lat, locationT.lng) || form.address
    setPosition({ latitude: locationT.lat, longitude: locationT.lng })
    setLocation({ coords: { longitude: locationT.lng, latitude: locationT.lat } })
    const newData = { ...data, address: [] }
    const addresses = data?.address || []
    for (let i = 0; i < addresses.length; i++) {
      if (i !== form.id) {
        newData.address.push(addresses[i])
      } else {
        newData.address.push({ ...form, address: m })
      }
    }
    dispatch(updateProfile({ id: newData }))
    let newAddress = newData
    if (active) {
      setActive(false)
      newAddress = makeDefault(form.id)
    }
    try {
      await AsyncStorage.setItem('essential', JSON.stringify({ address: newAddress.address, orders }))
    } catch (e) { console.error('Error saving token:', e) }
    setIsLoading(false)
    navigation.navigate('Address')
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const addr = route.params?.address
      if (!addr) {
        setPosition({ latitude: 37.78825, longitude: -122.4324 })
        setLocation({ coords: { latitude: 37.78825, longitude: -122.4324 } })
        return
      }
      const locationT = await getPosition(addr)
      if (cancelled) return
      if (locationT?.lat) {
        setLocation({ coords: { longitude: locationT.lng, latitude: locationT.lat } })
        setPosition({ latitude: locationT.lat, longitude: locationT.lng })
      } else {
        setPosition({ latitude: 37.78825, longitude: -122.4324 })
        setLocation({ coords: { latitude: 37.78825, longitude: -122.4324 } })
      }
    })()
    return () => { cancelled = true }
  }, [route.params?.address])

  async function findLocation() {
    try {
      const loc = await Location.getCurrentPositionAsync({})
      const coords = loc?.coords
      if (!coords) return
      const m = await getAddress(coords.latitude, coords.longitude)
      if (m) setForm((prev) => ({ ...prev, address: m }))
      setPosition({ latitude: coords.latitude, longitude: coords.longitude })
      setLocation(loc)
    } catch (e) {
      console.warn('findLocation:', e?.message)
    }
  }
  function makeDefault(id) {
    const addresses = data?.address || []
    const newData = { ...data, address: [{ ...addresses[id], id: 0 }] }
    let j = 1
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].id != id) {
        newData.address.push({ ...addresses[i], id: j })
        j += 1
      }
    }
    dispatch(updateProfile({ id: newData }))
    return newData
  }
  function deleteAndUpdate() {
    const addresses = data?.address || []
    const newData = { ...data, address: [] }
    let j = 0
    for (let i = 0; i < addresses.length; i++) {
      if (i != form.id) {
        newData.address.push({ ...addresses[i], id: j })
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

  
  let text = <ActivityIndicator size="large" color="#0000ff" />
  SplashScreen.preventAutoHideAsync();
  if (errorMsg) {
    text = errorMsg;
  } else if (position && location?.coords) {
    const region = {
      latitude: position.latitude,
      longitude: position.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }
    text =  <MapView
      ref={mapRef}
      onPress={(e)=>{selectLocationHandler(e); onPress(); Keyboard.dismiss()}}
      zoomEnabled={true}
      style={styles.map}
      initialRegion={region}
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
       {isLoading ? (
        // Render loading indicator while loading
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" /></View>
      ) : (<><View style={{flex: 1}}>
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
                          {results.slice(0, 4).map((address, index) => (
                            <Pressable
                              key={index}
                              onPress={async () => {
                                const selectedAddr = results[index]
                                setForm((prev) => ({ ...prev, address: selectedAddr }))
                                setResults([])
                                Keyboard.dismiss()
                                const pos = await getPosition(selectedAddr)
                                if (pos?.lat) {
                                  setPosition({ latitude: pos.lat, longitude: pos.lng })
                                  setLocation({ coords: { latitude: pos.lat, longitude: pos.lng } })
                                  setTimeout(() => {
                                    mapRef.current?.animateToRegion({
                                      latitude: pos.lat,
                                      longitude: pos.lng,
                                      latitudeDelta: 0.005,
                                      longitudeDelta: 0.005,
                                    }, 350)
                                  }, 100)
                                }
                              }}
                              style={{ flexDirection: 'row', gap: 10, marginBottom: 10, width: '90%', padding: 10 }}
                            >
                              <Octicons name="location" size={24} color="black" />
                              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{address}</Text>
                            </Pressable>
                          ))}
                        </View>}
              {saveError ? <Text style={{ color: '#B22334', marginTop: 6 }}>{saveError}</Text> : null}
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
    </View></>)}
        </View>
        
  );
}

//create our styling code:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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