export default async function countryCodes() {
    const res = await fetch('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json');
    return res.json();
}