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
  import { getAddress, getPosition } from "../util/location";
  import Input from "../components/Inputs/Input";
  import PhoneIcon from "../components/PhoneIcon";
  import FlexButton from "../components/Buttons/FlexButton";
  import { Entypo } from '@expo/vector-icons';
  import { useNavigation } from "@react-navigation/native";
  
  
  export default function AddAddressScreen() {
      const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [position , setPosition] = useState(null)
    const [info, setInfo] = useState('Locating.....')
    const [show, setShow] = useState(false)
    const navigation = useNavigation()
    const [active, setActive] = useState(false)
    const ref = useRef(null);
    const [form , setForm] = useState({
        name: '',
        nameNo: '',
        address: '',
        number: '',
      })
    ref?.current?.scrollTo(-665);
    const onPress = useCallback(() => {
      const isActive = ref?.current?.isActive();
      // ref?.current?.scrollTo(0);
      ref?.current?.scrollTo(-665);
    }, []);
    
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
            navigation.navigate('Address', form)
            setForm({
                name: '',
                nameNo: '',
                address: '',
                number: '',
              })
        }
    }
    const onLayoutRootView = useCallback(async () => {
        await SplashScreen.hideAsync();
    }, [text]);
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
//    useEffect(()=>{   
//       async function handleLocation(){
//         if (position){
//           setInfo(await getAddress(position.latitude,position.longitude))
//           console.log(info)
//         }
//       }
//     }, [position])
  
    
    let text = <Text>Waiting.............</Text>
    SplashScreen.preventAutoHideAsync();
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
  
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
        <View style={{flex: 1}}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          
        <View style={styles.container}>
        {text}
          {/* <TouchableOpacity style={styles.button} onPress={onPress} /> */}
          
          <BottomSheet ref={ref}>
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%' }} >
              <View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>Add an Address</Text></View>
              <Input text={'Address Name'} textInputConfig={{cursorColor: '#aaa',value: form.name, onChangeText: handleFormChange.bind(this, 'name')}}/>
              <Input text={'Address'} onPress={()=>findLocation()} type="address" textInputConfig={{cursorColor: '#aaa',value: form.address, onChangeText: handleFormChange.bind(this, 'address')}}/>
              <Input text={'Contact Name'} textInputConfig={{cursorColor: '#aaa',value: form.nameNo, onChangeText: handleFormChange.bind(this, 'nameNo')}}/>
              <Input keyboard="number-pad" length={14} icon={<PhoneIcon/>} text={'Contact Number'} textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}}/>
              <View style ={{marginTop: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default address</Text>
              </View>
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
          </KeyboardAvoidingView>
          
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