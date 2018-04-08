import Styles from './Styles'
import Worker from "./dataTransformations/googleLocationToGeoJson.worker.js";


/**
 *  Confgiure the styling of the poster
 */
export default class PosterStyling {

    constructor(map) {
        this.styles = new Styles;
        this.map = map.map;
        //get inputs
        this.cityInput = document.querySelector('#city');
        this.countryInput = document.querySelector('#country');
        this.locationInput = document.querySelector('#location');
        this.locationDataInput = document.querySelector('#data-file');

        //get overlay fields
        this.cityOverlay = document.querySelector('.city-overlay');
        this.countryOverlay = document.querySelector('.country-overlay');
        this.locationOverlay = document.querySelector('.coord-overlay');

        this.html = document.getElementsByTagName('html')[0];

        //get control elements
        this.textColorPicker = document.querySelector('.text-color-picker');
        this.ornamentalColorPicker = document.querySelector('.ornamental-color-picker');
        this.gradientColorPicker = document.querySelector('.gradient-color-picker');
        this.ornamentalPosition = document.querySelector('.ornamental-position');
        this.ornamentalSize = document.querySelector('.ornamental-size');

        //bind this to this context
        this.updateCity = this.updateCity.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateCountry = this.updateCountry.bind(this);

        //bind control elements
        this.setTextColor = this.setTextColor.bind(this);
        this.setStyle = this.setStyle.bind(this);
        this.setOrnamentalColor = this.setOrnamentalColor.bind(this);
        this.setGradientColor = this.setGradientColor.bind(this);
        this.setOrnamentalPosition = this.setOrnamentalPosition.bind(this);
        this.setOrnamentalSize = this.setOrnamentalSize.bind(this);
        this.setLocationData = this.setLocationData.bind(this);
        this.showHeatMap = this.showHeatMap.bind(this);

        //add event listeners
        this.createStyleSelector();
        this.addEventListeners();


    }


    addEventListeners() {
        this.cityInput.addEventListener('keyup', this.updateCity);
        this.countryInput.addEventListener('keyup', this.updateCountry);
        this.locationInput.addEventListener('keyup', this.updateLocation);
        this.textColorPicker.addEventListener("change", this.setTextColor, false);
        this.ornamentalColorPicker.addEventListener("change", this.setOrnamentalColor, false);
        this.gradientColorPicker.addEventListener("change", this.setGradientColor, false);
        this.ornamentalPosition.addEventListener("input", this.setOrnamentalPosition, false);
        this.ornamentalSize.addEventListener("input", this.setOrnamentalSize, false);
        this.locationDataInput.addEventListener("change", this.setLocationData, false)
    }

    updateCity() {
        this.cityOverlay.innerHTML = this.cityInput.value;
        this.city = this.cityInput.value;

    }
    updateLocation() {
        this.locationOverlay.innerHTML = this.locationInput.value;
        this.location = this.locationInput.value;

    }
    updateCountry() {
        this.countryOverlay.innerHTML = this.countryInput.value;
        this.country = this.countryInput.value;

    }

    set city(city) {
        this.cityOverlay.innerHTML = city;
        this.cityInput.value = city;

    }
    set country(country) {
        this.countryOverlay.innerHTML = country;
        this.countryInput.value = country;

    }
    set location(location) {
        this.locationOverlay.innerHTML = location;
        this.locationInput.value = location;

    }

    async setLocationData(e) {
        const file = e.target.files[0];
        //console.log(file);
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        let worker = new Worker();
        reader.onload = async(e) => {
            worker.postMessage(JSON.parse(e.target.result));
            worker.onmessage = this.showHeatMap;
            e = {};
        }
    }

    showHeatMap(e) {
        console.log('Rendering Map')
        let that = this;
        //Add a geojson point source.
        //Heatmap layers also work with a vector tile source.
        let i = 0;
        e.data.forEach(subDataSet => {
            this.map.addSource('layer' + i , {
                "type": "geojson",
                "buffer": 64,
                "data": subDataSet,
                "tolerance" : 0.999
            });

            this.map.addLayer({
                "id": "layer" + i,
                "type": "heatmap",
                "source": "layer" + i,
                "maxzoom": 15,
                "paint": {
                    //Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-radius': 25,
                    //Increase the heatmap color weight weight by zoom level
                    //heatmap-ntensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": {
                        "stops": [
                            [0, 1],
                            [9, 3]
                        ]
                    },
                    //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    //Begin color ramp at 0-stop with a 0-transparancy color
                    //to create a blur-like effect.
                    "heatmap-color": [
                        "interpolate", ["linear"],
                        ["heatmap-density"],
                        0, "rgba(33,102,172,0)",
                        0.2, "rgb(103,169,207)",
                        0.4, "rgb(209,229,240)",
                        0.5, "rgb(216, 253, 199)",
                        0.9, "rgb(239,138,98)",
                        1, "rgb(178,24,43)"
                    ],
                    //Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": {
                        "default": 1,
                        "stops": [
                            [7, .65],
                            [9, .55],
                            [15, .50]
                        ]
                    },
                }
            }, 'waterway-label');
    
            i++;
        });

        
    }

    formatCoord(lat, long) {
        return ` ${lat.toFixed(4)}° ${lat < 0 ? 'S' : 'N'} / ${Math.abs(long.toFixed(4))}° ${long <  0 ? 'W' : 'E'}`;
    }

    setOverlayStyle(style) {
        //get the root html to modify the css vars   
        this.html.style.setProperty('--overlay-font-color', style.textColor || '#FFFFFF');
        this.html.style.setProperty('--country-ornamental-color', style.ornamentalColor || '#FFFFFF');
        this.html.style.setProperty('--overlay-gradeint-color', style.gradientColor);
    }

    setTextColor(e) {
        let color = e.target.value;
        this.html.style.setProperty('--overlay-font-color', color || '#FFFFFF');
    }
    setGradientColor(e) {
        let color = e.target.value;
        this.html.style.setProperty('--overlay-gradient-color', color || '#FFFFFF');

    }

    setOrnamentalColor(e) {
        let color = e.target.value;
        this.html.style.setProperty('--country-ornamental-color', color || '#FFFFFF');

    }

    setOrnamentalPosition(e) {
        let position = e.target.value;
        this.html.style.setProperty('--country-ornamental-pos', position + '%' || '106px');
    }

    setOrnamentalSize(e) {
        let size = e.target.value;
        this.html.style.setProperty('--country-ornamental-width', size + 'em' || '3em');
    }

    /**
     * Pass the event to set the style by name
     * @param {event} style - the event that contains the style event
     */
    setStyle(style) {
        const newStyle = this.styles.getStyleByName(style.target.value)[0];
        this.map.setStyle(newStyle.url);
        this.setOverlayStyle(newStyle.overlay);
    }

    setOverlayStyle(style) {
        //get the root html to modify the css vars   
        this.html.style.setProperty('--overlay-font-color', style.textColor || '#FFFFFF');
        this.html.style.setProperty('--country-ornamental-color', style.ornamentalColor || '#FFFFFF');
        this.html.style.setProperty('--overlay-gradient-color', style.gradientColor);
        this.html.style.setProperty('--country-ornamental-width', style.ornamentalWidth);
        this.html.style.setProperty('--country-ornamental-pos', style.ornamentalPostition);
    }


    /**
     * Create the Style selector 
     */
    createStyleSelector() {
        let styles = this.styles.getStyles();
        this.styleSelector = document.querySelector('.style-select');
        const option = `${styles.map(style => `<option value='${style.name}'>${style.name}</option>`)}`;
        this.styleSelector.innerHTML = option;
        this.styleSelector.onchange = this.setStyle;
    }

}