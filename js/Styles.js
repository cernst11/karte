export class Styles {
    constructor(mapBox) {
        this.styles = this.getStyles();
        this.mapBox = mapBox;




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
            }

        ]

    }

    getStyleByName(name){
        return this.styles.filter(style => style[name]);
    }

    getStyleByType(){


    }

    setStyle(style){
        this.mapBox.changeStyle(style);
    }

}