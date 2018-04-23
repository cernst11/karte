// Internal classes
import 'babel-polyfill';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import CanvasExport from './CanvasExport';
import LocationLookup from './LocationLookup';
import Map from './Map.js';
import PosterStyling from './PosterStyling';
import keys from './keys';


// css
import '../css/font.css';
import '../css/input.css';
import '../css/layout.css';
import '../css/buttons.css';
import '../css/drop-down.css';
import '../css/color-selector.css';
import '../css/range.css';
import '../css/style-container.css';

import './manifest.json';
import '../images/icons/icon-512x512.png';
import '../images/icons/icon-384x384.png';
import '../images/icons/icon-192x192.png';
import '../images/icons/icon-152x152.png';
import '../images/icons/icon-144x144.png';
import '../images/icons/icon-128x128.png';
import '../images/icons/icon-96x96.png';
import '../images/icons/icon-72x72.png';

OfflinePluginRuntime.install();

const precisionRound = (number, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

const roundedPixelRatio = precisionRound(window.devicePixelRatio, 2);
const pixelRatio = 300 / (roundedPixelRatio * 96);
window.devicePixelRatio = pixelRatio;


const map = new Map(keys.mapBox);
/* let sideNav = new SideNav();
sideNav.showSideNav(); */

const locationLookupCallback = () => {
    // set up the poster and pass in th map (we only want one instance)
    const posterStyling = new PosterStyling(map);
    new LocationLookup(posterStyling, map);
    new CanvasExport(1800, 2400);
};


// set this to windows scope so the callback picks it up
window.locationLookupCallback = locationLookupCallback;

// set up some things for when the documnet loads
document.addEventListener('DOMContentLoaded', () => {
    // set up the google maps api. We need to pass in the key from the keys.js file
    const googlePlacesKey = keys.googlePlaces;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    // build the maps url with the google places key
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesKey}&libraries=places&callback=locationLookupCallback`;
    document.getElementsByTagName('head')[0].appendChild(script);
});
