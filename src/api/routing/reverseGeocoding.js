export default async function reverseGeocoding(coords){
    const url = `https://feroeg-reverse-geocoding.p.rapidapi.com/address?lat=${coords.lat}&lon=${coords.lng}&lang=en`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_REACT_RAPID_API_KEY_0,
            'X-RapidAPI-Host': 'feroeg-reverse-geocoding.p.rapidapi.com'
        }
    };

    const res = await fetch(url, options);
    return res.json();
};
