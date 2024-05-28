import { StyleSheet,View, Modal, Animated , Dimensions, Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    FlatList,
    ScrollView,
    ActivityIndicator} from "react-native";
  import MapView from "react-native-maps";
  import * as Location from 'expo-location';
  import Text from '../components/Text';
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
  import { useNavigation } from "@react-navigation/native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
import {useSelector, useDispatch} from 'react-redux'
import { updateProfile } from "../Data/profile";
  
  
  export default function AddAddressScreen() {
      const [location, setLocation] = useState(null);
      const orders = useSelector((state) => state.cartItems.order)
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useDispatch();
    const [results, setResults] = useState()
  const data = useSelector((state) => state.profileData.profile)
  const address = [...data.address]
    const [position , setPosition] = useState(null)
    const [info, setInfo] = useState('Locating.....')
    const [show, setShow] = useState(false)
    const navigation = useNavigation()
    const [active, setActive] = useState(false)
    const ref = useRef(null);
    const [form , setForm] = useState({
      id : address.length,
        name: '',
        nameNo: '',
        address: '',
        number: '',
      })
    ref?.current?.scrollTo(-765);
    const onPress = useCallback(() => {
      const isActive = ref?.current?.isActive();
      // ref?.current?.scrollTo(0);
      ref?.current?.scrollTo(-765);
    }, []);
    
    function selectLocationHandler(event){
      const lat = event.nativeEvent.coordinate.latitude
      const lng = event.nativeEvent.coordinate.longitude
      setPosition({latitude: lat, longitude: lng})
      handleLocation(lat,lng)

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
    else if (field == 'address'){
      showSuggestion(value)
    }
    
    setForm((prev) => ({...prev, [field]: value}));
    
  }

  async function showSuggestion(value){
    const m = await searchAddress(value)
    setResults(m)
  }
  const [isLoading, setIsLoading] = useState(false); // State variable to track loading status

  async function validateAddress(){
    setIsLoading(true)
    let locationT = await getPosition(form.address);
    if (locationT.lat){
      setPosition({latitude: locationT.lat, longitude: locationT.lng})
      setLocation({coords: {longitude: locationT.lng, latitude: locationT.lat}});
    const m = await getAddress(locationT.lat, locationT.lng)
    handleFormChange('address',m)
    if (active){
      setActive(false)
      var tempData = {...data, ['address'] : [{...form, ['address']: m}, ...data.address]} 
      newData = { ...data, ['address'] : [] };
      var j = 0
      for (let i = 0; i < tempData.address.length; i++) {
          newData.address.push({...tempData.address[i], ['id']: j})
          j += 1
      }
    }
    else {newData = {...data, ['address'] : [...data.address, {...form, ['address']: m}]} 
  }
  dispatch(updateProfile({id : newData}))
  
  setTimeout(async ()=>{
      try{
        await AsyncStorage.removeItem('essential')
      } catch(error){
        console.error('Error deleting item:', error);
      }
      try {
        await AsyncStorage.setItem("essential", JSON.stringify({address: newData.address, orders:  orders}));
        console.log("Essential saved successfully.");
      } catch (error) {
        console.error("Error saving token:", error);
      }
      setIsLoading(false)
      navigation.navigate('Address')
      setForm({
          id : address.length,
          name: '',
          nameNo: '',
          address: '',
          number: '',
        }) }, 0)
  }
    else{
      return false
    }
    
  }
   
    async function handleLocation(lat, lng){
        
         try{ handleFormChange('address',await getAddress(lat, lng))} catch (error){
          console.error("Error saving :", error);
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
    
    let text = <ActivityIndicator size="large" color="#0000ff" />
    SplashScreen.preventAutoHideAsync();
    if (errorMsg) {
      text = <Text>{errorMsg}</Text>;
      // navigation.goBack()
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
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: '5%', }} >
              <View style ={{justifyContent: 'space-between', flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>Add an Address</Text></View>
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
              </View>
              <Input text={'Contact Name'} textInputConfig={{cursorColor: '#aaa',value: form.nameNo, onChangeText: handleFormChange.bind(this, 'nameNo')}}/>
              <Input keyboard="number-pad" length={14} icon={<PhoneIcon/>} text={'Contact Number'} textInputConfig={{cursorColor: '#aaa',value: form.number, onChangeText: handleFormChange.bind(this, 'number')}}/>
              <View style ={{marginTop: 15, gap: 13, flexDirection: 'row'}}>
              <Pressable onPress={()=> setActive((prev) => !prev )}><View style={{width: 25, height: 25, borderWidth: 2, borderColor: '#aaa', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#aaa' : 'white' }}><Entypo name="check" size={20} color="white" /></View></Pressable>
              <Text>Make this the default address</Text>
              </View>
              <View style={[styles.recommendedView, {height: 65, marginTop: 20}]}>
                  <FlexButton onPress={validateAddress} background={'#283618'}><Text style={{color: 'white', fontSize: 18}}>Save</Text></FlexButton>
              </View>
              
            </View>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
      </View></>)}
      
          </KeyboardAvoidingView>
          
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