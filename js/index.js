import fileSaver from 'file-Saver';
import CanvasClass from './CanvasClass';
import LocationLookup from './locationLookup';
import TextOverlay from './TextOverlay';
import keys from './keys';
import html2canvas  from 'html2canvas';
import mapboxgl from 'mapbox-gl';
require('offline-plugin/runtime').install();



import '../css/font.css';
import '../css/input.css';
import '../css/main.css';
import '../css/main-overlay.css';

function updateDPI(dpi = 300) {
    console.log('stuff');
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function () {
            return dpi / 96
        }
    });
}

updateDPI();

let locationLookup;
let canvasClass;


let  locationLookupCallback = function() {

    let textOverlay  = new TextOverlay;
    console.log(keys().mapBox );
    let locationLookup = new LocationLookup(textOverlay, keys().mapBox );
    
    locationLookup.locationLookupLoaded();
}

window.Buffer = null;

window.locationLookupCallback = locationLookupCallback;


document.addEventListener("DOMContentLoaded", function(event) { 
    //set up the google maps api. We need to pass in the key from the keys.js file
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    let googlePlacesKey = keys().googlePlaces;
    //script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAi7zSiDNeJH4D74HnmLeo8otURsh2ty9s&libraries=places&callback=window.locationLookupCallback'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesKey}=places&callback=window.locationLookupCallback`;
    let  canvasClass = new CanvasClass(1800, 2400);
    
});