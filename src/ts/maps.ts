var summitInfoArray: Common.SummitInfo[];

window.onload = function() {

  fetch('../json/summits.json')
    .then((response) => response.json())
    .then((json) => {
      summitInfoArray = Common.ExtractSummitInfos(json);
      LoadGeneralMap("presentation-map", summitInfoArray);
    });

    
  //Hide loading screen
  $('#loading-screen').css(
    {"opacity":"0",
    "visibility":"hidden",
    });
}



function LoadGeneralMap(mapKey:string, summitInfo: Common.SummitInfo[]){
  // Create Leaflet map on map element.
  var map = L.map(mapKey, { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
  //L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}///{y}/{x}', {
  //  //attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
  //  //maxZoom: 13
  //}).addTo(map);
  //L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
  //  //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> //contributors &//copy; <a href="https://carto.com/attributions">CARTO</a>',
  //  subdomains: 'abcd',
  //  maxZoom: 20
  //}).addTo(map);

  var markerGroup = new Array();
  for(var i = 0; i < summitInfo.length; i++){
    var markerIcon = L.icon({ iconUrl: SelectMarkerIconUrl(summitInfo[i]),
      iconSize:     [30, 30], // size of the icon
      iconAnchor:   [15, 30],
    });

    var target = L.latLng(summitInfo[i].GetFormattedLatitude(), summitInfo[i].GetFormattedLongitude());
    // Place a marker on the same location.
    var marker = L.marker(target, {icon: markerIcon});
    marker.bindTooltip(summitInfo[i].name + ' | ' + summitInfo[i].elevation + 'm', {offset: [5,-25]});
    marker.addTo(map);
    //add all the markers to a group to compute the bounding box
    markerGroup.push(marker);
  }
  //Compute the bounding box
  var group = L.featureGroup(markerGroup);
  var paddingValue = 25;
  map.fitBounds(group.getBounds(), {padding: [0, paddingValue]});
  
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();
}

/**
 * Select different icon color depending on 
 * @param summitInfo summit info 
 * @returns url of the marker image
 */
function SelectMarkerIconUrl(summitInfo: Common.SummitInfo) : string {
  var iconColor = 'yellow';
  switch(summitInfo.location){
    case 'Massif du Mont-Blanc':
      iconColor = 'yellow';
      break;
    case 'Alpes pennines':
      iconColor = 'pink';
      break;
    case 'Alpes bernoises':
      iconColor = 'blue';
      break;
    case 'Chaîne de la Bernina':
      iconColor = 'green';
      break;
    case 'Massif du Grand-Paradis':
      iconColor = 'orange';
      break;
    case 'Massif des Écrins':
      iconColor = 'red';
      break;
  }
  return '../../src/images/'+ iconColor+ '-pin.png'
}
