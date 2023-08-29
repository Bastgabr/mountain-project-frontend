export function ExtractSummitInfos(json) {
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
export class SummitInfo {
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
//# sourceMappingURL=common.js.map