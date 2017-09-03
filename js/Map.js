
import mapboxgl from 'mapbox-gl';
import Styles from './Styles'

/**
 * Create map and control its properties
 */
export default class Map{

    constructor(mapBoxKey){
        //set mapBox api key
        this.mapBoxKey = mapBoxKey;
        this.styles = new Styles;
        this.style = 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf';
        this.html = document.getElementsByTagName('html')[0];  

        //get elements
        this.textColorPicker = document.querySelector('.text-color-picker');
        this.ornamentalColorPicker = document.querySelector('.ornamental-color-picker');
        

        //bind 
        this.setTextColor = this.setTextColor.bind(this);
        this.setStyle = this.setStyle.bind(this);
        this.setOrnamentalColor = this.setOrnamentalColor.bind(this);
        this.setGradientColor = this.setGradientColor.bind(this);
        
        //create the style selectors and build the map
        this.buildMap();
        this.createStyleSelector(); 
        this.addEventListeners();
    }

    addEventListeners() {
        this.textColorPicker.addEventListener("change", this.setTextColor, false);
        this.ornamentalColorPicker.addEventListener("change" , this.setOrnamentalColor, false);
    }

    buildMap(){
        mapboxgl.accessToken = this.mapBoxKey;
        let map = new mapboxgl.Map({
            container: 'map',
            center: [13.404953999999975, 52.52000659999999],
            style: this.style,
            zoom: 13,
            preserveDrawingBuffer: true
        });
        this.map = map;
        map.addControl(new mapboxgl.NavigationControl());
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
        this.html.style.setProperty('--overlay-font-color' , color || '#FFFFFF');

    }

    setOrnamentalColor(e){
        let color = e.target.value;
        this.html.style.setProperty('--country-ornamental-color' , color || '#FFFFFF');

    }


}