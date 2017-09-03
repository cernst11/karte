export default class Styles {
    constructor() {
    
            console.log("Styles");
    }

    getStyles() {

        return [{
                name: 'Simple',
                url: 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf',
                author: 'cernst',
                overlay:{
                    textColor : '#000000',
                    ornamentalColor : '#000000',
                    gradientColor: '#FFFFFF'
                }
            },
            {
                name: 'Moonlight',
                url: 'mapbox://styles/cernst11/cj717woq90grv2smxyxv1bqxi',
                author: 'cernst',
                overlay:{
                    textColor : '#DBDBDB',
                    ornamentalColor : '#DBDBDB',
                    gradientColor: '#000000'
                }
            }, 
            {
                name: 'Dark-Matter',
                url: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
                author: 'Open Map Tiles', 
                overlay:{
                    textColor : '#FFFFFF',
                    ornamentalColor : '#FFFFFF',
                    gradientColor: '#000000'
                }
            }, 
            {
                name: 'Toner',
                url: 'https://openmaptiles.github.io/toner-gl-style/style-cdn.json',
                author: 'Open Map Tiles', 
                overlay:{
                    textColor : '#FFFFFF',
                    ornamentalColor : '#FFFFFF',
                    gradientColor: '#000000'
                }
            },
            {
                name: 'OSM-Bright',
                url: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json',
                author: 'Open Map Tiles', 
                overlay:{
                    textColor : '#000000',
                    ornamentalColor : '#000000',
                    gradientColor: '#FFFFFF'
                }
            },
            
            {
                name: 'Vinatge',          
                url: 'mapbox://styles/mslee/cif5p01n202nisaktvljx9mv3',
                author: 'Open Map Tiles', 
                overlay:{
                    textColor : '#FF0000',
                    ornamentalColor : '#FF0000',
                    gradientColor: '#000000'
                }
            }

        ]

    }

    getStyleByName(name){
        return this.getStyles().filter(style => style.name === name);
    }

    getStyleByType(){


    }

}


