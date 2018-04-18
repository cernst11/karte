import Styles from './Styles'
import Worker from "./dataTransformations/googleLocationToGeoJson.worker.js";
import Fabric from 'Fabric'
import FontFaceObserver from 'FontFaceObserver';
import autoBind from 'auto-bind'
import FileSaver from 'file-Saver';
import PosterStylingPojo from './PosterStylingPojo';


/**
 *  Confgiure the styling of the poster
 */
export default class PosterStyling {

    constructor(map) {
        this.styles = new Styles;
        this.map = map.map;

        //get inputs
        this.cityInput = document.querySelector('#city');
        this.countryInput = document.querySelector('#country');
        this.locationInput = document.querySelector('#location');
        this.locationDataInput = document.querySelector('#data-file');

        this.html = document.getElementsByTagName('html')[0];

        //get control elements
        this.textColorPicker = document.querySelector('.text-color-picker');
        this.ornamentalColorPicker = document.querySelector('.ornamental-color-picker');
        this.gradientColorPicker = document.querySelector('.gradient-color-picker');
        this.ornamentalPosition = document.querySelector('.ornamental-position');
        this.ornamentalSize = document.querySelector('.ornamental-size');
        this.exportBtn = document.querySelector('.overlay-export');

        //bind this to this context
        this.posterStylingPojo = new PosterStylingPojo(2400, 1800)
        autoBind(this);

        //add event listeners
        this.pojoProxy = this.handler();
        this.createStyleSelector();
        this.addEventListeners();
        this.createOverlayCanvas();
    }


    addEventListeners() {

        this.addListenerMulti(this.cityInput, 'change input keyup keypress', this.updateText);
        this.addListenerMulti(this.countryInput, 'change input keyup keypress', this.updateText);
        this.addListenerMulti(this.locationInput, 'change input keyup keypress', this.updateText);
        this.textColorPicker.addEventListener("change", this.setTextColor, false);
        this.ornamentalColorPicker.addEventListener("change", this.setOrnamentalColor, false);
        this.gradientColorPicker.addEventListener("change", this.setGradientColor, false);
        this.ornamentalPosition.addEventListener("input", this.setOrnamentalPosition, false);
        this.ornamentalSize.addEventListener("input", this.setOrnamentalSize, false);
        this.locationDataInput.addEventListener("change", this.setLocationData, false)
        this.exportBtn.addEventListener("click", this.exportCanvas);
    }

    addListenerMulti(el, s, fn) {
        s.split(' ').forEach(e => el.addEventListener(e, fn, false));
    }

    updateText(e) {
        const target = e.target.id;
        this.pojoProxy[target].text = e.target.value;
    }

    async setLocationData(e) {
        const file = e.target.files[0];
        //console.log(file);
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        let worker = new Worker();
        reader.onload = async (e) => {
            worker.postMessage(JSON.parse(e.target.result));
            worker.onmessage = this.showHeatMap;
            e = {};
        }
    }

    showHeatMap(e) {
        console.log('Rendering Map')
        let that = this;
        //Add a geojson point source.
        //Heatmap layers also work with a vector tile source.
        let i = 0;
        e.data.forEach(subDataSet => {
            this.map.addSource('layer' + i, {
                "type": "geojson",
                "buffer": 64,
                "data": subDataSet,
                "tolerance": 0.999
            });

            this.map.addLayer({
                "id": "layer" + i,
                "type": "heatmap",
                "source": "layer" + i,
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

            i++;
        });

    }

    formatCoord(lat, long) {
        return ` ${lat.toFixed(4)}° ${lat < 0 ? 'S' : 'N'} / ${Math.abs(long.toFixed(4))}° ${long <  0 ? 'W' : 'E'}`;
    }

    setTextColor(e) {
        this.setColor(e.target.value, 'text')
    }

    setGradientColor(e) {
        this.setColor(e.target.value, 'gradient');
    }

    setOrnamentalColor(e) {
        this.setColor(e.target.value, 'ornament');
    }

    setColor(value, filter) {
     
        if (filter === 'gradient') {
            this.setGradientColorValue(value);
            return true;
        }
        Object.keys(this.pojoProxy).forEach((key) => {
            if (this.pojoProxy[key].type === filter) {
                this.pojoProxy[key].fill = value;
            }
        });    
    }

    setGradientColorValue(value){
        this.pojoProxy.gradientFill.colorStops['0'] = value.substr(1) + '00';
        this.pojoProxy.gradientFill.colorStops['0.26'] = value.substr(1);
        this.pojoProxy.gradientFill.colorStops['1'] = value.substr(1);
        this.gradient.setGradient('fill', this.pojoProxy.gradientFill);
    }

    setOrnamentalPosition(e) {
        const value = e.target.value;
        this.pojoProxy.leftOrnament.left = parseInt(value);
        this.pojoProxy.rightOrnament.left = this.pojoProxy.canvasW - value;
        this.leftOrnament.set(this.pojoProxy.leftOrnament);
        this.rightOrnament.set(this.pojoProxy.rightOrnament);
    }

    setOrnamentalSize(e) {
        const value = e.target.value;
        this.pojoProxy.leftOrnament.width = parseInt(value);
        this.pojoProxy.rightOrnament.width = parseInt(value);
        this.leftOrnament.set(this.pojoProxy.leftOrnament);
        this.rightOrnament.set(this.pojoProxy.rightOrnament);
    }

    /**
     * Pass the event to set the style by name
     * @param {event} style - the event that contains the style event
     */
    setStyle(style) {
        const newStyle = this.styles.getStyleByName(style.target.value)[0];
        this.map.setStyle(newStyle.url);
        this.setOverlayStyle(newStyle.overlay);
    }

    setOverlayStyle(style) {
        console.log(style);
        this.setColor(style.textColor, 'text');
        this.setColor(style.ornamentalColor , 'ornament');
        this.setColor(style.gradientColor , 'gradient');
    }


    /**
     * Create the Style selector 
     */
    createStyleSelector() {
        let styles = this.styles.getStyles();
        this.styleSelector = document.querySelector('.style-select');
        const option = `${styles.map(style => `<option value='${style.name}'>${style.name}</option>`)}`;
        this.styleSelector.innerHTML = option;
        this.styleSelector.onchange = this.setStyle;
    }

    createOverlayCanvas() {
        let mapCanvas = document.querySelector('canvas.mapboxgl-canvas');
        let overlayCanavas = document.createElement('canvas');
        overlayCanavas.setAttribute('id', 'overlay-canvas');
        overlayCanavas.setAttribute('height', 2400);
        overlayCanavas.setAttribute('width', 1800);
        let c = `<canvas id="overlay-canvas" height="${2400}" width="${1800}"></canvas>`
        mapCanvas.after(overlayCanavas);
        this.oCanvas = new fabric.Canvas('overlay-canvas');

        this.gradient = new fabric.Rect(this.pojoProxy.gradient);
        this.gradient.setGradient('fill', this.pojoProxy.gradientFill);

        this.leftOrnament = new fabric.Rect(this.pojoProxy.leftOrnament)
        this.rightOrnament = new fabric.Rect(this.pojoProxy.rightOrnament)

        this.oCanvas.add(this.gradient);
        this.oCanvas.add(this.leftOrnament);
        this.oCanvas.add(this.rightOrnament);


        this.city = new fabric.Textbox('BERLIN',
            this.pojoProxy.city
        );
        this.country = new fabric.Textbox('GERMANY',
            this.pojoProxy.country
        );
        this.location = new fabric.Textbox('52.5200° N / 13.4050° E',
            this.pojoProxy.location
        );

        this.oCanvas.on('text:changed', function (opt) {
            console.log('Scaling');
            var t1 = this.city;
            if (t1.width > t1.fixedWidth) {
                t1.fontSize *= t1.fixedWidth / (t1.width + 1);
                t1.width = t1.fixedWidth;
            }
        });

        this.loadFont(this.city, this.oCanvas)
        this.loadFont(this.country, this.oCanvas)
        this.loadFont(this.location, this.oCanvas)
    }

    loadFont(textbox, canvas, font = 'Montserrat') {
        let myFont = new FontFaceObserver(font);
        myFont.load().then(() => {
            canvas.add(textbox)
            textbox.centerH();
            textbox.set("fontFamily", font);
            canvas.requestRenderAll();
        }).catch((e) => {
            console.log(e);
        })
    }

    exportCanvas() {

    }

    handler() {
        let target = {}
        let that = this;
        let handler = {
            get(target, key) {
                if (typeof target[key] === 'object' && target[key] !== null) {
                    return new Proxy(target[key], handler);
                }
                return target[key];
            },
            set(target, key, value) {

                switch (key) {
                    case 'text':
                        target[key] = value.toUpperCase();
                        break
                    case 'font':
                        target[key] = value;
                    default:
                        target[key] = value;
                        break;
                }

                that.updateOverlay(key);
                return true
            }
        }
        return new Proxy(this.posterStylingPojo, handler)
    }

    updateOverlay() {
        Object.keys(this.pojoProxy).forEach((key) => {
            if (key in this)
                this[key].set(this.pojoProxy[key]);
        })
        this.gradient.setGradient('fill', this.pojoProxy.gradientFill);
        this.oCanvas.requestRenderAll();
    }
}