const dotenv = require('dotenv');
const appJson = require('./app.json');

dotenv.config({ path: '.env' });

const base = appJson.expo || {};

const serverUrl = process.env.SERVER_URL || 'http://192.168.1.80:3000';
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID || '';
const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID || '';
const googleIosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME || '';

const plugins = (base.plugins || []).map((plugin) => {
  if (Array.isArray(plugin) && plugin[0] === '@react-native-google-signin/google-signin') {
    return [
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: googleIosUrlScheme },
    ];
  }
  return plugin;
});

module.exports = {
  expo: {
    ...base,
    plugins,
    android: {
      ...base.android,
      config: {
        ...(base.android?.config || {}),
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    extra: {
      ...(base.extra || {}),
      serverUrl,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      googleMapsApiKey,
      googleIosClientId,
      googleWebClientId,
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.FIREBASE_APP_ID || '',
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
    },
  },
};
