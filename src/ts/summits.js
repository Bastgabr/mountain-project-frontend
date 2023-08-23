window.onload = function () {
    coordinatesDictionary = new Map();
    //Retrieve the JSON file containing all summits info
    fetch('../json/summits.json')
        .then((response) => response.json())
        .then((json) => {
        console.log(json);
        Create82PeaksCards(json);
    });
};
/**
 * Create a card for every 82 items located in the JSON file
 * @param json string content of the JSON file
 */
function Create82PeaksCards(json) {
    // Deserialize the JSON data into an array of SummitInfo objects
    const summitInfoArray = json.map((item) => {
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
    for (var i = 0; i < summitInfoArray.length; i++) {
        CreateCard(summitInfoArray[i]);
    }
    LoadCardsMaps();
}
function CreateCard(summitInfo) {
    $('#peaks-section__content').append(`          
  <div id="summit-card-` + summitInfo.ranking + `" class="summit-card">
  <div id="summit-card-` + summitInfo.ranking + `-map" class="map"></div>
  <div id="summit-card-` + summitInfo.ranking + `-date" class="date-tag">
  ` + ToHtmlFormattedDate(summitInfo.summitDate) + `
    </div>
    <div id="summit-card-` + summitInfo.ranking + `-content" class="card-content">
      <h1 id="summit-card-` + summitInfo.ranking + `-title" class="card-title">` + summitInfo.name + `</h1>
      <div id="summit-card-` + summitInfo.ranking + `-info" class="card-info">
        <div id="summit-card-` + summitInfo.ranking + `-elevation" class="card-infoline">
          <p class="tag">Elevation</p>
          <p class="value">` + summitInfo.elevation + `</p>
        </div>
        <div id="summit-card-` + summitInfo.ranking + `-dateline" class="card-infoline">
          <p class="tag">Date</p>
          <p class="value">` + summitInfo.summitDate.toLocaleDateString() + `</p>
        </div>
        <div id="summit-card-` + summitInfo.ranking + `-attemps" class="card-infoline">
          <p class="tag">Number of attempts</p>
          <p class="value">` + summitInfo.attempts + `</p>
        </div>
        <div id="summit-card-` + summitInfo.ranking + `-location" class="card-infoline">
          <p class="tag">Location</p>
          <p class="value">` + summitInfo.location + `</p>
        </div>
      </div>
    </div>
    <div id="summmit-card-` + summitInfo.ranking + `-flag-container" class="card-flag-container">
      <div id="summmit-card-` + summitInfo.ranking + `-flag" class="card-flag ` + ToCSSFlagClass(summitInfo.countryCode) + `">
        <img>
      </div>
    </div>
  </div>
  `);
    //Hide the date label if not summitted
    if (!summitInfo.summitted) {
        $("#summit-card-" + summitInfo.ranking + "-date").hide();
        $("#summit-card-" + summitInfo.ranking + "-dateline").hide();
    }
    var entryStr = convertToLat(summitInfo.lat) + "," + convertToLong(summitInfo.long);
    coordinatesDictionary.set("summit-card-" + summitInfo.ranking + "-map", entryStr);
    //coordinatesDictionary["summit-card-"+ summitInfo.ranking +"-map"] = entryStr
}
//"6°51′52″E"
function dmsToDecimal(degrees, minutes, seconds, direction) {
    let decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
    if (direction === "S" || direction === "W") {
        decimalDegrees = -decimalDegrees;
    }
    return decimalDegrees;
}
function convertToLat(latDMS) {
    // Parse the latitude DMS string into degrees, minutes, seconds, and direction
    const matches = latDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);
    if (matches) {
        const degrees = parseInt(matches[1], 10);
        const minutes = parseInt(matches[2], 10);
        const seconds = parseInt(matches[3], 10);
        const direction = matches[4];
        return dmsToDecimal(degrees, minutes, seconds, direction);
    }
    else {
        throw new Error("Invalid latitude DMS format");
    }
}
function convertToLong(longDMS) {
    // Parse the longitude DMS string into degrees, minutes, seconds, and direction
    const matches = longDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);
    if (matches) {
        const degrees = parseInt(matches[1], 10);
        const minutes = parseInt(matches[2], 10);
        const seconds = parseInt(matches[3], 10);
        const direction = matches[4];
        return dmsToDecimal(degrees, minutes, seconds, direction);
    }
    else {
        throw new Error("Invalid longitude DMS format");
    }
}
/**
 * Iterate over all cards an initialize their maps
 */
function LoadCardsMaps() {
    coordinatesDictionary.forEach((value, key) => {
        let spl = value.split(",");
        let lat = spl[0];
        let long = spl[1];
        LoadCardMap(key, Number.parseInt(lat), Number.parseInt(long));
    });
}
function LoadCardMap(mapKey, lat, long) {
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
    if (map.tap)
        map.tap.disable();
}
var coordinatesDictionary = new Map();
/**
 * Converts the given date to an HTML formatted date for the card badge
 * @param date date
 * @returns HTML formatted date in a p mark
 */
function ToHtmlFormattedDate(date) {
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
function ToCSSFlagClass(countryCode) {
    var spl = countryCode.split(",");
    var retString = "";
    for (var i = 0; i < spl.length; i++) {
        retString += spl[i].toLowerCase() + " ";
    }
    return retString;
}
class SummitInfo {
    constructor() {
        this.ranking = null;
        this.name = null;
        this.elevation = null;
        this.lat = null;
        this.long = null;
        this.location = null;
        this.countryCode = null;
        this.summitted = false;
        this.summitDate = null;
        this.attempts = 0;
    }
}
//# sourceMappingURL=summits.js.map