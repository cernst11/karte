//Internal classes
import CanvasClass from './CanvasClass';
import LocationLookup from './LocationLookup';
import Map from './Map.js';
import PosterStyling from './PosterStyling';
import keys from './keys';
import Styles from './Styles';

//External libs
import fileSaver from 'file-Saver';
import html2canvas from 'html2canvas';
import mapboxgl from 'mapbox-gl';
require('offline-plugin/runtime').install();

//App manifest for pwa
require('./manifest.json');
//css
import '../css/font.css';
import '../css/input.css';
import '../css/main.css';
import '../css/main-overlay.css';

//images
require('../images/icons/icon-512x512.png');
require('../images/icons/icon-384x384.png');
require('../images/icons/icon-192x192.png');
require('../images/icons/icon-152x152.png');
require('../images/icons/icon-144x144.png');
require('../images/icons/icon-128x128.png');
require('../images/icons/icon-96x96.png');
require('../images/icons/icon-72x72.png');

//force the web cnavs layer to use 300 dpi
(function updateDPI() {
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function () {
            return 300 / 96
        }
    });
})();


/* const mapOverlay = document.querySelector('#map-overlay');
const mapDiv = document.querySelector('#map');
let height = "2400px"
let width = "1800px"
mapOverlay.style.height = height;
mapOverlay.style.width = width;
mapDiv.style.height = height;
mapDiv.style.width = width; */


let map = new Map(keys.mapBox);

let locationLookupCallback = () => {
    //set up the poster and pass in th map (we only want one instance)
    let canvasClass = new CanvasClass(1800, 2400, 18, 24);
    let posterStyling = new PosterStyling(map);
    let locationLookup = new LocationLookup(posterStyling, map);
    //locationLookup.locationLookupLoaded();
    canvasClass.changeDisplaySize(900, 1200, 9, 12);
    

}




//set this to windows scope so the callback picks it up
window.locationLookupCallback = locationLookupCallback;

//set up some things for when the documnet loads
document.addEventListener("DOMContentLoaded", function (event) {
    //set up the google maps api. We need to pass in the key from the keys.js file
    let googlePlacesKey = keys.googlePlaces;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    //build the maps url with the google places key
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesKey}&libraries=places&callback=locationLookupCallback`;
    document.getElementsByTagName('head')[0].appendChild(script);
});