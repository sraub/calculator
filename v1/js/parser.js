var sample = 'Depart  27h 35m\n' +
  'This flight leaves on Thursday (Mar 5) and arrives on Saturday (Mar 7). \n' +
  'Delta – Flight 2125   2h 01m\n' +
  '12:30p  Thu, Mar 5  BWI Baltimore, MD  \n' +
  '2:31p Thu, Mar 5  ATL Atlanta, GA  \n' +
  'McDonnell Douglas MD88 (Narrow-body Jet)   |  2h 01m   |  576 miles   |  2 seats remain\n';

var text = 'Depart  27h 35m\n' +
  'This flight leaves on Thursday (Mar 5) and arrives on Saturday (Mar 7). \n' +
  'Delta – Flight 2125   2h 01m\n' +
  '12:30p  Thu, Mar 5  BWI Baltimore, MD  \n' +
  '2:31p Thu, Mar 5  ATL Atlanta, GA  \n' +
  'McDonnell Douglas MD88 (Narrow-body Jet)   |  2h 01m   |  576 miles   |  2 seats remain\n' +
  'Change planes ATL Atlanta, GA \n' +
  '1h 42m\n' +
  'Delta – Flight 81 5h 12m\n' +
  '4:13p Thu, Mar 5  ATL Atlanta, GA  \n' +
  '6:25p Thu, Mar 5  LAX Los Angeles, CA  \n' +
  'Boeing 737-900 (Narrow-body Jet)   |  5h 12m   |  1941 miles   |  2 seats remain\n' +
  'Change planes LAX Los Angeles, CA \n' +
  '3h 43m\n' +
  'Delta – Flight 17 14h 57m\n' +
  '10:08p  Thu, Mar 5  LAX Los Angeles, CA  \n' +
  '8:05a Sat, Mar 7  SYD Sydney, NSW, Australia   \n' +
  'Boeing 777-200LR (Wide-body Jet)   |  14h 57m   |  7491 miles   |  2 seats remain\n' +
  'Return  25h 22m\n' +
  'Delta – Flight 16 13h 45m\n' +
  '12:15p  Sun, Mar 22 SYD Sydney, NSW, Australia   \n' +
  '8:00a Sun, Mar 22 LAX Los Angeles, CA  \n' +
  'Boeing 777-200LR (Wide-body Jet)   |  13h 45m   |  7491 miles   |  2 seats remain\n' +
  'Change planes LAX Los Angeles, CA \n' +
  '3h 10m\n' +
  'Delta – Flight 821  3h 35m\n' +
  '11:10a  Sun, Mar 22 LAX Los Angeles, CA  \n' +
  '4:45p Sun, Mar 22 MSP Minneapolis, MN  \n' +
  'Boeing 737-900 (Narrow-body Jet)   |  3h 35m   |  1532 miles   |  2 seats remain\n' +
  'Change planes MSP Minneapolis, MN \n' +
  '2h 30m\n' +
  'Delta – Flight 1101   2h 22m\n' +
  '7:15p Sun, Mar 22 MSP Minneapolis, MN  \n' +
  '10:37p  Sun, Mar 22 BWI Baltimore, MD  ';

var text2 = 'Flight 1  9h 13m\n' +
  'Alaska Airlines – Flight 771  6h 00m\n' +
  '5:10p Mon, Feb 9  DCA Washington, DC   \n' +
  '8:10p Mon, Feb 9  PDX Portland, OR   \n' +
  'Boeing 737-800 (Narrow-body Jet)   |  6h 00m   |  7 seats remain\n' +
  'Change planes PDX Portland, OR  \n' +
  '1h 15m\n' +
  'Alaska Airlines – Flight 384  1h 58m\n' +
  '9:25p Mon, Feb 9  PDX Portland, OR   \n' +
  '11:23p  Mon, Feb 9  SFO San Francisco, CA  \n' +
  'Boeing 737-800 (Narrow-body Jet)   |  1h 58m   |  7 seats remain\n' +
  'Flight 2  1h 47m\n' +
  'Alaska Airlines – Flight 389  1h 47m\n' +
  '7:00a Mon, Feb 16 SFO San Francisco, CA  \n' +
  '8:47a Mon, Feb 16 PDX Portland, OR   \n' +
  'Boeing 737-800 (Narrow-body Jet)   |  1h 47m   |  7 seats remain\n' +
  'Flight 3  4h 55m\n' +
  'Alaska Airlines – Flight 764  4h 55m\n' +
  '9:45a Fri, Feb 20 PDX Portland, OR   \n' +
  '5:40p Fri, Feb 20 DCA Washington, DC';

function tryRegex(regex, toTry) {
  var matches = regex.exec(toTry);
  return matches && matches.length ? matches : null;
}

function FlightData(requireArrivalData) {
  this.carrier = null;
  this.flightNumber = null;
  this.departureDate = null;
  this.departureAirport = null;
  this.arrivalDate = null;
  this.arrivalAirport = null;
  this.continuing = null;

  this.requireArrivalData_ = requireArrivalData;
}

FlightData.prototype.isValid = function() {
  return this.carrier && this.flightNumber && this.departureDate &&
      this.departureAirport && (
          !this.requireArrivalData_ || this.arrivalAirport && this.arrivalDate);
};

function Parser(text) {
  this.flights = [];
  this.fare = null;
  this.lines_ = [];

  if (text) {
    this.lines_ = text.split('\n');
  }
}

Parser.normalizeDate = function(dateString) {
  var today = new Date();
  var date = new Date(dateString);
  date.setFullYear(today.getFullYear());
  if (today > date) {
    date.setFullYear(today.getFullYear() + 1);
  }
  return date;
};

Parser.prototype.getNumFlights = function() {
  return this.flights.length;
};

Parser.prototype.getFlightData = function(flightIndex) {
  return flightIndex < this.flights.length ? this.flights[flightIndex] : null;
};

Parser.prototype.getFlight_ = function(flightIndex) {
  return flightIndex < this.flights.length ? this.flights[flightIndex] : null;
};

Parser.prototype.getCarrier = function(flightIndex) {
  var flight = this.getFlight_(flightIndex);
  return flight ? flight.carrier : null;
};

Parser.prototype.getFlightNumber = function(flightIndex) {
  var flight = this.getFlight_(flightIndex);
  return flight ? flight.flightNumber : null;
};

Parser.prototype.getDepartureDate = function(flightIndex) {
  var flight = this.getFlight_(flightIndex);
  return flight ? flight.departureDate : null;
};

Parser.prototype.getDepartureAirport = function(flightIndex) {
  var flight = this.getFlight_(flightIndex);
  return flight ? flight.departureAirport : null;
};

function KayakParser(text) {
  if (!(this instanceof KayakParser)) {
    return new KayakParser(text);
  }
  this.base = Parser;
  this.base(text);

  var flightData = new FlightData(true);
  var possibleCarrier = null;
  for (var i = 0; i < this.lines_.length; ++i) {
    var line = this.lines_[i];

    if (tryRegex(KayakParser.ignoreRegexp, line)) {
      continue;
    }

    var matches = tryRegex(KayakParser.dateRegexp, line);
    if (matches) {
      if (!flightData.departureDate) {
        flightData.departureDate = Parser.normalizeDate(matches[1]);
      } else if (!flightData.arrivalDate) {
        flightData.arrivalDate = Parser.normalizeDate(matches[1]);
      }
    }

    var matches = tryRegex(KayakParser.locationRegexp, line);
    if (matches) {
      if (!flightData.departureAirport) {
        flightData.departureAirport = matches[1];
      } else if (!flightData.arrivalAirport) {
        flightData.arrivalAirport = matches[1];
      }
    }

    var matches = tryRegex(KayakParser.carrierRegexp, line);
    if (matches && !flightData.carrier && !flightData.flightNumber) {
      flightData.carrier = matches[1];
      flightData.flightNumber = matches[2];
    }

    if (flightData.isValid()) {
      this.flights.push(flightData);
      flightData = new FlightData(true);
    }

    if (i == this.lines_.length - 1 ||
        tryRegex(KayakParser.newFlightRegexp, line)) {
      // We now know that the previous flight is the last leg of a flight and
      // that any before it are not (unless they already have continuing
      // information).
      for (var j = 0; j < this.flights.length; ++j) {
        if (this.flights[j].continuing == null) {
          this.flights[j].continuing = j != this.flights.length - 1;
        }
      }
    }
  }
}
KayakParser.prototype = new Parser;  // Inherit from Parser.
// "Thu, Mar 5"
KayakParser.dateRegexp = /[A-Za-z]{3}, ([A-Za-z]{3} \d{1,2})/;
// "DCA Washington, DC"
KayakParser.locationRegexp = /([A-Z]{3}) ([A-Za-z,\s]*\w)/;
// Delta – Flight 2125
// Leading and trailing "\w" ensures that the first and last characters are
// word characters.
KayakParser.carrierRegexp = /(\w[\w\s]+\w)[^\w]+Flight (\d+)/;
KayakParser.ignoreRegexp = /Change planes/;
KayakParser.newFlightRegexp = new RegExp(/^(Return|Flight \d+)\s+\d+h \d{1,2}m/);

var e2text = 'Departure Arrival Airline Notes Preference  Price\n' +
  '17:10 - Mon, Feb 09\n' +
  'Washington, DC (DCA)  \n' +
  '20:10 - Mon, Feb 09\n' +
  'Portland, OR (PDX)\n' +
  'Alaska Airlines\n' +
  'Flight 771 - Boeing 737-800 \n' +
  'Class: Coach\n' +
  'Fare Rules  Non-stop\n' +
  'Total flight time 6:00\n' +
  '2347 miles \n' +
  'View seats  YCA  Government Contract Carrier  $666.20\n' +
  'Select\n' +
  '09:45 - Mon, Feb 16\n' +
  'Portland, OR (PDX)  \n' +
  '17:40 - Mon, Feb 16\n' +
  'Washington, DC (DCA)\n' +
  'Alaska Airlines\n' +
  'Flight 764 - Boeing 737-800 \n' +
  'Class: Coach\n' +
  'Fare Rules  Non-stop\n' +
  'Total flight time 4:55\n' +
  '2347 miles \n' +
  'View seats  YCA  Government Contract Carrier';

var e2text2 = 'Details | Roundtrip | Government Fare Selected for Entire Trip \n' + 
  'DCA to PDX - Non-stopChange this flight | Remove this flight\n' +
  'Mon, Feb 09   17:10 - 20:10 \n' +
  'Washington, DC (DCA) to\n' +
  'Portland, OR (PDX)\n' +
  '  Fare Rules\n' +
  '\n' +
  'Alaska Airlines Operated By Alaska Airlines\n' +
  'Flight 771 \n' +
  'Seat 21F\n' +
  'Class: Coach\n' +
  'PDX to DCA - Non-stopChange this flight | Remove this flight\n' +
  'Mon, Feb 16   09:45 - 17:40 \n' +
  'Portland, OR (PDX) to\n' +
  'Washington, DC (DCA)\n' +
  'Fare Rules\n' +
  '\n' +
  'Alaska Airlines Operated By Alaska Airlines\n' +
  'Flight 764 \n' +
  'Seat 25E\n' +
  'Class: Coach\n' +
  'Base Airfare: \n' +
  '$426.97\n' +
  ' \n' +
  'Taxes and Fees: \n' +
  '$60.23\n' +
  ' \n' +
  'Flight Total: \n' +
  '$487.20';

function E2Parser1(text) {
  if (!(this instanceof E2Parser1)) {
    return new E2Parser1(text);
  }
  this.base = Parser;
  this.base(text);

  var flightData = new FlightData(false);
  var possibleCarrier = null;
  for (var i = 0; i < this.lines_.length; ++i) {
    var line = this.lines_[i];

    var matches = tryRegex(E2Parser1.fareRegexp, line);
    if (matches) {
      this.fare = parseFloat(matches[1]);
    }

    var matches = tryRegex(E2Parser1.dateRegexp, line);
    if (matches) {
      if (!flightData.departureDate) {
        flightData.departureDate = Parser.normalizeDate(matches[1]);
      } else if (!flightData.arrivalDate) {
        flightData.arrivalDate = Parser.normalizeDate(matches[1]);
      }
    }

    var matches = tryRegex(E2Parser1.locationRegexp, line);
    if (matches) {
      if (!flightData.departureAirport) {
        flightData.departureAirport = matches[2];
      } else if (!flightData.arrivalAirport) {
        flightData.arrivalAirport = matches[2];
      }
      if (matches[3]) {
        possibleCarrier = matches[3];
      }
    }

    var matches = tryRegex(E2Parser1.carrierRegexp, line);
    if (matches && !flightData.carrier && !flightData.flightNumber) {
      flightData.carrier = matches[1];
      flightData.flightNumber = matches[2];
    }

    var matches = tryRegex(E2Parser1.flightNumberRegexp, line);
    if (matches && !flightData.flightNumber) {
      // Look at the previous line to find the carrier.
      flightData.flightNumber = matches[1];
      if (!flightData.carrier && i > 0) {
        if (tryRegex(E2Parser1.operatedByRegexp, this.lines_[i - 1])) {
          var matches = tryRegex(E2Parser1.carrierRegexp2, this.lines_[i - 1]);
          if (matches) {
            flightData.carrier = matches[1];
          } else {
            flightData.carrier = possibleCarrier;
            possibleCarrier = null;
          }
        } else {
          flightData.carrier = this.lines_[i - 1];
        }
      }
    }

    if (tryRegex(E2Parser1.totalFlightTimeRegexp, line)) {
      // We now know that the previous flight is the last leg of a flight and
      // that any before it are not (unless they already have continuing
      // information).
      for (var j = 0; j < this.flights.length; ++j) {
        if (this.flights[j].continuing == null) {
          this.flights[j].continuing = j != this.flights.length - 1;
        }
      }
    }

    if (flightData.isValid()) {
      this.flights.push(flightData);
      flightData = new FlightData(false);
    }
  }
}
E2Parser1.prototype = new Parser;

// "Thu, Mar 5"
E2Parser1.dateRegexp = /[A-Za-z]{3}, ([A-Za-z]{3} \d{1,2})/;
// "Washington, DC (DCA)"
E2Parser1.locationRegexp = /([A-Za-z,\s]*) \(([A-Z]{3})\)(?:\s*(\w[\w\s]+\w))?/;
// "Flight 2125"
E2Parser1.flightNumberRegexp = /Flight (\d+)/;
// "Alaska Airlines Flight 764"
// "Delta – Flight 2125"
// Leading and trailing "\w" ensures that the first and last characters are
// word characters.
E2Parser1.carrierRegexp = /(\w[\w\s]+\w)[^\w]+Flight (\d+)/;
E2Parser1.carrierRegexp2 = /(\w[\w\s]+\w)(?: Operated By .*)/i;
E2Parser1.operatedByRegexp = /operated by .*/i;
E2Parser1.totalFlightTimeRegexp = /Total flight time \d+:\d+/;
E2Parser1.fareRegexp = /\$(\d+\.\d{2})/
