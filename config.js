import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const serverUrl = (extra.serverUrl || 'http://192.168.1.80:3000').replace(/\/$/, '');

export const SERVER_URL = serverUrl;
export const STRIPE_PUBLISHABLE_KEY = extra.stripePublishableKey || '';
export const GOOGLE_MAPS_API_KEY = extra.googleMapsApiKey || '';

export const GOOGLE_IOS_CLIENT_ID = extra.googleIosClientId || '';
export const GOOGLE_WEB_CLIENT_ID = extra.googleWebClientId || '';

export const FIREBASE_CONFIG = {
  apiKey: extra.firebaseApiKey || '',
  authDomain: extra.firebaseAuthDomain || '',
  projectId: extra.firebaseProjectId || '',
  storageBucket: extra.firebaseStorageBucket || '',
  messagingSenderId: extra.firebaseMessagingSenderId || '',
  appId: extra.firebaseAppId || '',
  measurementId: extra.firebaseMeasurementId || '',
};
