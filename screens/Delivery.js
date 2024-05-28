import { StyleSheet,  View, Modal, Animated , Dimensions, Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Image} from "react-native";
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import { Marker } from "react-native-maps";
import { Polyline } from "react-native-maps";
import { Octicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getAddress, getPosition, searchAddress, getDirections } from "../util/location";
import { useRoute } from "@react-navigation/native";
import Text from '../components/Text';

export default function Delivery() {
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState([]);
    const route = useRoute()
  const [errorMsg, setErrorMsg] = useState(null);
  const [position , setPosition] = useState(null)
  const [driver, setDriver] = useState(null)
  useEffect(() => {
    //fetch the coordinates and then store its value into the coords Hook.
    if(position && driver){
    getDirections(`${position.latitude},${position.longitude}`, `${driver.latitude},${driver.longitude}`)
      .then(coords => setCoords(coords))
      .catch(err => console.log("Something went wrong"));}
  }, [coords, position,driver]);
  useEffect(() => {
   try{ (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      if (location) {
        setDriver({latitude: location.coords.latitude,
          longitude: location.coords.longitude ,})
      }
      
        
    })()} catch (error) {console.error("Error:", error);};
  }, []);
  useEffect(() => {
   try{ (async () => {
      
      let locationT = await getPosition(route.params.address);
      setLocation({coords: {longitude: locationT.lng, latitude: locationT.lat}});
      if (locationT) {
        setPosition({latitude: locationT.lat,
          longitude: locationT.lng })
      }
    })()} catch (error) {console.error("Error:", error);};
  }, []);

  
  let text = <Text>Waiting.............</Text>
  SplashScreen.preventAutoHideAsync();
  if (errorMsg) {
    text = errorMsg;
  } else if (position) {
    
    text =  <MapView
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
    {/* <Marker coordinate={{
      latitude: position.latitude,
      longitude: position.longitude,

    }} style={{width: 0}} image={require('../assets/pin.png')} style={{elevation: 2}}/> */}
    <Marker coordinate={{
      latitude: position.latitude,
      longitude: position.longitude,

    }}  >
  <Image
    source={require('../assets/pin.png')}
    style={{width: 46, height: 48}}
    resizeMethod="resize"
    resizeMode="center"
  />
</Marker>
   {driver && <Marker coordinate={{
      latitude: driver.latitude,
      longitude: driver.longitude,

    }}  >
  <Image
    source={require('../assets/truck.webp')}
    style={{width: 67, height: 68}}
    resizeMethod="resize"
    resizeMode="center"
  />
</Marker>}
{coords.length > 0 && <Polyline coordinates={coords} strokeWidth={5} strokeColor="#BC6C25"
            />}
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