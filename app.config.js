const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const appJson = require('./app.json');
const base = appJson.expo || {};

module.exports = {
  expo: {
    ...base,
    extra: {
      ...(base.extra || {}),
      serverUrl: process.env.SERVER_URL || 'http://192.168.1.80:3000',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },
  },
};
