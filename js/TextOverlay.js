 export default class TextOverlay{

    constructor(){

        //get inputs
        this.cityInput = document.querySelector('#city');
        this.countryInput = document.querySelector('#country');
        this.locationInput = document.querySelector('#location');

        //get overlay fields
        this.cityOverlay = document.querySelector('.city-overlay');
        this.countryOverlay = document.querySelector('.country-overlay');
        this.locationOverlay = document.querySelector('.coord-overlay');

        //bind this to this context
        this.updateCity = this.updateCity.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateCountry = this.updateCountry.bind(this);

        //add event listeners
        this.addEventListeners();

    }


    addEventListeners () {
        this.cityInput.addEventListener('keyup', this.updateCity);
        this.countryInput.addEventListener('keyup', this.updateCountry);
        this.locationInput.addEventListener('keyup', this.updateLocation);
      }

    updateCity(){
        this.cityOverlay.innerHTML = this.cityInput.value;
        this.city = this.cityInput.value;

    }
    updateLocation(){
        this.locationOverlay.innerHTML = this.locationInput.value;
        this.location = this.locationInput.value;

    }
    updateCountry(){
        this.countryOverlay.innerHTML = this.countryInput.value;
        this.country = this.countryInput.value;

    }

    set city(city){
        this.cityOverlay.innerHTML = city;
        this.cityInput.value = city;

    }
    set country(country){
        this.countryOverlay.innerHTML = country;
        this.countryInput.value = country;

    }
    set location(location){
        this.locationOverlay.innerHTML = location;
        this.locationInput.value = location;

    }

    formatCoord(lat, long){
        return ` ${lat.toFixed(4)}° ${lat < 0 ? 'S' : 'N'} / ${Math.abs(long.toFixed(4))}° ${long <  0 ? 'W' : 'E'}`
    }

}
