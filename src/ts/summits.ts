
var summitInfoArray: SummitInfo[];

window.onload = function() {

  //Retrieve the JSON file containing all summits info
    fetch('../json/summits.json')
    .then((response) => response.json())
    .then((json) => {
    Create82PeaksCards(json);
    ShowLatestSummits(1);
    $('#loading-screen').css(
      {"opacity":"0",
      "visibility":"hidden",
      });
  });
}

$('#latest-section__select').on('change', function() {
  var selectedIndex = <number>$(this).find(":selected").val(); 
  ShowLatestSummits(selectedIndex);
});


function ShowLatestSummits(summitsCount:number){
  var achievedSummit = summitInfoArray.filter(item => item.summitted);

  //Sort by latest date
  achievedSummit.sort((a, b) => {
    if (a.summitDate > b.summitDate) {
      return -1;
    } else if (a.summitDate < b.summitDate) {
      return 1;
    } else {
      return 0;
    }
  });

  var selectedSummits : SummitInfo[];
  $('#latest-section__content').html('');
  for(var i = 0; i < summitsCount; i++){
    CreateCard(achievedSummit[i].ranking, achievedSummit[i],'#latest-section__content');
  }
}

/**
 * Create a card for every 82 items located in the JSON file
 * @param json string content of the JSON file
 */
function Create82PeaksCards(json){

  // Deserialize the JSON data into an array of SummitInfo objects
  if(summitInfoArray == undefined || summitInfoArray.length != 82)
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

  for(var i = 0; i< summitInfoArray.length;i++){
    CreateCard(summitInfoArray[i].ranking, summitInfoArray[i], '#peaks-section__content');
  }
}

/**
 * Create a summit info card
 * @param summitInfo 
 */
function CreateCard(index: number, summitInfo: SummitInfo, parentDivId: string){
  $(parentDivId).append(`          
  <div id="summit-card-`+ index +`" class="summit-card">
  <div id="summit-card-`+ index +`-map" class="map"></div>
  <div id="summit-card-`+ index +`-date" class="date-tag">
  `+ ToHtmlFormattedDate(summitInfo.summitDate) +`
    </div>
    <div id="summit-card-`+ index +`-content" class="card-content">
      <h1 id="summit-card-`+ index +`-title" class="card-title">`+ summitInfo.name +`</h1>
      <div id="summit-card-`+ index +`-info" class="card-info">
        <div id="summit-card-`+ index +`-rank" class="card-infoline">
          <p class="tag">Rank</p>
          <p class="value">`+ summitInfo.ranking +`/82</p>
        </div>
        <div id="summit-card-`+ index +`-elevation" class="card-infoline">
          <p class="tag">Elevation</p>
          <p class="value">`+ summitInfo.elevation +` m</p>
        </div>
        <div id="summit-card-`+ index +`-dateline" class="card-infoline">
          <p class="tag">Date</p>
          <p class="value">`+ summitInfo.summitDate.toLocaleDateString() +`</p>
        </div>
        <div id="summit-card-`+ index +`-attemps" class="card-infoline">
          <p class="tag">Number of attempts</p>
          <p class="value">`+ summitInfo.attempts +`</p>
        </div>
        <div id="summit-card-`+ index +`-location" class="card-infoline">
          <p class="tag">Location</p>
          <p class="value">` + summitInfo.location +`</p>
        </div>
        <div id="summit-card-`+ index +`-country" class="card-infoline">
        </div>
      </div>
    </div>
    <div id="summmit-card-`+ index +`-flag-container" class="card-flag-container">
      <div id="summmit-card-`+ index +`-flag" class="card-flag `+ ToCSSFlagClass(summitInfo.countryCode) +`">
        <img>
      </div>
    </div>
  </div>
  `);
  AddCountryToCard(summitInfo.countryCode, '#summit-card-'+ index +'-country');
  //Hide the date label if not summitted
  if(!summitInfo.summitted){
    $("#summit-card-"+ index +"-date").hide();
    $("#summit-card-"+ index +"-dateline").hide();
    
  }
  else{
    $("#summit-card-"+ index).addClass("summited");
  }


  LoadCardMap("summit-card-"+ index +"-map",convertToLat(summitInfo.lat ), convertToLong(summitInfo.long));
}

function dmsToDecimal(degrees: number, minutes: number, seconds: number, direction: string): number {
  let decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);

  if (direction === "S" || direction === "W") {
    decimalDegrees = -decimalDegrees;
  }

  return decimalDegrees;
}

function convertToLat(latDMS: string): number {
  // Parse the latitude DMS string into degrees, minutes, seconds, and direction
  const matches = latDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);

  if (matches) {
    const degrees = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = parseInt(matches[3], 10);
    const direction = matches[4];
    
    return dmsToDecimal(degrees, minutes, seconds, direction);
  } else {
    throw new Error("Invalid latitude DMS format");
  }
}

function convertToLong(longDMS: string): number {
  // Parse the longitude DMS string into degrees, minutes, seconds, and direction
  const matches = longDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);

  if (matches) {
    const degrees = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = parseInt(matches[3], 10);
    const direction = matches[4];
    
    return dmsToDecimal(degrees, minutes, seconds, direction);
  } else {
    throw new Error("Invalid longitude DMS format");
  }
}


function SortBy(){
  //var result = $('div').sort(function (a, b) {
  //
  //  var contentA =parseInt( $(a).data('sort'));
  //  var contentB =parseInt( $(b).data('sort'));
  //  return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
  //});
  //
  //$('#peaks-section__content').html(result);
}

/**
 * adds the country to the given parentDiv
 * @param countyCode list of country codes csv (,)
 * @param parentDiv Jquery name of the parent div
 */
function AddCountryToCard(countyCode:string, parentDiv: string){

  let codes = countyCode.split(',');
  if(codes.length == 1){
    $(parentDiv).append(`
    <p class="tag">Coutry</p>
    <p class="value">` + CountryCodeToCountryName(codes[0]) +`</p>
    `);
  }
  else{
    $(parentDiv).append(`
    <p class="tag">Coutries</p>
    <p class="value">` + CountryCodeToCountryName(codes[0]) + ` & ` 
    + CountryCodeToCountryName(codes[1]) +`</p>`);
  }
}

/**
 * 
 * @param countryCode country code (containing only one code)
 * @returns the full name of the country
 */
function CountryCodeToCountryName(countryCode:string){
  let trimmedCode = countryCode.trim().toLowerCase();
  if(trimmedCode === 'ch') return 'Switzerland'
  if(trimmedCode === 'fr') return 'France'
  if(trimmedCode === 'it') return 'Italy'
}

function LoadCardMap(mapKey:string, lat: number, long: number){
  // Create Leaflet map on map element.
  var map = L.map(mapKey, { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  // Target's GPS coordinates.
  var target = L.latLng(lat, long);

  map.setView(target, 9);

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
  public lat:string = null;
  public long:string = null;
  public location:string = null;
  public countryCode:string = null;
  public summitted:boolean = false;
  public summitDate:Date = null;
  public attempts:number = 0;
}