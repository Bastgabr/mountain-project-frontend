var Common;
(function (Common) {
    /**
     * Array containing all summit information
     * This array is initialized at startup an then used
     */
    var SummitInfoArray;
    /**
     * Hides the loading screen.
     * Info: This method should be called after the complete page has been loaded
     */
    function HideLoadingScreen() {
        $("#loading-screen").css({ opacity: "0", visibility: "hidden" });
    }
    Common.HideLoadingScreen = HideLoadingScreen;
    /**
     * Extract the summit information from the Json file
     * @param json json file containing the summit information
     * @returns an array of summitInfo objects
     */
    function ExtractSummitInfos(json) {
        var summitInfoArray;
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
        return summitInfoArray;
    }
    Common.ExtractSummitInfos = ExtractSummitInfos;
    /**
     * Converts the given country code into the full country name
     * @param countryCode country code (containing only one code)
     * @returns the full name of the country. If the country name
     * is not supported, returns Undef
     */
    function CountryCodeToCountryName(countryCode) {
        let trimmedCode = countryCode.trim().toLowerCase();
        if (trimmedCode === "ch")
            return "Switzerland";
        if (trimmedCode === "fr")
            return "France";
        if (trimmedCode === "it")
            return "Italy";
        return "Undef.";
    }
    Common.CountryCodeToCountryName = CountryCodeToCountryName;
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
    Common.OrderSummitsByHeightDesc = OrderSummitsByHeightDesc;
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
    Common.OrderSummitsByHeightAsc = OrderSummitsByHeightAsc;
    /**
     * Orders the given array of summits by descending date
     * @param summits input array of summits
     * @returns ordered array of summits
     */
    function OrderSummitsByDateDesc(summits) {
        return summits.sort((a, b) => {
            if (a.summitted && !b.summitted) {
                return -1;
            }
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
    Common.OrderSummitsByDateDesc = OrderSummitsByDateDesc;
    /**
     * Orders the given array of summits by ascending date
     * @param summits input array of summits
     * @returns ordered array of summits
     */
    function OrderSummitsByDateAsc(summits) {
        return summits.sort((a, b) => {
            if (a.summitted && !b.summitted) {
                return -1;
            }
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
    Common.OrderSummitsByDateAsc = OrderSummitsByDateAsc;
    /**
     * Class containing all summit informations
     */
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
            return (this.summitDate.getDate() +
                "/" +
                (this.summitDate.getMonth() + 1) +
                "/" +
                +this.summitDate.getFullYear());
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
         * Returns a string containing the css classes to use to qualify the country
         * @returns the css classes coressponding to the country code (space separated)
         */
        GetCssFlagClasses() {
            var spl = this.countryCode.split(",");
            var retString = "";
            for (var i = 0; i < spl.length; i++) {
                retString += spl[i].toLowerCase() + " ";
            }
            return retString;
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
            let decimalDegrees = degrees + minutes / 60 + seconds / 3600;
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
    Common.SummitInfo = SummitInfo;
    /**
     * Orders the summits in the given list
     * @param summitInfoArray array containing the summits
     * @param order sort order
     * @returns ordered list of summits
     */
    function OrderSummits(summitInfoArray, order) {
        switch (order) {
            case PeakOrdering.HeightDesc: {
                return Common.OrderSummitsByHeightDesc(summitInfoArray);
            }
            case PeakOrdering.HeightAsc: {
                return Common.OrderSummitsByHeightAsc(summitInfoArray);
            }
            case PeakOrdering.DateDesc: {
                return Common.OrderSummitsByDateDesc(summitInfoArray);
            }
            case PeakOrdering.DateAsc: {
                return Common.OrderSummitsByDateAsc(summitInfoArray);
            }
        }
    }
    Common.OrderSummits = OrderSummits;
    /**
     * Filters the content of the summit lists
     * @param summitInfoArray array containing the summits
     * @param filter peak selection. Determines the filter criteria to use
     * @returns filtered summit lists
     */
    function FilterSummits(summitInfoArray, filter) {
        switch (filter) {
            case PeakSelection.All: {
                return summitInfoArray;
            }
            case PeakSelection.NonSummitted: {
                return summitInfoArray.filter((item) => !item.summitted);
            }
            case PeakSelection.Summitted: {
                return summitInfoArray.filter((item) => item.summitted);
            }
        }
    }
    Common.FilterSummits = FilterSummits;
    /**
     * Filter criteria to filter out
     * some peaks in the list
     */
    let PeakSelection;
    (function (PeakSelection) {
        PeakSelection[PeakSelection["All"] = 0] = "All";
        PeakSelection[PeakSelection["NonSummitted"] = 1] = "NonSummitted";
        PeakSelection[PeakSelection["Summitted"] = 2] = "Summitted";
    })(PeakSelection || (PeakSelection = {}));
    /**
     * D
     */
    let PeakOrdering;
    (function (PeakOrdering) {
        PeakOrdering[PeakOrdering["HeightDesc"] = 0] = "HeightDesc";
        PeakOrdering[PeakOrdering["HeightAsc"] = 1] = "HeightAsc";
        PeakOrdering[PeakOrdering["DateDesc"] = 2] = "DateDesc";
        PeakOrdering[PeakOrdering["DateAsc"] = 3] = "DateAsc";
    })(PeakOrdering || (PeakOrdering = {}));
})(Common || (Common = {}));
//# sourceMappingURL=common.js.map