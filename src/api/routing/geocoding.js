export default async function geocoding(place, apiKey){
    const url = `https://geokeo-forward-geocoding.p.rapidapi.com/search.php?q=${place}&api=${apiKey}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_REACT_RAPID_API_KEY_0,
            'X-RapidAPI-Host': 'geokeo-forward-geocoding.p.rapidapi.com'
        }
    };
    const res = await fetch(url, options);
    return res.json();
};