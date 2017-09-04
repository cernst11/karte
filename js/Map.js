
import mapboxgl from 'mapbox-gl';

/**
 * Create map and control its properties
 */
export default class Map{

    constructor(mapBoxKey){
        //set mapBox api key
        this.mapBoxKey = mapBoxKey;
        this.style = 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf';
        this.html = document.getElementsByTagName('html')[0];  
        
        //this.setStyle = this.setStyle.bind(this);
        //create the style selectors and build the map
        this.buildMap();
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

}