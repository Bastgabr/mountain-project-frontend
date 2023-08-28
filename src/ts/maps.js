window.onload = function () {
    loadMap("presentation-map", 45, 6);
    //Hide loading screen
    $('#loading-screen').css({ "opacity": "0",
        "visibility": "hidden",
    });
};
function loadMap(mapKey, lat, long) {
    // Create Leaflet map on map element.
    var map = L.map(mapKey, { zoomControl: false });
    // Add OSM tile layer to the Leaflet map.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    // Target's GPS coordinates.
    var target = L.latLng(lat, long);
    map.setView(target, 9);
    var markerIcon = L.icon({ iconUrl: "../../src/images/yellow-pin.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });
    // Place a marker on the same location.
    L.marker(target, { icon: markerIcon }).addTo(map);
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap)
        map.tap.disable();
}
//# sourceMappingURL=maps.js.map