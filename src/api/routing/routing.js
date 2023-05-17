export default async function routing(startPoint, endPoint, travelMode, apiKeyIndex) {
    const url = `https://geoapify-platform.p.rapidapi.com/v1/routing?apiKey=${import.meta.env[`VITE_REACT_GEOAPIFY_PLATFORM_API_KEY_${apiKeyIndex}`]}&waypoints=${startPoint.lat},${startPoint.lng}|${endPoint.lat},${endPoint.lng}&mode=${travelMode}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_REACT_RAPID_API_KEY_0,
            'X-RapidAPI-Host': 'geoapify-platform.p.rapidapi.com'
        }
    };

    const res = await fetch(url, options);
    return res.json();
};