import { GOOGLE_MAPS_API_KEY } from '../config';

const api_key = GOOGLE_MAPS_API_KEY;

export function getMapPreview(lat, lng){
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:#C91C1C%7Clabel:S%7C${lat},${lng}&key=${api_key}`
    return url
}
import {decode} from "@mapbox/polyline"; //please install this package before running!
export const getDirections = async (startLoc, destinationLoc) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${api_key}`
    );
    let respJson = await resp.json();
    let points = decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1]
      };
    });
    return coords;
  } catch (error) {
    return error;
  }
};
export const getDuration = async (startLoc, destinationLoc) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${api_key}`
    );
    let respJson = await resp.json();
    return (respJson.routes[0].legs[0].duration.text)
  } catch (error) {
    return error;
  }
};
export async function getAddress(lat, lng) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch address');
    const data = await response.json();
    if (data.status === 'ZERO_RESULTS' || !data.results?.length) return '';
    return data.results[0].formatted_address || '';
  } catch (e) {
    console.warn('getAddress error:', e?.message);
    return '';
  }
}

/** Address suggestions using Geocoding API (works without Places API). */
export async function searchAddress(query) {
  const trimmed = (query || '').trim();
  if (trimmed.length < 2) return [];
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmed)}&key=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.results)) return [];
    return data.results.slice(0, 5).map((r) => r.formatted_address || '').filter(Boolean);
  } catch (e) {
    console.warn('searchAddress error:', e?.message);
    return [];
  }
}

/** Returns { lat, lng } or null on failure (so callers can use if (pos?.lat)). */
export async function getPosition(address) {
  const trimmed = (address || '').trim();
  if (!trimmed) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmed)}&key=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status !== 'OK' || !data.results?.length) return null;
    const loc = data.results[0].geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  } catch (e) {
    console.warn('getPosition error:', e?.message);
    return null;
  }
}
