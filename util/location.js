const api_key = 'AIzaSyADXr7hg4drpTrhKOMtGgWCmHBEI95a6Pg'

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
export async function getAddress(lat, lng){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${api_key}&enable_address_descriptor=true`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch address!')
    }
     const data = await response.json();
     const address = data.results[0].formatted_address
     return address
}
export async function searchAddress(address){
    const url2 = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}&key=${api_key}`
    const response2 = await fetch(url2);
    const res = []
    if (response2.ok) {
        const data2 = await response2.json();
        for (var i = 0 ; i < data2.results.length; i++){
        res.push(data2.results[i].formatted_address)
        }
    }
    
    return res
}
export async function getPosition(address){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) {
        return ('Failed to fetch address!')
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
        const position = data.results[0].geometry.location;
        return position;
    } else {
        return ('No results found for the provided address.');
    }
}
