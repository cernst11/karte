import Styles from './Styles'

/**
 *  Confgiure the styling of the poster
 */
 export default class PosterStyling{

    constructor(map){
        this.styles = new Styles;
        this.map = map.map;
        //get inputs
        this.cityInput = document.querySelector('#city');
        this.countryInput = document.querySelector('#country');
        this.locationInput = document.querySelector('#location');

        //get overlay fields
        this.cityOverlay = document.querySelector('.city-overlay');
        this.countryOverlay = document.querySelector('.country-overlay');
        this.locationOverlay = document.querySelector('.coord-overlay');

        this.html = document.getElementsByTagName('html')[0];  
        
        //get elements
        this.textColorPicker = document.querySelector('.text-color-picker');
        this.ornamentalColorPicker = document.querySelector('.ornamental-color-picker');
        this.gradientColorPicker = document.querySelector('.gradient-color-picker');
                

        //bind this to this context
        this.updateCity = this.updateCity.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateCountry = this.updateCountry.bind(this);

        //bind 
        this.setTextColor = this.setTextColor.bind(this);
        this.setStyle = this.setStyle.bind(this);
        this.setOrnamentalColor = this.setOrnamentalColor.bind(this);
        this.setGradientColor = this.setGradientColor.bind(this);

        //add event listeners
        this.createStyleSelector(); 
        this.addEventListeners();
        

    }


    addEventListeners () {
        this.cityInput.addEventListener('keyup', this.updateCity);
        this.countryInput.addEventListener('keyup', this.updateCountry);
        this.locationInput.addEventListener('keyup', this.updateLocation);

        this.textColorPicker.addEventListener("change", this.setTextColor, false);
        this.ornamentalColorPicker.addEventListener("change" , this.setOrnamentalColor, false);
        this.gradientColorPicker.addEventListener("change" , this.setGradientColor, false);
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

    setOverlayStyle(style){
        //get the root html to modify the css vars   
        this.html.style.setProperty('--overlay-font-color' , style.textColor || '#FFFFFF');
        this.html.style.setProperty('--country-ornamental-color' , style.ornamentalColor || '#FFFFFF');
        this.html.style.setProperty('--overlay-gradeint-color' , style.gradientColor);      
    }

    setTextColor(e){
        let color = e.target.value;
        this.html.style.setProperty('--overlay-font-color' , color || '#FFFFFF');
    }
    setGradientColor(e){
        let color = e.target.value;
        this.html.style.setProperty('--overlay-gradient-color' , color || '#FFFFFF');

    }

    setOrnamentalColor(e){
        let color = e.target.value;
        this.html.style.setProperty('--country-ornamental-color' , color || '#FFFFFF');

    }

        /**
     * Pass the event to set the style by name
     * @param {event} style - the event that contains the style event
     */
    setStyle(style){
        const newStyle = this.styles.getStyleByName(style.target.value)[0];
        this.map.setStyle(newStyle.url);
        this.setOverlayStyle(newStyle.overlay);
    }

    setOverlayStyle(style){
        //get the root html to modify the css vars   
        this.html.style.setProperty('--overlay-font-color' , style.textColor || '#FFFFFF');
        this.html.style.setProperty('--country-ornamental-color' , style.ornamentalColor || '#FFFFFF');
        this.html.style.setProperty('--overlay-gradient-color' , style.gradientColor);      
    }


    /**
     * Create the Style selector 
     */
    createStyleSelector(){
        let styles = this.styles.getStyles();
        this.styleSelector = document.querySelector('.style-select');
        const option = `${styles.map(style => `<option value='${style.name}'>${style.name}</option>`)}`;
        this.styleSelector.innerHTML = option;
        this.styleSelector.onchange=this.setStyle;
    }

}
