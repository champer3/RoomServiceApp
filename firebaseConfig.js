
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyCSPcAATZ3Yabk4KDV7PvAkEiXM1z3giUU",
    authDomain: "room-service-c24ad.firebaseapp.com",
    projectId: "room-service-c24ad",
    storageBucket: "room-service-c24ad.appspot.com",
    messagingSenderId: "620214111770",
    appId: "1:620214111770:web:beb8956f51546468c28ba3",
    measurementId: "G-1NP8SKTW09"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// 867770443500-4d7duu63ncch51i43vsas1itfr94q4pm.apps.googleusercontent.com
// 867770443500-rfes4l80dc3buvcpqk5fet59tf3tdupu.apps.googleusercontent.com