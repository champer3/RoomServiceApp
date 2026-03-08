import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const serverUrl = (extra.serverUrl || 'http://192.168.2.10:3000').replace(/\/$/, '');

export const SERVER_URL = serverUrl;
export const STRIPE_PUBLISHABLE_KEY = extra.stripePublishableKey || '';
export const GOOGLE_MAPS_API_KEY = extra.googleMapsApiKey || '';
