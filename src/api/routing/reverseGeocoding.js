export default async function reverseGeocoding(coords){
    const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${coords.lat}&lon=${coords.lng}&accept-language=en`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_REACT_RAPID_API_KEY_0,
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
    };

    const res = await fetch(url, options);
    return res.json();
};
