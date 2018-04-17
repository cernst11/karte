export default class PosterStylingPojo {
    constructor(canvasHeight, canvasWidth) {

        this.canvasH = 2400;
        this.canvasW = 1800;  
        this.country = {
            type: 'text',
            text: 'GERMANY',
            textAlign: 'center',
            top: this.canvasH * .80,
            width: this.canvasW ,
            fontSize: 100,
            charSpacing:500,
            fontFamily: 'Montserrat',
            fill:'black'
        };

        this.city = {
            type: 'text',
            text: 'BERLIN',
            textAlign: 'center',
            top: this.canvasH * .70,
            width: this.canvasW ,
            fontSize: 190,
            charSpacing:200,
            fixedWidth: this.canvasW,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill:'black'
        };
        this.location={
            type: 'text',
            text: '52.5200° N / 13.4050° E',
            textAlign: 'center',
            top: this.canvasH * .87,
            width: this.canvasW,
            fontSize: 55,
            fontWeight: 100,
            charSpacing: 100,
            fontFamily: 'Montserrat',
            fill:'black'
        };

        this.leftOrnament = {
            type: 'ornament',
            top: (this.canvasH * .80) + 50,
            left: 160,
            width: 250,
            height: 10,
            fill: 'black'
        };
        this.rightOrnament = {
            type: 'ornament',
            top: (this.canvasH * .80) + 50,
            left: this.canvasW-this.leftOrnament.width-this.leftOrnament.left,
            width: 250,
            height: 10,
            fill: 'black'
        };

        this.gradient = {
            type: 'gradient',
            top: this.canvasH-700,
            left: 0,
            width: this.canvasW,
            height: 700,
            fill: 'FFFFFF',
        }

        this.gradientFill ={

            x1: 0,
            y1: 0,
            x2: 0,
            y2: this.gradient.height,
            colorStops:{
                0: this.gradient.fill + '00',
                0.26: this.gradient.fill,
                1: this.gradient.fill
            },
        }
    }
}