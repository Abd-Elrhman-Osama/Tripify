export default async function coordsByPlaceName(place, countryCode, rapidApiKey) {
    const options = {
        method: 'GET',
	    headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
	    }
    };

    const res = await fetch(`https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname?name=${place}${countryCode ? `&country=${countryCode}` : ""}`, options)
    return res.json()
}