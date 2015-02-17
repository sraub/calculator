var AIRLINES = [{
  code: 'AA',
  primary: 'American Airlines',
  other: ['American']
}, {
  code: 'AS',
  primary: 'Alaska Airlines',
  other: ['Alaska', 'Horizon', 'Horizon Air']
}, {
  code: 'B6',
  primary: 'JetBlue Airways',
  other: ['JetBlue']
}, {
  code: 'DL',
  primary: 'Delta Airlines',
  other: ['Delta', 'Delta Express']
}, {
  code: 'FL',
  primary: 'Frontier Airlines',
  other: ['Frontier']
}, {
  code: 'HA',
  primary: 'Hawaiian Airlines',
  other: ['Hawaiian']
}, {
  code: 'IM',
  primary: 'Spirit Airlines',
  other: ['Spirit']
}, {
  code: 'UA',
  primary: 'United Airlines',
  other: ['United']
}, {
  code: 'US',
  primary: 'US Airways',
  other: []
}, {
  code: 'WN',
  primary: 'Southwest Airlines',
  other: ['Southwest']
}, {
  code: 'VX',
  primary: 'Virgin America',
  other: []
}];

var AIRLINES_TO_CODE = {};
for (var i = 0; i < AIRLINES.length; ++i) {
  var airlineData = AIRLINES[i];
  AIRLINES_TO_CODE[airlineData.primary] = airlineData.code;
  AIRLINES_TO_CODE[airlineData.code] = airlineData.code;
  for (var j = 0; j < airlineData.other.length; ++j) {
    AIRLINES_TO_CODE[airlineData.other[j]] = airlineData.code;
  }
}
