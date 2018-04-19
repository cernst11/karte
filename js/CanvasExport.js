import FileSaver from 'file-Saver';
import html2canvas from 'html2canvas';
import CanvasToTIFF from './lib/canvasToTIFF/canvastotiff'
import autoBind from 'auto-bind'


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
        this.canvas = document.querySelector('.mapboxgl-canvas');
        this.oCanvas = document.querySelector('#overlay-canvas');
        this.compatibilityCheck();

        this.mapExport = document.querySelector('.map-export');
        this.overlayExport = document.querySelector('.overlay-export');
        this.compImageExport = document.querySelector('.comp-image');
        this.exportType = document.querySelector('.export-select');
        this.cCanvas;
        autoBind(this);
        this.addEventListeners();
    }

    addEventListeners() {
        this.mapExport.addEventListener('click', this.exportMapToFile);
        this.overlayExport.addEventListener('click', this.exportOverlayToFile);
        this.compImageExport.addEventListener('click', this.exportCompositeToFile);

    }

    async canvasToPng(canvas) {
        return await this.getCanvasBlob(canvas);
    }

    async canvasToTiff(canvas) {
        return await this.getCanvasBlobTIFF(canvas);
    }

    async writeCanvasToFile(canvas, type = 'png') {
        let blob = type === 'png' ? await this.canvasToPng(canvas) : await this.canvasToTiff(canvas);
        FileSaver.saveAs(blob, `file.${type}`);
    }

    async exportMapToFile() {
        this.writeCanvasToFile(this.canvas, this.getExportType().toLowerCase());
    }

    async exportOverlayToFile() {
        this.writeCanvasToFile(this.oCanvas, this.getExportType().toLowerCase());
    }

    async exportCompositeToFile() {
        this.createCompositeCanvas(this.getExportType().toLowerCase());
        //this.writeCanvasToFile(this.canvas, this.getExportType().toLowerCase());
    }

        /**
     * Composite the two files into a canvas and export the resulting composite 
     * @param {string} mime export type
     * @param {Number} [width] The width of the canvas
     * @param {Number} [height] The height of the canvas
     */
    async createCompositeCanvas(mime) {
        this.drawOverlay()
        let canvas = document.createElement('canvas');
        canvas.id = "compositeCanvas";
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
        canvas.style.zIndex = 8;
        document.body.appendChild(canvas);

        let mapImage = new window.Image();
        var overlayImage = new window.Image();
        let ctx = canvas.getContext('2d');

        mapImage.addEventListener('load', () => {
            ctx.drawImage(mapImage, 0, 0);
            ctx.drawImage(overlayImage, 0, 0,
                overlayImage.width,
                overlayImage.height,
                0, 0, canvas.width, canvas.height);
            this.writeCanvasToFile(canvas, mime);
            canvas.remove();
            this.hideOverlay();
        }, false);

        mapImage.src = URL.createObjectURL(await this.canvasToPng(this.canvas));
        overlayImage.src = URL.createObjectURL(await this.canvasToPng(this.oCanvas));
    }

    /**
     * Get the canvas context and set perseve drawing buffer to false
     */
    getCanvasContext() {
        return this.canvas.getContext("experimental-webgl", {
            preserveDrawingBuffer: false
        });
    }

    async getCanvasBlob(canvas, type = 'image/png') {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, type)
        })
    }
    async getCanvasBlobTIFF(canvas) {
        return new Promise((resolve, reject) => {
            CanvasToTIFF.toBlob(canvas, blob => {
                resolve(blob)
            }, this.tiffExportProperties());
        })
    }

    compatibilityCheck() {
        if (!this.canvas.toBlob) {
            this.drawOverlay()
        }
    }

    drawOverlay() {
        let overlay = document.createElement('div');
        overlay.id = "overlay";
        document.querySelector('body').appendChild(overlay);
    }

    hideOverlay() {
        const overlay = document.getElementById("overlay");
        overlay.parentNode.removeChild(overlay);
    }

    getExportType() {
        return this.exportType.options[this.exportType.selectedIndex].value;
    }

    /**
     * Export Tiff  propeties
     */
    tiffExportProperties(compressm, dpi) {
        return { // options
            compress: false,
            dpi: 300,
            onError: function (e) {
                console.log("Error:", e)
            }
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