import { createSlice } from '@reduxjs/toolkit';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function sendPushNotification(expoPushToken, title, body) {
  console.log(title, body)
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
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
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
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
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
  },
});
export const { setExpoPushToken, addNotification, setNotification } = notificationsSlice.actions;


// Thunk for registering notifications
export const registerPushNotifications = () => async (dispatch) => {
  try {
    const token = await registerForPushNotificationsAsync();
    dispatch(setExpoPushToken(token || ''));
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
};
export const loadNotifications = () => async (dispatch) => {
  try {
    const storedNotifications = await AsyncStorage.getItem('notifications');
    if (storedNotifications !== null) {
      dispatch(setNotification(JSON.parse(storedNotifications)));
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
};
export const saveNotification = (notification) => async (dispatch) => {
  try {
    dispatch(addNotification(notification)); // Add notification to Redux state

    // Save to AsyncStorage
    const currentNotifications = await AsyncStorage.getItem('notifications');
    const newNotifications = currentNotifications
      ? [...JSON.parse(currentNotifications), notification]
      : [notification];

    await AsyncStorage.setItem('notifications', JSON.stringify(newNotifications));
  } catch (error) {
    console.error('Failed to save notification:', error);
  }
};



// Thunk for sending notifications
// Thunk for sending notifications and saving sent notifications
export const triggerNotification = (expoPushToken, title, body) => async (dispatch) => {
  try {
    // Send the notification
    await sendPushNotification(expoPushToken, title, body);

    // Create a notification object to save
    const notification = {
      request: {
        content: {
          title,
          body,
          data: { someData: 'goes here' },
        },
      },
      type: 'sent', // Mark this as a sent notification (you can filter later based on this)
      date: new Date(), // Add a timestamp
    };

    // Save the sent notification
    dispatch(saveNotification(notification)); // Save in Redux and AsyncStorage

    console.log('Notification sent and saved!');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};


export default notificationsSlice.reducer;