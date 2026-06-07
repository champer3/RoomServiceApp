import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const serverUrl = (extra.serverUrl || 'http://192.168.1.80:3000').replace(/\/$/, '');

export const SERVER_URL = serverUrl;
export const STRIPE_PUBLISHABLE_KEY = extra.stripePublishableKey || '';
export const GOOGLE_MAPS_API_KEY = extra.googleMapsApiKey || '';

// Google OAuth (expo-auth-session). Use Web client ID for Android OAuth flow when set.
const defaultIosClientId = '1036326714736-ccfuoqkih54f50u5trqnffods76djkja.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID = extra.googleIosClientId || defaultIosClientId;
export const GOOGLE_ANDROID_CLIENT_ID = extra.googleAndroidClientId || '';
export const GOOGLE_WEB_CLIENT_ID = extra.googleWebClientId || '';
