
window.onload = function() {


  fetch('../json/summits.json')
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
  Create82PeaksCards(json);
 
});

// Create Leaflet map on map element.
  var map = L.map('summit-card-0-map', { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  // Target's GPS coordinates.
  var target = L.latLng(46.117778, 7.714722);
  var pinIcon = L.icon({
    iconUrl: 'https://i.imgur.com/a/8gOHL89',
    iconSize:     [38, 95],
  });
  // Set map's center to target with zoom 14.
  map.setView(target, 8);

  // Place a marker on the same location.
  L.marker(target).addTo(map);
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();

  var map = L.map('summit-card-1-map', { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  // Target's GPS coordinates.
  var target = L.latLng(45.85715489181197, 6.887518646033523);
  var pinIcon = L.icon({
    iconUrl: 'https://i.imgur.com/a/8gOHL89',
    iconSize:     [38, 95],
  });
  // Set map's center to target with zoom 14.
  map.setView(target, 8);

  // Place a marker on the same location.
  L.marker(target).addTo(map);
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();

  var map = L.map('summit-card-2-map', { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  // Target's GPS coordinates.
  var target = L.latLng(46.117778, 7.714722);
  var pinIcon = L.icon({
    iconUrl: 'https://i.imgur.com/a/8gOHL89',
    iconSize:     [38, 95],
  });
  // Set map's center to target with zoom 14.
  map.setView(target, 8);

  // Place a marker on the same location.
  L.marker(target).addTo(map);
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();
}

function Create82PeaksCards(json){

  // Deserialize the JSON data into an array of SummitInfo objects
const summitInfoArray: SummitInfo[] = json.map((item) => {
  const summitInfo = new SummitInfo();
  summitInfo.ranking = item.ranking;
  summitInfo.elevation = item.elevation;
  summitInfo.name = item.name;
  summitInfo.lat = item.lat;
  summitInfo.long = item.long;
  summitInfo.location = item.location;
  summitInfo.countryCode = item.countryCode;
  summitInfo.summitted = item.summitted;
  summitInfo.summitDate = new Date(item.summitDate);
  summitInfo.attempts = item.attempts;
  return summitInfo;
});

  let summitInfo = new SummitInfo();
  summitInfo.location = "Hello world";
  for(var i = 0; i< summitInfoArray.length;i++){
    CreateCard(summitInfoArray[i]);
  }

  LoadCardsMaps();
}

function CreateCard(summitInfo: SummitInfo){
  $('#peaks-section__content').append(`          
  <div id="summit-card-`+ summitInfo.ranking +`" class="summit-card">
  <div id="summit-card-`+ summitInfo.ranking +`-map" class="map"></div>
  <div id="summit-card-`+ summitInfo.ranking +`-date" class="date-tag">
  `+ ToHtmlFormattedDate(summitInfo.summitDate) +`
    </div>
    <div id="summit-card-`+ summitInfo.ranking +`-content" class="card-content">
      <h1 id="summit-card-`+ summitInfo.ranking +`-title" class="card-title">`+ summitInfo.name +`</h1>
      <div id="summit-card-`+ summitInfo.ranking +`-info" class="card-info">
        <div id="summit-card-`+ summitInfo.ranking +`-elevation" class="card-infoline">
          <p class="tag">Elevation</p>
          <p class="value">`+ summitInfo.elevation +`</p>
        </div>
        <div id="summit-card-`+ summitInfo.ranking +`-date" class="card-infoline">
          <p class="tag">Date</p>
          <p class="value">`+ summitInfo.summitDate.toLocaleDateString() +`</p>
        </div>
        <div id="summit-card-`+ summitInfo.ranking +`-attemps" class="card-infoline">
          <p class="tag">Number of attempts</p>
          <p class="value">`+ summitInfo.attempts +`</p>
        </div>
        <div id="summit-card-`+ summitInfo.ranking +`-location" class="card-infoline">
          <p class="tag">Location</p>
          <p class="value">` + summitInfo.location +`</p>
        </div>
      </div>
    </div>
    <div id="summmit-card-`+ summitInfo.ranking +`-flag-container" class="card-flag-container">
      <div id="summmit-card-`+ summitInfo.ranking +`-flag" class="card-flag `+ ToCSSFlagClass(summitInfo.countryCode) +`">
        <img>
      </div>
    </div>
  </div>
  `);
  var entryStr = summitInfo.lat + "," + summitInfo.long;
  coordinatesDictionary["summit-card-"+ summitInfo.ranking +"-map"] = entryStr
}


function LoadCardsMaps(){
  Object.keys(coordinatesDictionary).forEach(key => {
    let value = coordinatesDictionary[key];
    let spl = value.split(",");
    let lat = spl[0];
    let long = spl[1];
    LoadCardMap(key,Number.parseInt(lat), Number.parseInt(long));
  });
}

function LoadCardMap(mapKey:string, lat: number, long: number){
  // Create Leaflet map on map element.
  var map = L.map(mapKey, { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  // Target's GPS coordinates.
  var target = L.latLng(lat, long);

  // Set map's center to target with zoom 14.
  map.setView(target, 8);

  // Place a marker on the same location.
  L.marker(target).addTo(map);
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();
}


var coordinatesDictionary : {[id:string]: string;};

/**
 * Converts the given date to an HTML formatted date for the card badge
 * @param date date
 * @returns HTML formatted date in a p mark
 */
function ToHtmlFormattedDate(date : Date){
  const day = date.getDate();
  const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  const formattedDate = `<p>${day}<br>${month}<br>${year}</p>`;
  return formattedDate;
}

/**
 * Converts the given csv string into css country code classes
 */
function ToCSSFlagClass(countryCode : string){

  var spl = countryCode.split(",");
  var retString = "";
  for(var i =0; i < spl.length;i++)
  {
    retString += spl[i].toLowerCase() + " ";
  }
  return retString;
}

class SummitInfo{
  public ranking:number = null;
  public name:string = null;
  public elevation:string = null;
  public lat:number = 0;
  public long:number = 0;
  public location:string = null;
  public countryCode:string = null;
  public summitted:boolean = false;
  public summitDate:Date = null;
  public attempts:number = 0;
}