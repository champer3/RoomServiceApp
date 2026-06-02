const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const appJson = require('./app.json');
const base = appJson.expo || {};

module.exports = {
  expo: {
    ...base,
    extra: {
      ...(base.extra || {}),
      serverUrl: process.env.SERVER_URL || 'https://roomservicebackend-6fdac2e35a8e.herokuapp.com',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },
  },
};
