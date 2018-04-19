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
            this.textOverlay.pojoProxy.country.text = this.getCountryName(autoComplete.getPlace());
            this.textOverlay.pojoProxy.city.text = this.getCityName(autoComplete.getPlace());
            this.textOverlay.pojoProxy.location.text = this.textOverlay.formatCoord(autoComplete.getPlace().geometry.location.lat(),
                autoComplete.getPlace().geometry.location.lng());
            this.textOverlay.countryInput.value = this.getCountryName(autoComplete.getPlace());
            this.textOverlay.cityInput.value = this.getCityName(autoComplete.getPlace());
            this.textOverlay.locationInput.value = this.textOverlay.formatCoord(autoComplete.getPlace().geometry.location.lat(), 
                autoComplete.getPlace().geometry.location.lng());
            that.mapBox.map.setCenter([autoComplete.getPlace().geometry.location.lng(),
                autoComplete.getPlace().geometry.location.lat()
            ]);
        });
    }

    /**
     * Filter for country based on type. If unites staes convert to usa
     * @param {Object} places The places object to filter
     */
    //TODO: create function to map long country name to short country name for long country names ie usa uae etc..
    getCountryName(places) {
        let country = places.address_components.filter((component) => {
            return (component.types.includes("country"))
        })
        return country[0].long_name.toUpperCase() === 'UNITED STATES' ? 'USA' : country[0].long_name;
    }

    /**
     * Filter for city based on type.
     * @param {Object} places The places object to filter
     */
    getCityName(places) {
        let city = places.address_components.filter((component) => {
            return (component.types.includes("locality") && component.types.includes("political"));
        })
        return city[0].long_name;
    }
}