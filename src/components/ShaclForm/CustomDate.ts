// eslint-disable-next-line no-shadow
export enum XsdDateTypes {
    // see FieldUtils.isDatetime()
    DateTime = 'http://www.w3.org/2001/XMLSchema#dateTime',
    Date = 'http://www.w3.org/2001/XMLSchema#date'
    // No Vue Component that can only select year/month, so for now we disable these options.
    // YearMonth = 'http://www.w3.org/2001/XMLSchema#gYearMonth',
    // Year = 'http://www.w3.org/2001/XMLSchema#gYear'
  }

/*
In rdf you have multiple date types (see XsdDataTypes). FDP code used the Typescript Date object
but this is always serialized to format date/time.
CustomDate is serialized to string based on the type. (xmls:gYear -> "2015")
 */
export class CustomDate {
  private internalDate: Date

  private readonly mode: XsdDateTypes

  constructor(input: string | Date | number, xsdType: string) {
    this.mode = xsdType as XsdDateTypes
    this.internalDate = new Date(input)
    this.normalize()
  }

  private normalize() {
    switch (this.mode) {
      // case XsdDateTypes.Year:
      //   this.internalDate.setMonth(0) // fall through
      // case XsdDateTypes.YearMonth:
      //   this.internalDate.setDate(1) // fall through
      case XsdDateTypes.Date:
        this.internalDate.setHours(0, 0, 0, 0)
        break
      default:
        // keep full date/time
        break
    }
  }

  // valueOf(): number {
  //   return this.internalDate.valueOf()
  // }

  toString(): string {
    const isoStr = moment(this.internalDate).toISOString(true)
    const [datePart, timePart] = isoStr.split('T') // e.g. ["2025-04-10", "15:30:00.000Z"]

    switch (this.mode) {
      // case XsdDateTypes.Year:
      //   return datePart.slice(0, 4)
      // case XsdDateTypes.YearMonth:
      //   return datePart.slice(0, 7) // "YYYY-MM"
      case XsdDateTypes.Date:
        return datePart // "YYYY-MM-DD"
      case XsdDateTypes.DateTime:
      default:
        return isoStr // full ISO string (same as toISOString)
    }
  }
}
