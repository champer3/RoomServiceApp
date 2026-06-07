import { Platform } from "react-native";
import Constants from "expo-constants";
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "../config";

let GoogleSignin = null;
let nativeAvailable = false;

try {
  const mod = require("@react-native-google-signin/google-signin");
  GoogleSignin = mod.GoogleSignin;
  if (!GOOGLE_WEB_CLIENT_ID) {
    console.warn("[GoogleAuth] GOOGLE_WEB_CLIENT_ID is missing — native sign-in will fail.");
  }
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    offlineAccess: false,
  });
  nativeAvailable = true;
} catch {
  // Native module not available (e.g. Expo Go) — fall back to expo-auth-session
}

export function isExpoGo() {
  return Constants.appOwnership === "expo";
}

/** Google OAuth does not accept Expo Go's exp:// redirect URI on iOS. */
export function isGoogleSignInBlocked() {
  return isExpoGo() && Platform.OS === "ios";
}

export function getGoogleSignInBlockedMessage() {
  return "Google Sign-In on iOS is not supported in Expo Go. Install the iOS development build on your iPhone to test it.";
}

function formatGoogleSignInError(err) {
  const code = err?.code;
  if (code === "DEVELOPER_ERROR" || String(err?.message || "").includes("DEVELOPER_ERROR")) {
    return "Google Sign-In is not configured correctly. Add your debug SHA-1 in Firebase, download a new google-services.json, then rebuild the app.";
  }
  if (code === "PLAY_SERVICES_NOT_AVAILABLE") {
    return "Google Play Services is not available on this device.";
  }
  if (code === "SIGN_IN_CANCELLED") {
    return "Sign-in was cancelled.";
  }
  return err?.message || "Google sign-in failed.";
}

export async function clearNativeGoogleAccount() {
  if (!GoogleSignin) return;
  try {
    await GoogleSignin.signOut();
  } catch {
    // No cached account — safe to ignore.
  }
}

/**
 * Native Google Sign-In (dev builds on Android and iOS).
 * Pass selectAccount: true on login to show the Google account picker.
 */
export async function nativeGoogleSignIn({ selectAccount = false } = {}) {
  if (!GoogleSignin) {
    throw new Error("Native Google Sign-In is not available in this environment.");
  }

  if (selectAccount) {
    await clearNativeGoogleAccount();
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  } catch (err) {
    console.error("[GoogleAuth] Play Services error:", err);
    throw new Error(formatGoogleSignInError(err));
  }

  let response;
  try {
    response = await GoogleSignin.signIn();
  } catch (err) {
    console.error("[GoogleAuth] signIn error:", err);
    throw new Error(formatGoogleSignInError(err));
  }

  if (response.type === "cancelled") {
    return { cancelled: true };
  }

  const user = response.data?.user;
  if (!user?.email) {
    throw new Error("Could not get email from Google.");
  }

  return {
    email: user.email,
    googleId: user.id,
    firstName: user.givenName || "",
    lastName: user.familyName || "",
  };
}

export function isNativeGoogleAvailable() {
  return nativeAvailable;
}
