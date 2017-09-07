import FileSaver from 'file-Saver';
import html2canvas from 'html2canvas';

/**
 * This class deals with exporting the canvas
 */
export default class CanvasClass {

    /**
     * Construct the data object and methods for the canvas class 
     * @param {number} width The width of the canvas
     * @param {number} height The height of the canvas
     */
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.canvas = this.getCanvas();

        this.mapExport = document.querySelector('.map-export');
        this.overlayExport = document.querySelector('.overlay-export');
        this.compImageExport = document.querySelector('.comp-image');

        this.exportMap = this.exportMap.bind(this);
        this.exportOverlayCanvas = this.exportOverlayCanvas.bind(this);
        this.generateImageComposite = this.generateImageComposite.bind(this);
        this.createCompositeCanvas = this.createCompositeCanvas.bind(this);

        this.addEventListeners();

    }

    addEventListeners() {
        this.mapExport.addEventListener('click', this.exportMap);
        this.overlayExport.addEventListener('click', this.exportOverlayCanvas);
        this.compImageExport.addEventListener('click', this.generateImageComposite);
    }

    /**
     * Helper function to get the mapBox canvas. mapBox applies a style to the canvas
     */
    getCanvas() {
        let canvasList = document.getElementsByClassName("mapboxgl-canvas");
        return canvasList[0];
    }

    /**
     * Get the canvas context and set perseve drawing buffer to false
     */
    getCanvasContext() {
        return this.canvas.getContext("experimental-webgl", {
            preserveDrawingBuffer: false
        });
    }

    /**
     * Generate a compostite image of the map and overlay
     */
    async generateImageComposite() {
        let mapImg = URL.createObjectURL(await this.exportImageBlob(this.canvas));
        let newDiv = this._createTempDiv();
        let that = this;
        html2canvas(newDiv, {
            onrendered(canvas) {
                canvas.toBlob(blob => {
                    let mapOverlay = URL.createObjectURL(blob);
                    let renderdComposite = that.createCompositeCanvas(mapImg, mapOverlay);
                    newDiv.parentNode.removeChild(newDiv);
                    
                }, "image/png");
            },
            width: 1800,
            height: 2400,
            letterRendering: true
        });
    }

    /**
     * Export a canvas as a png
     * @param {HtmlElement} canvas The canvas element to export
     * @param {string} imageType The type of image to export
     */
    async exportImageBlob(canvas, imageType = 'image/png') {
        let dpi = document.getElementById('dpi').value;
        return await this._getCanvasBlob(canvas, imageType);
    }

    /**
     * Save blob export
     */
    async exportMap(){
        let canvasBlob = await this.exportImageBlob(this.canvas);
        FileSaver.saveAs(canvasBlob, 'map.png' );
    }

    /**
     * Export the ovelay
     */
    exportOverlayCanvas() {
        let newDiv = this._createTempDiv();
        html2canvas(newDiv, {
            onrendered(canvas) {
                canvas.toBlob(blob => {
                    FileSaver.saveAs(blob, "overlay.png");
                    newDiv.parentNode.removeChild(newDiv);
                }, "image/png");

            },
            width: 1800,
            height: 2400,
            letterRendering: true
        });
    }

    /**
     * Create a temp div to hold the mapOverlay during export
     */
    _createTempDiv() {
        let contDiv = document.getElementsByClassName('map-overlay')[0];
        let cloneDiv = contDiv.cloneNode(true);
        document.body.append(cloneDiv);

        let newDiv = document.getElementsByClassName('map-overlay')[1];
        newDiv.style = 'transform: scale(1.0)!important';
        newDiv.style.height = '2400px';
        newDiv.style.width = '1800px';

        return newDiv;

    }

    /**
     * Turn the callback into a promoise
     * @param {Object} canvas The canvas to turn into blob
     */
    async _getCanvasBlob(canvas) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (blob) {
                resolve(blob)
            })
        })
    }

    /**
     * Composite the two files into a canvas and export the resulting composite 
     * @param {$} map The map to export
     * @param {*} overlay The overlay to export
     * @param {*} width The width of the canvas
     * @param {*} height The height of the canvas
     */
    async createCompositeCanvas(map, overlay, width = 5625, height = 7500, ) {
        try{
            let canvas = document.createElement('canvas');
            canvas.id = "compositeCanvas";
            canvas.width = width;
            canvas.height = height;
            canvas.style.zIndex = 8;
            document.body.appendChild(canvas);
    
            let mapImg = new window.Image();
            var overlayImg = new window.Image();
            mapImg.addEventListener('load', function () {
                canvas.getContext('2d').drawImage(mapImg, 0, 0);
                //scale the overlay to match the map 
                canvas.getContext('2d').drawImage(overlayImg, 0, 0,
                    overlayImg.width,
                    overlayImg.height, 
                    0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    FileSaver.saveAs(blob, "composite.png");
                    canvas.parentNode.removeChild(canvas);
                }, "image/png");
            });
    
            mapImg.setAttribute("src", map);
            overlayImg.setAttribute("src", overlay);
            
            return {completed: true, errors: null};

        }catch(e){
            return {completed: false, errors: e};
        }
    }

    /**
     * Helper function to help override the dpi. This exports the image at 300pixels per inch for a 18x24 poster
     * @param {Number} dpi 
     */
    setWindowDPI(dpi = 300) {
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function () {
                return dpi / 96
            }
        });
    }

}