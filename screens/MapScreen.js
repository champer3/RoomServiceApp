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
import { getAddress } from "../util/location";
import Input from "../components/Inputs/Input";
import PhoneIcon from "../components/PhoneIcon";
import FlexButton from "../components/Buttons/FlexButton";
import { Entypo } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const route = useRoute()
  const [errorMsg, setErrorMsg] = useState(null);
  const [position , setPosition] = useState(null)
  const [info, setInfo] = useState('Hey wassup')
  const ref = useRef(null);
  const [active, setActive] = useState(false)
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
  const onLayoutRootView = useCallback(async () => {
      await SplashScreen.hideAsync();
  }, [text]);

  useEffect(()=>{
    async function handleLocation(){
      if (position){
        setInfo(await getAddress(position.latitude,position.longitude))
      }
    }
    handleLocation()
  }, [position])

  
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
        latitudeDelta: 0.001422,
        longitudeDelta: 0.004321,
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex: 1}}>
      <View style={{flex: 1}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        
      <View style={styles.container}>
      {text}
        {/* <TouchableOpacity style={styles.button} onPress={onPress} /> */}
        
        <BottomSheet ref={ref}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%' }} >
            <View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>My Apartment</Text><Pressable style={({pressed}) => pressed && {opacity: 0.5}}><View style ={{flexDirection: 'row', gap:6, alignItems: 'center'}}><Octicons name="trash" size={24} color="#B22334" /><Text style={{fontWeight: 'bold', color: '#B22334'}}>Delete Address</Text></View></Pressable></View>
            <Input text={'Address Name'}/>
            <Input text={'Address'} type="address"/>
            <Input text={'Contact Name'}/>
            <Input icon={<PhoneIcon/>} text={'Contact Number'}/>
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
                <FlexButton background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
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