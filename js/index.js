import fileSaver from 'file-Saver';
import CanvasClass from './CanvasClass';
import LocationLookup from './LocationLookup';
import Map from './Map.js';
import TextOverlay from './TextOverlay';
import keys from './keys';
import Styles from './Styles';
require('./manifest.json');
require('../images/manifest/icon-512x512.png');
require('../images/manifest/icon-192x192.png');
require('../images/manifest/icon-144x144.png');
require('../images/manifest/icon-96x96.png');
require('../images/manifest/icon-72x72.png');
require('../images/manifest/icon-48x48.png');


import html2canvas  from 'html2canvas';
import mapboxgl from 'mapbox-gl';
require('offline-plugin/runtime').install();

import '../css/font.css';
import '../css/input.css';
import '../css/main.css';
import '../css/main-overlay.css';

function updateDPI(dpi = 300) {
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function () {
            return dpi / 96
        }
    });
}

updateDPI();

let map = new Map(keys().mapBox)


let  locationLookupCallback = ()=> {
    let textOverlay  = new TextOverlay;
    let locationLookup = new LocationLookup(textOverlay, map );
    locationLookup.locationLookupLoaded();
    let canvasClass = new CanvasClass(1800, 2400);
}

window.Buffer = null;

window.locationLookupCallback = locationLookupCallback;


document.addEventListener("DOMContentLoaded", function(event) { 
    //set up the google maps api. We need to pass in the key from the keys.js file
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    let googlePlacesKey = keys().googlePlaces;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesKey}&libraries=places&callback=locationLookupCallback`;
    console.log(script.src);
    document.getElementsByTagName('head')[0].appendChild(script);
});