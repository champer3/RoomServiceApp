import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../config";
import { getSocket } from "../socketService";

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}` };
  const socket = getSocket();
  if (socket?.id) headers['x-socket-id'] = socket.id;
  return headers;
}

// ─── Addresses ─────────────────────────────────────────────────────────────

export async function fetchAddresses() {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.get(`${SERVER_URL}/api/v1/users/addresses`, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] fetchAddresses error:", err?.message);
    return null;
  }
}

export async function syncAddresses(addresses) {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.put(`${SERVER_URL}/api/v1/users/addresses`, { addresses }, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] syncAddresses error:", err?.message);
    return null;
  }
}

export async function addAddressToServer(address) {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.post(`${SERVER_URL}/api/v1/users/addresses`, { address }, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] addAddress error:", err?.message);
    return null;
  }
}

export async function deleteAddressFromServer(addressId) {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.delete(`${SERVER_URL}/api/v1/users/addresses/${addressId}`, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] deleteAddress error:", err?.message);
    return null;
  }
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export async function fetchCart() {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.get(`${SERVER_URL}/api/v1/users/cart`, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] fetchCart error:", err?.message);
    return null;
  }
}

export async function syncCartToServer(items) {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.put(`${SERVER_URL}/api/v1/users/cart`, { items }, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] syncCart error:", err?.message);
    return null;
  }
}

export async function clearCartOnServer() {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    await axios.delete(`${SERVER_URL}/api/v1/users/cart`, { headers });
    return [];
  } catch (err) {
    console.warn("[syncService] clearCart error:", err?.message);
    return null;
  }
}

// ─── Favorites ──────────────────────────────────────────────────────────────

export async function fetchFavorites() {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.get(`${SERVER_URL}/api/v1/users/favorites`, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] fetchFavorites error:", err?.message);
    return null;
  }
}

export async function syncFavoritesToServer(favorites) {
  const headers = await getAuthHeaders();
  if (!headers) return null;
  try {
    const res = await axios.put(`${SERVER_URL}/api/v1/users/favorites`, { favorites }, { headers });
    return res.data.data;
  } catch (err) {
    console.warn("[syncService] syncFavorites error:", err?.message);
    return null;
  }
}
