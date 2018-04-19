export default class PosterStylingPojo {
    constructor(canvasHeight, canvasWidth, ratio) {

        this.canvasH = 7500;
        this.canvasW = 5625;   
        this.ratio = window.devicePixelRatio;

        this.country = {
            type: 'text',
            text: 'GERMANY',
            textAlign: 'center',
            top: this.canvasH * .80,
            width: this.canvasW ,
            fontSize: (100 * this.ratio),
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
            fontSize: 190 * this.ratio,
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
            fontSize: 55 * this.ratio,
            fontWeight: 50,
            charSpacing: 100,
            fontFamily: 'Montserrat',
            fill:'black'
        };

        this.leftOrnament = {
            type: 'ornament',
            top: (this.canvasH * .80) + 50,
            left: 170 * this.ratio,
            width: 250 * this.ratio,
            height: 10,
            fill: 'black'
        };
        this.rightOrnament = {
            type: 'ornament',
            originX: 'right',
            top: (this.canvasH * .80) + 50,
            left: this.canvasW-(170 * this.ratio),
            width: 250 * this.ratio,
            height: 10 ,
            fill: 'black'
        };

        this.gradient = {
            type: 'gradient',
            top: this.canvasH-700 * this.ratio,
            left: 0,
            width: this.canvasW,
            height: 700 * this.ratio,
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