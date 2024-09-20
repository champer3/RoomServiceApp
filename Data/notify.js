import { createSlice } from '@reduxjs/toolkit';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
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
    notification: null,
  };
  
  const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
      setExpoPushToken(state, action) {
        state.expoPushToken = action.payload;
      },
      setNotification(state, action) {
        state.notification = action.payload;
      },
    },
  });
  
  export const { setExpoPushToken, setNotification } = notificationsSlice.actions;
  
  // Thunk for registering notifications
  export const registerPushNotifications = () => async (dispatch) => {
    try {
      const token = await registerForPushNotificationsAsync();
      dispatch(setExpoPushToken(token || ''));
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };
  
  // Thunk for sending notifications
  export const triggerNotification = (expoPushToken, title, body) => async () => {
    try {
      await sendPushNotification(expoPushToken, title, body);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
  export default notificationsSlice.reducer;