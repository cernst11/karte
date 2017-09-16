import CanvasClass from './CanvasClass';
import PosterStyling from './PosterStyling';
import mapboxgl from 'mapbox-gl';

/**
 * Location Lookup class - Binds Google places to text box and binds google places to map
 */
export default class LocationLookup {

    constructor(textOverlay, mapBox) {
        this.textOverlay = textOverlay;
        this.mapBox = mapBox;
        this.locationLookupLoaded();
    }

    /**
     * Set up the fields to bind mapBox and google places api
     */
    locationLookupLoaded() {
        let addressField = document.getElementById('pac-input');
        var options = {
            types: ['(cities)']
        };
        let autoComplete = new google.maps.places.Autocomplete(addressField, options);
        let that = this;
        autoComplete.addListener('place_changed', () => {
            that.textOverlay.location = this.textOverlay.formatCoord(autoComplete.getPlace().geometry.location.lat(),
                autoComplete.getPlace().geometry.location.lng())
            that.mapBox.map.setCenter([autoComplete.getPlace().geometry.location.lng(),
                autoComplete.getPlace().geometry.location.lat()
            ]);
        });
    }
}