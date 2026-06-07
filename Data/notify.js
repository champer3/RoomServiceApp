import { createSlice } from '@reduxjs/toolkit';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
    channelId: 'order-updates',
  };
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('order-updates', {
      name: 'Order Updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 300, 200, 300],
      sound: 'default',
      lightColor: '#BC6C25',
      enableVibrate: true,
      enableLights: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId = Constants && Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.eas
      ? Constants.expoConfig.extra.eas.projectId
      : Constants && Constants.easConfig ? Constants.easConfig.projectId : null;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const initialState = {
  expoPushToken: '',
  notification: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setExpoPushToken(state, action) {
      state.expoPushToken = action.payload;
    },
    addNotification(state, action) {
      state.notification.push(action.payload);
      state.unreadCount += 1;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    clearAllNotifications(state) {
      state.notification = [];
      state.unreadCount = 0;
    },
    resetUnreadCount(state) {
      state.unreadCount = 0;
    },
    },
    
});
export const { setExpoPushToken, addNotification, setNotification, clearAllNotifications, resetUnreadCount } = notificationsSlice.actions;


// Thunk for registering notifications
export const registerPushNotifications = () => async (dispatch) => {
  try {
    const token = await registerForPushNotificationsAsync();
    dispatch(setExpoPushToken(token || ''));

    // Register the token with the backend so server can send targeted push
    if (token) {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        const { SERVER_URL } = require('../config');
        fetch(`${SERVER_URL}/api/v1/users/push-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ pushToken: token }),
        }).catch((err) => console.error('Failed to register push token with server:', err.message));
      }
    }
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
};
async function getUserKey() {
  try {
    const profile = await AsyncStorage.getItem('profile');
    if (profile) {
      const { email } = JSON.parse(profile);
      if (email) return `notifications_${email}`;
    }
  } catch (e) {}
  return 'notifications';
}

export const loadNotifications = () => async (dispatch) => {
  try {
    const key = await getUserKey();
    const storedNotifications = await AsyncStorage.getItem(key);
    if (storedNotifications !== null) {
      dispatch(setNotification(JSON.parse(storedNotifications)));
    } else {
      dispatch(setNotification([]));
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
};
export const saveNotification = (notification) => async (dispatch) => {
  try {
    dispatch(addNotification(notification));

    const key = await getUserKey();
    const currentNotifications = await AsyncStorage.getItem(key);
    const newNotifications = currentNotifications
      ? [...JSON.parse(currentNotifications), notification]
      : [notification];

    await AsyncStorage.setItem(key, JSON.stringify(newNotifications));
  } catch (error) {
    console.error('Failed to save notification:', error);
  }
};



// Thunk for sending notifications and saving sent notifications
export const triggerNotification = (expoPushToken, title, body) => async (dispatch) => {
  const notification = {
    request: {
      content: {
        title,
        body,
        data: { someData: 'goes here' },
      },
    },
    type: 'sent',
    date: new Date().toISOString(),
  };

  dispatch(saveNotification(notification));

  // Schedule a local notification so it appears immediately in the notification tray
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        vibrate: [0, 300, 200, 300],
        data: { someData: 'goes here' },
        ...(Platform.OS === 'android' && { channelId: 'order-updates' }),
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error scheduling local notification:', error);
  }
};


export const clearNotifications = () => async (dispatch) => {
  try {
    dispatch(clearAllNotifications());
    const key = await getUserKey();
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear notifications:', error);
  }
};

export const unregisterPushToken = () => async (dispatch, getState) => {
  try {
    const pushToken = getState().notifications.expoPushToken;
    if (!pushToken) return;

    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) return;

    const { SERVER_URL } = require('../config');
    await fetch(`${SERVER_URL}/api/v1/users/push-token`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ pushToken }),
    });

    dispatch(setExpoPushToken(''));
    dispatch(setNotification([]));
    dispatch(resetUnreadCount());
  } catch (error) {
    console.error('Failed to unregister push token:', error);
  }
};

export default notificationsSlice.reducer;