import fileSaver from 'file-Saver';
import CanvasClass from './CanvasClass';
import LocationLookup from './locationLookup';
import TextOverlay from './TextOverlay';
import html2canvas from 'html2canvas';
import mapboxgl from 'mapbox-gl';



export default class LocationLookup {
    constructor(textOverlay, apiKey) {
        this.textOverlay = textOverlay;
        this.apiKey = apiKey;

    }

    locationLookupLoaded() {
        mapboxgl.accessToken = this.apiKey;
        let map = new mapboxgl.Map({
            container: 'map',
            center: [13.404953999999975, 52.52000659999999],
            style: 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf',
            zoom: 13,
            preserveDrawingBuffer: true
        });
        this.map = map;
        map.addControl(new mapboxgl.NavigationControl());
        this.setupFields();
    }

    setupFields() {
        let addressField = document.getElementById('pac-input');
        var options = {
            types: ['(cities)']
        };
        let autoComplete = new google.maps.places.Autocomplete(addressField, options);
        console.log(this.autoComplete);
        let that = this;
        autoComplete.addListener('place_changed', () => {
            console.log(autoComplete);
            that.textOverlay.location = this.textOverlay.formatCoord(autoComplete.getPlace().geometry.location.lat(),
                autoComplete.getPlace().geometry.location.lng())
            that.map.setCenter([autoComplete.getPlace().geometry.location.lng(),
                autoComplete.getPlace().geometry.location.lat()
            ]);
        });
    }
}