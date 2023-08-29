import { ExtractSummitInfos } from './common.js';
var summitInfoArray;
window.onload = function () {
    fetch('../json/summits.json')
        .then((response) => response.json())
        .then((json) => {
        summitInfoArray = ExtractSummitInfos(json);
        LoadGeneralMap("presentation-map", summitInfoArray);
    });
    //Hide loading screen
    $('#loading-screen').css({ "opacity": "0",
        "visibility": "hidden",
    });
};
function LoadGeneralMap(mapKey, summitInfo) {
    // Create Leaflet map on map element.
    var map = L.map(mapKey, { zoomControl: false });
    // Add OSM tile layer to the Leaflet map.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    // Target's GPS coordinates.
    var target = L.latLng(45, 6);
    map.setView(target, 6);
    var markerIcon = L.icon({ iconUrl: "../../src/images/yellow-pin.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });
    var markerGroup = new Array();
    for (var i = 0; i < summitInfo.length; i++) {
        target = L.latLng(summitInfo[i].GetFormattedLatitude(), summitInfo[i].GetFormattedLongitude());
        // Place a marker on the same location.
        var marker = L.marker(target, { icon: markerIcon });
        marker.addTo(map);
        markerGroup.push(marker);
    }
    var group = L.featureGroup(markerGroup);
    map.fitBounds(group.getBounds());
    //map.dragging.disable();
    //map.touchZoom.disable();
    //map.doubleClickZoom.disable();
    //map.scrollWheelZoom.disable();
    //map.boxZoom.disable();
    //map.keyboard.disable();
    if (map.tap)
        map.tap.disable();
}
//# sourceMappingURL=maps.js.map