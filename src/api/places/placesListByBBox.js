export default async function placesListByBBox(apiParams, rapidApiKey) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
        }
    };

    const params = new URLSearchParams(apiParams);
    const res = await fetch(`https://opentripmap-places-v1.p.rapidapi.com/en/places/bbox?${params}`, options)
    return res.json()
}