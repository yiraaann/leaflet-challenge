// defining the GeoJSON URL
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let earthquakeData = new L.LayerGroup();

// creating the map
let myMap = L.map("map", {
    center: [37.7749, -110],
    zoom: 5
});

// adding tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

street.addTo(myMap);

// let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors'
//});

// topo.addTo(myMap);


// call json object, function to set marker radius
d3.json(url).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    // function to set map styles
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // function to adjust color based on depth
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }

    // function to adjust radius based on magnitude
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }


    // create legend
    let legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        depths = [-10, 10, 30, 50, 70, 90];
        colors = ["lightgreen", "yellow", "gold", "orange", "orangered", "red"];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(myMap);


 });

