const path = require('path');
const fs = require('fs');

// Load config.env into process.env (no dotenv dependency)
const envPath = path.join(__dirname, 'config.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

const appJson = require('./app.json');
const base = appJson.expo || {};

module.exports = {
  expo: {
    ...base,
    extra: {
      ...(base.extra || {}),
      serverUrl: process.env.SERVER_URL || 'http://192.168.2.10:3000',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },
  },
};
