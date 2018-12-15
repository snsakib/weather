const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        address: {
            describe: 'Address to fetch weather for',
            demand: true,
            alias: 'a',
            string: true
        }
    })
    .help()
    .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeURL)
.then((response) => {
    if(response.data.result === "ZERO_RESULTS") {
        throw new Error('Unable to find that address.');
    }
    var latitude = response.data.results[0].geometry.location.lat;
    var longitude = response.data.results[0].geometry.location.lng;
    var weatherURL = `https://api.darksky.net/forecast/f19ec114178b9713939456c2d9cf3754/${latitude},${longitude}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherURL);
})
.then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)
})
.catch((error) => {
    if(error.code === "ENOTFOUND") {
        console.log('Unable to connect to the google server.');
    } else {
        console.log(error.message);
    }
});



