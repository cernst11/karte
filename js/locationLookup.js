import CanvasClass from './CanvasClass';
import TextOverlay from './TextOverlay';
import mapboxgl from 'mapbox-gl';

/**
 * Location Lookup class - Binds Google places to text box and binds google places to map
 */
export default class LocationLookup {
    
    constructor(textOverlay, mapBox) {
        this.textOverlay = textOverlay;
        this.mapBox = mapBox;
    }

    locationLookupLoaded() {
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
            that.mapBox.map.setCenter([autoComplete.getPlace().geometry.location.lng(),
                autoComplete.getPlace().geometry.location.lat()
            ]);
        });
    }
}