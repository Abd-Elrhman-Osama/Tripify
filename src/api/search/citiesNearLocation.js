export default async function citiesNearLocation(lat, lng, rapidApiKey) {
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${lat}${lng > 0 ? `+${lng}` : lng}/nearbyCities?radius=100&types=CITY&distanceUnit=KM`, options)
    return res.json()
}