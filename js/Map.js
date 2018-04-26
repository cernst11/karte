import mapboxgl from 'mapbox-gl';
// import earthQuakes from './location.json';

/**
 * Create map and control its properties
 */
export default class Map {
    constructor(mapBoxKey) {
        // set mapBox api key
        this.mapBoxKey = mapBoxKey;
        this.style = 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf';
        this.html = document.querySelector('html');
        // this.setStyle = this.setStyle.bind(this);
        // create the style selectors and build the map
        this.buildMap();
        // this.getMapData();
    }

    static async getMapData() {
        const earthQuakes = null;
        let response = await fetch(earthQuakes);
        // only proceed once promise is resolved
        let data = await response.json();
        // only proceed once second promise is resolved
        const locations = [];
        let i = 0;
        data.locations.forEach((location) => {
            const loc = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [location.longitudeE7 * (10 ** -7), location.latitudeE7 * (10 ** -7), 0.0],
                },
                properties: {
                    time: location.timestampMs,
                },
            };

            if (i % 2 === 0) {
                locations.push(loc);
            }

            i += 1;
            // console.log(loc)
        });
        data = {};
        response = {};
        const x = {
            type: 'FeatureCollection',
            features: locations,
        };
        return x;
    }


    async buildMap() {
        mapboxgl.accessToken = this.mapBoxKey;
        const map = new mapboxgl.Map({
            container: 'map',
            center: [13.404953999999975, 52.52000659999999],
            style: this.style,
            zoom: 13,
            preserveDrawingBuffer: true,
        });
        this.map = map;

        map.addControl(new mapboxgl.NavigationControl());

        /*         let that = this;
        map.on('load', async  () => {
            //Add a geojson point source.
            //Heatmap layers also work with a vector tile source.
            let data = await that.getMapData();
            map.addSource('earthquakes', {
                "type": "geojson",
                "data": data
            });

            map.addLayer({
                "id": "earthquakes-heat",
                "type": "heatmap",
                "source": "earthquakes",
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
        }); */
    }

    static createLayer() {
    }
}
