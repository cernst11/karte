export default class Styles {
    constructor() {
    
            console.log("Styles");
    }

    getStyles() {

        return [{
                name: 'Simple',
                url: 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf',
                author: 'cernst'
            },
            {
                name: 'Moonlight',
                url: 'mapbox://styles/cernst11/cj717woq90grv2smxyxv1bqxi',
                author: 'cernst'
            }, 
            {
                name: 'Dark',
                url: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
                author: ''
            }

        ]

    }

    getStyleByName(name){
        let r = this.getStyles().filter(style => style.name === name);
        console.log(r);
        return r;
    }

    getStyleByType(){


    }

}