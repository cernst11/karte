/**
 * Class to get map and overlay styles attached to diffrent map styles
 */
//import any themes that are loaded with webpack
const darkMatterWhite = require('../styles/darkMatterWhite.json');

export default class Styles {
    constructor() {}

    getStyles() {

        return [{
                name: 'Simple',
                url: 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf',
                author: 'cernst',
                overlay: {
                    textColor: '#000000',
                    ornamentalColor: '#000000',
                    gradientColor: '#FFFFFF', 
                    ornamentalPostition: '106%',
                    ornamentalWidth: '3em'
                }
            },
            {
                name: 'Moonlight',
                url: 'mapbox://styles/cernst11/cj717woq90grv2smxyxv1bqxi',
                author: 'cernst',
                overlay: {
                    textColor: '#DBDBDB',
                    ornamentalColor: '#DBDBDB',
                    gradientColor: '#000000'
                }
            },
            {
                name: 'Positron',
                url: 'https://openmaptiles.github.io/positron-gl-style/style-cdn.json',
                author: 'cernst',
                overlay: {
                    textColor: '#000000',
                    ornamentalColor: '#000000',
                    gradientColor: '#F2F3F0'
                }
            },
            {
                name: 'Dark-Matter',
                url: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
                author: 'Open Map Tiles',
                overlay: {
                    textColor: '#FFFFFF',
                    ornamentalColor: '#FFFFFF',
                    gradientColor: '#000000'
                }
            },
            {
                name: 'Toner',
                url: 'https://openmaptiles.github.io/toner-gl-style/style-cdn.json',
                author: 'Open Map Tiles',
                overlay: {
                    textColor: '#000000',
                    ornamentalColor: '#000000',
                    gradientColor: '#FFFFFF'
                }
            },
            {
                name: 'OSM-Bright',
                url: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json',
                author: 'Open Map Tiles',
                overlay: {
                    textColor: '#000000',
                    ornamentalColor: '#000000',
                    gradientColor: '#D8E8C8'
                }
            },

            {
                name: 'Vinatge',
                url: 'mapbox://styles/cernst11/cj7cn20k203jb2sqeyb3nqr9j',
                author: 'mapBox',
                overlay: {
                    textColor: '#515151',
                    ornamentalColor: '#5b5b5b',
                    gradientColor: '#d8c1b1'
                }
            },
            {
                name: 'Dark-Matter-White',
                url: darkMatterWhite,
                author: 'mapBox',
                overlay: {
                    textColor: '#FFFFFF',
                    ornamentalColor: '#FFFFFF',
                    gradientColor: '#000000'
                }
            }

        ]

    }

    /**
     * Get a style by its name
     * @param {string} name 
     */
    getStyleByName(name) {
        return this.getStyles().filter(style => style.name === name);
    }

    getStyleByType() {


    }

}