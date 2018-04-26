onmessage = (data) => {
    console.log('Data reacived')
    let i = 0;
    let locations = [];
    const numberOfLocations = Math.floor(data.data.locations / 2);

    let layerAmount = 150000;
    let geoExport = [];
    data.data.locations.forEach(location => {


        let loc = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [location.longitudeE7 * (10 ** -7), location.latitudeE7 * (10 ** -7), 0.0]
            },
            "properties": {
                "time": location.timestampMs,
            }
        }
        locations.push(loc);
    });

    data = {};
    const geoJson = buildGeoLayerDataSet(locations);

    postMessage(geoJson);
};

let buildGeoLayerDataSet = (locations) => {
    let groupedData = createGroupedArray(locations, 150000);
    let layerDataSet = [];
    groupedData.forEach(data => {
        layerDataSet.push({
            "type": "FeatureCollection",
            'features': data
        })
    });
    return layerDataSet;
}

let createGroupedArray = (arr, chunkSize) => {
    let groups = [],i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}