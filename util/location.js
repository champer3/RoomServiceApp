const api_key = 'AIzaSyD8V7_tr5TRrdx2MYAqafAySv2xy7dGyNo'

export function getMapPreview(lat, lng){
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:#C91C1C%7Clabel:S%7C${lat},${lng}&key=${api_key}`
    return url
}

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
