var summitInfoArray: Common.SummitInfo[];
var map;
window.onload = function() {

  fetch('../json/summits.json')
    .then((response) => response.json())
    .then((json) => {
      summitInfoArray = Common.ExtractSummitInfos(json);
      LoadGeneralMap("presentation-map", summitInfoArray);
      LoadMapsNavBar(summitInfoArray);
    });

    
  //Hide loading screen
  Common.HideLoadingScreen();
}


var timeout;
$('.nav-arrow').on('mousedown touchstart', function() {
  let id = this.id;
  timeout = setInterval(function(){
    var scrollArea = $('#summit-area');
    if(id === 'right-arrow')
      scrollArea.scrollLeft(scrollArea.scrollLeft()+1)
    else
      scrollArea.scrollLeft(scrollArea.scrollLeft()-1)
  }, 5);  // <--- Change this value to speed up/slow down scrolling
  return false;
});
$('.nav-arrow').on('mouseup touchend', function() {
  clearInterval(timeout);
  return false;
});


$('#nav-mode-button').on('mouseup', function() {
  let navMode = $('#nav-mode-button');
  if(navMode.hasClass('disable')){
    $('#nav-mode-button').removeClass('disable');
    $('#nav-mode-button').addClass('enable');
    $('#nav-mode-button i').addClass('fa-lock-open');
    $('#nav-mode-button i').removeClass('fa-lock');
    ToggleMapNavigation(true);
    
  }
  else{
    $('#nav-mode-button').removeClass('enable');
    $('#nav-mode-button').addClass('disable');
    $('#nav-mode-button i').addClass('fa-lock');
    $('#nav-mode-button i').removeClass('fa-lock-open');
    ToggleMapNavigation(false);
    //TODO : recenter map when disabled
  }
});

$('#presentation-map').on('click','.leaflet-marker-icon', function(){
  var summit = summitInfoArray.find(x=> x.ranking == this.title);
  SelectSummitAndFlyTo(summit);
})

$('#summit-area').on('click','.summit-dot__icon' , function(){
  let ranking = this.id.match(/\d+/)[0];
  var summit = summitInfoArray.find(x=> x.ranking == ranking);
  SelectSummitAndFlyTo(summit);
});

/**
 * Transforms the vertical scroll into an horizontal scroll on the 
 * summit section of the navbar
 */
$('#summit-area').on('wheel mousewheel', function(event)  {
    event.preventDefault();
    //@ts-ignore
    this.scrollLeft += event.originalEvent.deltaY;
});

$('#search-bar-input').on('click input', SearchSummits);

$("#search-bar-input").on("blur", function(){
  //let searchResultContainer = $('#search-results-container');
  //searchResultContainer.css({'display':'none'});
});

function SearchSummits(){
  const searchInput =  $("#search-bar-input").val()?.toString().toLowerCase().trim();
  let searchResultContainer = $('#search-results-container');
  if(searchInput === '') {
    searchResultContainer.css({'display':'none'});
    return;
  }

  var searchResultsHtml = '';
  var count = 0;
  //Iterate over all summits to find the best matches
  for (const summit of summitInfoArray){
    if (summit.name?.toLowerCase().includes(searchInput || '')) {
      if(count>5) 
        break;
      searchResultsHtml += `
      <div id='search-result-`+summit.ranking+`' class="search-result">
      <div class="summit-dot__icon">
      <div class="inner-dot" style="background-color:` + SelectDotColor(summit) + `"></div>
      </div>
        <p id='result-`+summit.ranking+`' class='text'>`+summit.name+`</p>
      </div>`
      count++;
    }
  }
  if(searchResultsHtml === ''){
    searchResultContainer.css({'display':'none'});
    return;
  }
  searchResultContainer.css({'display':'flex'});
  searchResultContainer.html(searchResultsHtml);
}

$('#search-results-container').on('click','.search-result', function(){
  //Retrieve the id (ranking) of the selected result 
  let ranking = this.id.match(/\d+/)[0];
  var summit = summitInfoArray.find(x=> x.ranking == ranking);
  SelectSummitAndFlyTo(summit);
  let searchResultContainer = $('#search-results-container');
  searchResultContainer.css({'display':'none'});
  $("#search-bar-input").val($('#result-'+ranking).text());
});

/**
 * Loads the summits dots in the maps navigation bar
 * @param summitInfo list of summits
 */
function LoadMapsNavBar(summitInfo: Common.SummitInfo[]){
  var summitArea = $("#summit-area");
  summitInfo.forEach(summit => {
    let summitHtml = `
      <div id='summmit-` + summit.ranking + `' class="summit">
        <div class="summit-dot">
          <p class="summit-dot__text top-text"> ` + summit.ranking + `/82</p>
          <div id='summmit-` + summit.ranking + `__icon' class="summit-dot__icon">
            <div class="inner-dot" style="background-color:` + SelectDotColor(summit) + `"></div>
          </div>
          <p class="summit-dot__text bottom-text"> ` + summit.elevation + `m</p>
        </div>
        <div class="summit-dot-link"></div>
      </div>
    `; 
    summitArea.append(summitHtml);
  });
}

/**
 * Loads the genral map in the given div (mapKey).
 * Add a marker for every summit instance in the summitInfo array
 * @param mapKey key of the parent div id
 * @param summitInfo list of summits
 */
function LoadGeneralMap(mapKey:string, summitInfo: Common.SummitInfo[]){
  // Create Leaflet map on map element.
  map = L.map(mapKey, { zoomControl: false });

  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  var markerGroup = new Array();
  for(var i = 0; i < summitInfo.length; i++){
    var markerIcon = L.icon({ iconUrl: SelectMarkerIconUrl(summitInfo[i]),
      iconSize:     [30, 30], // size of the icon
      iconAnchor:   [15, 30],
    });

    var target = L.latLng(summitInfo[i].GetFormattedLatitude(), summitInfo[i].GetFormattedLongitude());
    // Place a marker on the same location.
    var marker = L.marker(target, {icon: markerIcon, title: String(summitInfo[i].ranking)});
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
      iconColor = 'orange';
      break;
    case 'Alpes bernoises':
      iconColor = 'blue';
      break;
    case 'Chaîne de la Bernina':
      iconColor = 'green';
      break;
    case 'Massif du Grand-Paradis':
      iconColor = 'pink';
      break;
    case 'Massif des Écrins':
      iconColor = 'red';
      break;
  }
  return '../../src/images/'+ iconColor+ '-pin.png'
}

/**
 * Select the color of the dot denpending on the location 
 * of the given summit info object
 * @param summitInfo summit information
 * @returns color string in hex format
 */
function SelectDotColor(summitInfo: Common.SummitInfo) : string {
  switch(summitInfo.location){
    case 'Massif du Mont-Blanc':
      return '#ffd900';
    case 'Alpes pennines':
      return '#ff7a00';
    case 'Alpes bernoises':
      return '#3a7cff';
    case 'Chaîne de la Bernina':
      return '#91ff3a';
    case 'Massif du Grand-Paradis':
      return '#f13aff';
    case 'Massif des Écrins':
      return '#ff3a3a';
  }
}

/**
 * Enables or disables the navigation (touch and mouse)
 * on the map surface
 * @param enable true if the navigation should be enabled
 */
function ToggleMapNavigation(enable: boolean){
  if(enable){
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
  }
  else{
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  }
}


function CreateCard1(index: number, summitInfo: Common.SummitInfo, parentDivId: string){
  
  $(parentDivId).html(`          
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
          <p class="value">`+ summitInfo.GetSummitDate() +`</p>
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
      <div id="summmit-card-`+ index +`-flag" class="card-flag `+ ToCSSFlagClass1(summitInfo.countryCode) +`">
        <img>
      </div>
    </div>
  `);
  AddCountryToCard1(summitInfo.countryCode, '#summit-card-'+ index +'-country');
  //Hide the date label if not summitted
  if(!summitInfo.summitted){
    $("#summit-card-"+ index +"-date").hide();
    $("#summit-card-"+ index +"-dateline").hide();
    
  }
  else{
    $("#summit-card-"+ index).addClass("summited");
  }
}


/**
 * Converts the given csv string into css country code classes
 */
function ToCSSFlagClass1(countryCode : string){

  var spl = countryCode.split(",");
  var retString = "";
  for(var i =0; i < spl.length;i++)
  {
    retString += spl[i].toLowerCase() + " ";
  }
  return retString;
}

/**
 * adds the country to the given parentDiv
 * @param countyCode list of country codes csv (,)
 * @param parentDiv Jquery name of the parent div
 */
function AddCountryToCard1(countyCode:string, parentDiv: string){
  let codes = countyCode.split(',');
  if(codes.length == 1){
    $(parentDiv).append(`
    <p class="tag">Coutry</p>
    <p class="value">` + Common.CountryCodeToCountryName(codes[0]) +`</p>
    `);
  }
  else{
    $(parentDiv).append(`
    <p class="tag">Coutries</p>
    <p class="value">` + Common.CountryCodeToCountryName(codes[0]) + ` & ` 
    + Common.CountryCodeToCountryName(codes[1]) +`</p>`);
  }
}


function SelectSummitAndFlyTo(summit: Common.SummitInfo){
  let infoCard = $('#selected-summit-info-card');
  infoCard.css({'display':'flex'});
  map.flyTo([summit.GetFormattedLatitude(), summit.GetFormattedLongitude()], 15);
  CreateCard1(summit.ranking, summit,"#selected-summit-info-card");
}