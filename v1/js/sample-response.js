var SAMPLE_RESPONSE = {
 "request": {
  "carrier": {
   "requestedCode": "QF",
   "fsCode": "QF"
  },
  "codeType": {},
  "flightNumber": {
   "requested": "108",
   "interpreted": "108"
  },
  "departing": true,
  "date": {
   "year": "2014",
   "month": "11",
   "day": "21",
   "interpreted": "2014-11-21"
  },
  "url": "https://api.flightstats.com/flex/schedules/rest/v1/json/flight/QF/108/departing/2014/11/21"
 },
 "scheduledFlights": [
  {
   "carrierFsCode": "QF",
   "flightNumber": "108",
   "departureAirportFsCode": "JFK",
   "arrivalAirportFsCode": "LAX",
   "stops": 0,
   "departureTerminal": "7",
   "arrivalTerminal": "B",
   "departureTime": "2014-11-21T18:35:00.000",
   "arrivalTime": "2014-11-21T21:40:00.000",
   "flightEquipmentIataCode": "747",
   "isCodeshare": false,
   "isWetlease": false,
   "serviceType": "J",
   "serviceClasses": [
    "R",
    "J",
    "Y"
   ],
   "trafficRestrictions": [
    "Q"
   ],
   "codeshares": [
    {
     "carrierFsCode": "AA",
     "flightNumber": "7366",
     "serviceType": "J",
     "serviceClasses": [
      "J",
      "Y"
     ],
     "trafficRestrictions": [],
     "referenceCode": 1645401
    }
   ],
   "referenceCode": "1187-1645653--"
  },
  {
   "carrierFsCode": "QF",
   "flightNumber": "108",
   "departureAirportFsCode": "LAX",
   "arrivalAirportFsCode": "SYD",
   "stops": 0,
   "departureTerminal": "B",
   "arrivalTerminal": "1",
   "departureTime": "2014-11-21T23:55:00.000",
   "arrivalTime": "2014-11-23T09:35:00.000",
   "flightEquipmentIataCode": "747",
   "isCodeshare": false,
   "isWetlease": false,
   "serviceType": "J",
   "serviceClasses": [
    "R",
    "J",
    "Y"
   ],
   "trafficRestrictions": [],
   "codeshares": [
    {
     "carrierFsCode": "AA",
     "flightNumber": "7366",
     "serviceType": "J",
     "serviceClasses": [
      "J",
      "Y"
     ],
     "trafficRestrictions": [],
     "referenceCode": 1867065
    }
   ],
   "referenceCode": "1187-1866980--"
  }
 ],
 "appendix": {
  "airlines": [
   {
    "fs": "AA",
    "iata": "AA",
    "icao": "AAL",
    "name": "American Airlines",
    "phoneNumber": "1-800-433-7300",
    "active": true
   },
   {
    "fs": "QF",
    "iata": "QF",
    "icao": "QFA",
    "name": "Qantas",
    "active": true
   }
  ],
  "airports": [
   {
    "fs": "LAX",
    "iata": "LAX",
    "icao": "KLAX",
    "faa": "LAX",
    "name": "Los Angeles International Airport",
    "street1": "One World Way",
    "street2": "",
    "city": "Los Angeles",
    "cityCode": "LAX",
    "stateCode": "CA",
    "postalCode": "90045-5803",
    "countryCode": "US",
    "countryName": "United States",
    "regionName": "North America",
    "timeZoneRegionName": "America/Los_Angeles",
    "weatherZone": "CAZ041",
    "localTime": "2014-11-20T07:49:32.785",
    "utcOffsetHours": -8,
    "latitude": 33.943399,
    "longitude": -118.408279,
    "elevationFeet": 126,
    "classification": 1,
    "active": true
   },
   {
    "fs": "JFK",
    "iata": "JFK",
    "icao": "KJFK",
    "faa": "JFK",
    "name": "John F. Kennedy International Airport",
    "street1": "JFK Airport",
    "city": "New York",
    "cityCode": "NYC",
    "stateCode": "NY",
    "postalCode": "11430",
    "countryCode": "US",
    "countryName": "United States",
    "regionName": "North America",
    "timeZoneRegionName": "America/New_York",
    "weatherZone": "NYZ178",
    "localTime": "2014-11-20T10:49:32.785",
    "utcOffsetHours": -5,
    "latitude": 40.642335,
    "longitude": -73.78817,
    "elevationFeet": 13,
    "classification": 1,
    "active": true
   },
   {
    "fs": "SYD",
    "iata": "SYD",
    "icao": "YSSY",
    "name": "Sydney (Kingsford Smith) Airport",
    "city": "Sydney",
    "cityCode": "SYD",
    "stateCode": "NSW",
    "countryCode": "AU",
    "countryName": "Australia",
    "regionName": "Oceania",
    "timeZoneRegionName": "Australia/Sydney",
    "localTime": "2014-11-21T02:49:32.785",
    "utcOffsetHours": 11,
    "latitude": -33.932922,
    "longitude": 151.179898,
    "elevationFeet": 21,
    "classification": 1,
    "active": true
   }
  ],
  "equipments": [
   {
    "iata": "747",
    "name": "Boeing 747 Passenger",
    "turboProp": false,
    "jet": true,
    "widebody": true,
    "regional": false
   }
  ]
 }
};
