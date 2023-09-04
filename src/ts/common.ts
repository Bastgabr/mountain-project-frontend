namespace Common {
  /**
   * Array containing all summit information
   * This array is initialized at startup an then used
   */
  var SummitInfoArray: Common.SummitInfo[];
  /**
   * Hides the loading screen.
   * Info: This method should be called after the complete page has been loaded
   */
  export function HideLoadingScreen() {
    $("#loading-screen").css({ opacity: "0", visibility: "hidden" });
  }

  /**
   * Extract the summit information from the Json file
   * @param json json file containing the summit information
   * @returns an array of summitInfo objects
   */
  export function ExtractSummitInfos(json): SummitInfo[] {
    var summitInfoArray: SummitInfo[];
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

  /**
   * Converts the given country code into the full country name
   * @param countryCode country code (containing only one code)
   * @returns the full name of the country. If the country name
   * is not supported, returns Undef
   */
  export function CountryCodeToCountryName(countryCode: string): string {
    let trimmedCode = countryCode.trim().toLowerCase();
    if (trimmedCode === "ch") return "Switzerland";
    if (trimmedCode === "fr") return "France";
    if (trimmedCode === "it") return "Italy";
    return "Undef.";
  }

  /**
   * Orders the given array of summits by descending height
   * @param summits input array of summits
   * @returns ordered array of summits
   */
  export function OrderSummitsByHeightDesc(
    summits: SummitInfo[]
  ): SummitInfo[] {
    return summits.sort((a, b) => {
      if (a.elevation > b.elevation) {
        return -1;
      } else if (a.elevation < b.elevation) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Orders the given array of summits by ascending height
   * @param summits input array of summits
   * @returns ordered array of summits
   */
  export function OrderSummitsByHeightAsc(summits: SummitInfo[]): SummitInfo[] {
    return summits.sort((a, b) => {
      if (a.elevation < b.elevation) {
        return -1;
      } else if (a.elevation > b.elevation) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Orders the given array of summits by descending date
   * @param summits input array of summits
   * @returns ordered array of summits
   */
  export function OrderSummitsByDateDesc(summits: SummitInfo[]): SummitInfo[] {
    return summits.sort((a, b) => {
      if (a.summitted && !b.summitted) {
        return -1;
      }
      if (a.summitDate > b.summitDate) {
        return -1;
      } else if (a.summitDate < b.summitDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Orders the given array of summits by ascending date
   * @param summits input array of summits
   * @returns ordered array of summits
   */
  export function OrderSummitsByDateAsc(summits: SummitInfo[]): SummitInfo[] {
    return summits.sort((a, b) => {
      if (a.summitted && !b.summitted) {
        return -1;
      }
      if (a.summitDate < b.summitDate) {
        return -1;
      } else if (a.summitDate > b.summitDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Class containing all summit informations
   */
  export class SummitInfo {
    public ranking: number = null;
    public name: string = null;
    public elevation: string = null;
    public lat: string = null;
    public long: string = null;
    public location: string = null;
    public countryCode: string = null;
    public summitted: boolean = false;
    public summitDate: Date = null;
    public attempts: number = 0;

    /**
     * Return date in format dd/mm/yyyy
     * @returns date as string
     */
    public GetSummitDate(): string {
      return (
        this.summitDate.getDate() +
        "/" +
        (this.summitDate.getMonth() + 1) +
        "/" +
        +this.summitDate.getFullYear()
      );
    }

    /**
     * Returns the Latitude in float format
     * @returns Latitude in float format
     */
    public GetFormattedLatitude(): number {
      return this.ConvertToLat(this.lat);
    }

    /**
     * Returns the Longitude in float format
     * @returns Longitude in float format
     */
    public GetFormattedLongitude(): number {
      return this.ConvertToLong(this.long);
    }

    /**
     * Returns a string containing the css classes to use to qualify the country
     * @returns the css classes coressponding to the country code (space separated)
     */
    public GetCssFlagClasses(): string {
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
    private DmsToDecimal(
      degrees: number,
      minutes: number,
      seconds: number,
      direction: string
    ): number {
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
    private ConvertToLat(latDMS: string): number {
      // Parse the latitude DMS string into degrees, minutes, seconds, and direction
      const matches = latDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);

      if (matches) {
        const degrees = parseInt(matches[1], 10);
        const minutes = parseInt(matches[2], 10);
        const seconds = parseInt(matches[3], 10);
        const direction = matches[4];

        return this.DmsToDecimal(degrees, minutes, seconds, direction);
      } else {
        throw new Error("Invalid latitude DMS format");
      }
    }

    /**
     * Converts the longitude DMS string into a floating point representation
     * @param longDMS longitude in DMS format
     * @returns longitude in float format
     */
    private ConvertToLong(longDMS: string): number {
      // Parse the longitude DMS string into degrees, minutes, seconds, and direction
      const matches = longDMS.match(/(\d+)°(\d+)′(\d+)″([NSEW])/);

      if (matches) {
        const degrees = parseInt(matches[1], 10);
        const minutes = parseInt(matches[2], 10);
        const seconds = parseInt(matches[3], 10);
        const direction = matches[4];

        return this.DmsToDecimal(degrees, minutes, seconds, direction);
      } else {
        throw new Error("Invalid longitude DMS format");
      }
    }
  }

  /**
   * Orders the summits in the given list
   * @param summitInfoArray array containing the summits
   * @param order sort order
   * @returns ordered list of summits
   */
  export function OrderSummits(
    summitInfoArray: Common.SummitInfo[],
    order: PeakOrdering
  ): Common.SummitInfo[] {
    switch (<PeakOrdering>order) {
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

  /**
   * Filters the content of the summit lists
   * @param summitInfoArray array containing the summits
   * @param filter peak selection. Determines the filter criteria to use
   * @returns filtered summit lists
   */
  export function FilterSummits(
    summitInfoArray: Common.SummitInfo[],
    filter: PeakSelection
  ): Common.SummitInfo[] {
    switch (<PeakSelection>filter) {
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

  /**
   * Filter criteria to filter out 
   * some peaks in the list
   */
  enum PeakSelection {
    All = 0,
    NonSummitted = 1,
    Summitted = 2,
  }

  /**
   * D
   */
  enum PeakOrdering {
    HeightDesc = 0,
    HeightAsc = 1,
    DateDesc = 2,
    DateAsc = 3,
  }
}
