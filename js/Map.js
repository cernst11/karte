
import mapboxgl from 'mapbox-gl';

export default class Map{

    constructor(mapBoxKey){
        this.mapBoxKey = mapBoxKey;
        this.style = 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf';
        this.buildMap();

        this.styleChange = document.querySelector('.change-style');
        this.changeStyle = this.changeStyle.bind(this);

        this.addEventListeners();
    }

    addEventListeners() {
        this.styleChange.addEventListener('click', this.changeStyle);
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

    changeStyle(style){
        console.log('Style')
        this.map.setStyle('https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json');

    }

}