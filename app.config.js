const dotenv = require('dotenv');
const appJson = require('./app.json');

dotenv.config({ path: '.env' });

const base = appJson.expo || {};

const serverUrl = process.env.SERVER_URL || 'http://192.168.1.80:3000';
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID || '';
const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID || '';
function getIosUrlScheme(iosClientId, explicitScheme) {
  if (explicitScheme) return explicitScheme;
  if (!iosClientId) return '';
  const prefix = iosClientId.replace('.apps.googleusercontent.com', '');
  return `com.googleusercontent.apps.${prefix}`;
}

// .env is not on EAS — derive scheme from client ID or use committed app.json plugin value
const googleIosUrlScheme = getIosUrlScheme(
  googleIosClientId,
  process.env.GOOGLE_IOS_URL_SCHEME
);

const plugins = (base.plugins || []).map((plugin) => {
  if (plugin === '@react-native-google-signin/google-signin' || (Array.isArray(plugin) && plugin[0] === '@react-native-google-signin/google-signin')) {
    const existingScheme = Array.isArray(plugin) ? plugin[1]?.iosUrlScheme : '';
    return [
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: googleIosUrlScheme || existingScheme },
    ];
  }
  return plugin;
});

module.exports = {
  expo: {
    ...base,
    plugins,
    ios: {
      ...base.ios,
      infoPlist: {
        ...(base.ios?.infoPlist || {}),
        ITSAppUsesNonExemptEncryption: false,
      },
    },
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
