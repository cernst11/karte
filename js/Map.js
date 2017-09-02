
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

        this.setStyle = this.setStyle.bind(this);
        
        //create the style selectors and build the map
        this.buildMap();
        this.createStyleSelector(); 
        this.addEventListeners();
    }

    addEventListeners() {
        
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
        const newStyleUrl = this.styles.getStyleByName(style.target.value)[0].url;
        this.map.setStyle(newStyleUrl);
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