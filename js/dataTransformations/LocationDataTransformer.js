import Worker from "./googleLocationToGeoJson.worker.js";

export default class LocationDataTransformer{
    constructor(){
        this.worker = new Worker();
        this.googleToGeoJSON.bind(this);
        this.pData;
    }

    async googleToGeoJSON(data){
        console.log("Starting webworker");
   
/*         this.worker.addEventListener('message', (d) => {
            console.log("Transformation Complete")
            pData =  d.data;
        }); */

        this.worker.postMessage(data);
        return this.worker;
    }


}

