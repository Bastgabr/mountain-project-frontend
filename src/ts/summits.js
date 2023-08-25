var summitInfoArray;
window.onload = function () {
    //Retrieve the JSON file containing all summits info
    fetch('../json/summits.json')
        .then((response) => response.json())
        .then((json) => {
        Create82PeaksCards(json);
        ShowLatestSummits(1);
        //Hide loading screen
        $('#loading-screen').css({ "opacity": "0",
            "visibility": "hidden",
        });
    });
};
$('#latest-section__select').on('change', function () {
    var selectedIndex = $(this).find(":selected").val();
    ShowLatestSummits(selectedIndex);
});
$('#peaks-section__selector select').on('change', function () {
    passive: false;
    //Retrieve selector values
    var selectorValue = Number($('#peaks-section__show-select').find(":selected").val());
    var orderValue = Number($('#peaks-section__order-select').find(":selected").val());
    HandleResetFilterVisibility(selectorValue, orderValue);
    var summitsToDisplay;
    switch (selectorValue) {
        case PeakSelection.All: {
            summitsToDisplay = summitInfoArray;
            break;
        }
        case PeakSelection.NonSummitted: {
            summitsToDisplay = summitInfoArray.filter(item => !item.summitted);
            break;
        }
        case PeakSelection.Summitted: {
            summitsToDisplay = summitInfoArray.filter(item => item.summitted);
            break;
        }
    }
    switch (orderValue) {
        case PeakOrdering.HeightDesc: {
            summitsToDisplay = OrderSummitsByHeightDesc(summitsToDisplay);
            break;
        }
        case PeakOrdering.HeightAsc: {
            summitsToDisplay = OrderSummitsByHeightAsc(summitsToDisplay);
            break;
        }
        case PeakOrdering.DateDesc: {
            summitsToDisplay = OrderSummitsByDateDesc(summitsToDisplay);
            break;
        }
        case PeakOrdering.DateAsc: {
            summitsToDisplay = OrderSummitsByDateAsc(summitsToDisplay);
            break;
        }
    }
    $('#peaks-section__content').html('');
    for (var i = 0; i < summitsToDisplay.length; i++) {
        CreateCard(summitsToDisplay[i].ranking, summitsToDisplay[i], '#peaks-section__content');
    }
});
function HandleResetFilterVisibility(selectorValue, orderValue) {
    if (selectorValue != 0 || orderValue != 0) {
        $('#button-reset-filter').css({ "display": "flex" });
    }
    else {
        $('#button-reset-filter').css({ "display": "none" });
    }
}
$('#button-reset-filter').on('click', function () {
    // Reset the selected index programmatically
    $('#peaks-section__show-select').prop('selectedIndex', 0);
    $('#peaks-section__order-select').prop('selectedIndex', 0);
    $('#button-reset-filter').css({ "display": "none" });
    $('#peaks-section__content').html('');
    for (var i = 0; i < summitInfoArray.length; i++) {
        CreateCard(summitInfoArray[i].ranking, summitInfoArray[i], '#peaks-section__content');
    }
});
/**
 * Creates the HTML content of the Latest summit section.
 * The given number summitsCount will determine the amount of summits to display
 * @param summitsCount
 */
function ShowLatestSummits(summitsCount) {
    var achievedSummit = summitInfoArray.filter(item => item.summitted);
    //Sort by latest date
    achievedSummit = OrderSummitsByDateDesc(achievedSummit);
    var selectedSummits;
    $('#latest-section__content').html('');
    for (var i = 0; i < summitsCount; i++) {
        CreateCard(achievedSummit[i].ranking + 100, achievedSummit[i], '#latest-section__content');
    }
}
/**
 * Orders the given array of summits by descending height
 * @param summits input array of summits
 * @returns ordered array of summits
 */
function OrderSummitsByHeightDesc(summits) {
    return summits.sort((a, b) => {
        if (a.elevation > b.elevation) {
            return -1;
        }
        else if (a.elevation < b.elevation) {
            return 1;
        }
        else {
            return 0;
        }
    });
}
/**
 * Orders the given array of summits by ascending height
 * @param summits input array of summits
 * @returns ordered array of summits
 */
function OrderSummitsByHeightAsc(summits) {
    return summits.sort((a, b) => {
        if (a.elevation < b.elevation) {
            return -1;
        }
        else if (a.elevation > b.elevation) {
            return 1;
        }
        else {
            return 0;
        }
    });
}
/**
 * Orders the given array of summits by descending date
 * @param summits input array of summits
 * @returns ordered array of summits
 */
function OrderSummitsByDateDesc(summits) {
    return summits.sort((a, b) => {
        if (a.summitDate > b.summitDate) {
            return -1;
        }
        else if (a.summitDate < b.summitDate) {
            return 1;
        }
        else {
            return 0;
        }
    });
}
/**
 * Orders the given array of summits by ascending date
 * @param summits input array of summits
 * @returns ordered array of summits
 */
function OrderSummitsByDateAsc(summits) {
    return summits.sort((a, b) => {
        if (a.summitDate < b.summitDate) {
            return -1;
        }
        else if (a.summitDate > b.summitDate) {
            return 1;
        }
        else {
            return 0;
        }
    });
}
/**
 * Create a card for every 82 items located in the JSON file
 * @param json string content of the JSON file
 */
function Create82PeaksCards(json) {
    // Deserialize the JSON data into an array of SummitInfo objects
    if (summitInfoArray == undefined || summitInfoArray.length != 82)
        summitInfoArray = json.map((item) => {
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
    for (var i = 0; i < summitInfoArray.length; i++) {
        CreateCard(summitInfoArray[i].ranking, summitInfoArray[i], '#peaks-section__content');
    }
}
/**
 * Create a summit info card
 * @param summitInfo
 */
function CreateCard(index, summitInfo, parentDivId) {
    $(parentDivId).append(`          
  <div id="summit-card-` + index + `" class="summit-card">
  <div id="summit-card-` + index + `-map" class="map"></div>
  <div id="summit-card-` + index + `-date" class="date-tag">
  ` + ToHtmlFormattedDate(summitInfo.summitDate) + `
    </div>
    <div id="summit-card-` + index + `-content" class="card-content">
      <h1 id="summit-card-` + index + `-title" class="card-title">` + summitInfo.name + `</h1>
      <div id="summit-card-` + index + `-info" class="card-info">
        <div id="summit-card-` + index + `-rank" class="card-infoline">
          <p class="tag">Rank</p>
          <p class="value">` + summitInfo.ranking + `/82</p>
        </div>
        <div id="summit-card-` + index + `-elevation" class="card-infoline">
          <p class="tag">Elevation</p>
          <p class="value">` + summitInfo.elevation + ` m</p>
        </div>
        <div id="summit-card-` + index + `-dateline" class="card-infoline">
          <p class="tag">Date</p>
          <p class="value">` + summitInfo.GetSummitDate() + `</p>
        </div>
        <div id="summit-card-` + index + `-attemps" class="card-infoline">
          <p class="tag">Number of attempts</p>
          <p class="value">` + summitInfo.attempts + `</p>
        </div>
        <div id="summit-card-` + index + `-location" class="card-infoline">
          <p class="tag">Location</p>
          <p class="value">` + summitInfo.location + `</p>
        </div>
        <div id="summit-card-` + index + `-country" class="card-infoline">
        </div>
      </div>
    </div>
    <div id="summmit-card-` + index + `-flag-container" class="card-flag-container">
      <div id="summmit-card-` + index + `-flag" class="card-flag ` + ToCSSFlagClass(summitInfo.countryCode) + `">
        <img>
      </div>
    </div>
  </div>
  `);
    AddCountryToCard(summitInfo.countryCode, '#summit-card-' + index + '-country');
    //Hide the date label if not summitted
    if (!summitInfo.summitted) {
        $("#summit-card-" + index + "-date").hide();
        $("#summit-card-" + index + "-dateline").hide();
    }
    else {
        $("#summit-card-" + index).addClass("summited");
    }
    LoadCardMap("summit-card-" + index + "-map", summitInfo.GetFormattedLatitude(), summitInfo.GetFormattedLongitude());
}
/**
 * adds the country to the given parentDiv
 * @param countyCode list of country codes csv (,)
 * @param parentDiv Jquery name of the parent div
 */
function AddCountryToCard(countyCode, parentDiv) {
    let codes = countyCode.split(',');
    if (codes.length == 1) {
        $(parentDiv).append(`
    <p class="tag">Coutry</p>
    <p class="value">` + CountryCodeToCountryName(codes[0]) + `</p>
    `);
    }
    else {
        $(parentDiv).append(`
    <p class="tag">Coutries</p>
    <p class="value">` + CountryCodeToCountryName(codes[0]) + ` & `
            + CountryCodeToCountryName(codes[1]) + `</p>`);
    }
}
/**
 *
 * @param countryCode country code (containing only one code)
 * @returns the full name of the country
 */
function CountryCodeToCountryName(countryCode) {
    let trimmedCode = countryCode.trim().toLowerCase();
    if (trimmedCode === 'ch')
        return 'Switzerland';
    if (trimmedCode === 'fr')
        return 'France';
    if (trimmedCode === 'it')
        return 'Italy';
}
/**
 * Load the map for the given div map container.
 * place a pin at the given latitude and longitude
 * @param mapKey map container
 * @param lat latitude in DMS
 * @param long longitude in DMS
 */
function LoadCardMap(mapKey, lat, long) {
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
    /**
     * Return date in format dd/mm/yyyy
     * @returns date as string
     */
    GetSummitDate() {
        return this.summitDate.getDate() +
            "/" +
            (this.summitDate.getMonth() + 1) +
            "/" +
            +this.summitDate.getFullYear();
    }
    /**
     * Returns the Latitude in float format
     * @returns Latitude in float format
     */
    GetFormattedLatitude() {
        return this.ConvertToLat(this.lat);
    }
    /**
     * Returns the Longitude in float format
     * @returns Longitude in float format
     */
    GetFormattedLongitude() {
        return this.ConvertToLong(this.long);
    }
    /**
    * Converts the given DMS coordinates into floating coordinates
    * @param degrees number of degrees
    * @param minutes number of minutes
    * @param seconds number of seconds
    * @param direction direction letter N S E W
    * @returns converted coordinate (float)
    */
    DmsToDecimal(degrees, minutes, seconds, direction) {
        let decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
        if (direction === "S" || direction === "W") {
            decimalDegrees = -decimalDegrees;
        }
        return decimalDegrees;
    }
    /**
     * Converts the latitude DMS string into a floating point representation
     * @param latDMS latitude in DMS format
     * @returns latitude in float format
     */
    ConvertToLat(latDMS) {
        // Parse the latitude DMS string into degrees, minutes, seconds, and direction
        const matches = latDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);
        if (matches) {
            const degrees = parseInt(matches[1], 10);
            const minutes = parseInt(matches[2], 10);
            const seconds = parseInt(matches[3], 10);
            const direction = matches[4];
            return this.DmsToDecimal(degrees, minutes, seconds, direction);
        }
        else {
            throw new Error("Invalid latitude DMS format");
        }
    }
    /**
     * Converts the longitude DMS string into a floating point representation
     * @param longDMS longitude in DMS format
     * @returns longitude in float format
     */
    ConvertToLong(longDMS) {
        // Parse the longitude DMS string into degrees, minutes, seconds, and direction
        const matches = longDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);
        if (matches) {
            const degrees = parseInt(matches[1], 10);
            const minutes = parseInt(matches[2], 10);
            const seconds = parseInt(matches[3], 10);
            const direction = matches[4];
            return this.DmsToDecimal(degrees, minutes, seconds, direction);
        }
        else {
            throw new Error("Invalid longitude DMS format");
        }
    }
}
var PeakSelection;
(function (PeakSelection) {
    PeakSelection[PeakSelection["All"] = 0] = "All";
    PeakSelection[PeakSelection["NonSummitted"] = 1] = "NonSummitted";
    PeakSelection[PeakSelection["Summitted"] = 2] = "Summitted";
})(PeakSelection || (PeakSelection = {}));
var PeakOrdering;
(function (PeakOrdering) {
    PeakOrdering[PeakOrdering["HeightDesc"] = 0] = "HeightDesc";
    PeakOrdering[PeakOrdering["HeightAsc"] = 1] = "HeightAsc";
    PeakOrdering[PeakOrdering["DateDesc"] = 2] = "DateDesc";
    PeakOrdering[PeakOrdering["DateAsc"] = 3] = "DateAsc";
})(PeakOrdering || (PeakOrdering = {}));
//# sourceMappingURL=summits.js.map