function ScheduleEngine() {
}

ScheduleEngine.getScheduleData = function(
    carrier, flightNumber, dateLocal, callback) {
  if (!carrier || !flightNumber || !dateLocal) {
    return false;
  }

  var month, day, year;
  var match = dateLocal.match(/(\d\d?)[-\/](\d\d?)[-\/](\d{4})/);
  if (match) {
    month = match[1];
    day = match[2];
    year = match[3];
  } else {
    match = dateLocal.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (match) {
      month = match[2];
      day = match[3];
      year = match[1];
    }
  }

  if (!month || !day || !year || year < 2011) {
    window.console.log('Problem with date', dateLocal);
    return false;
  }

  if ($) {
    var requestUri = 'https://api.flightstats.com/flex/schedules/rest' +
        '/v1/jsonp/flight/' + carrier + '/' + flightNumber +
        '/departing/' + year + '/' + month + '/' + day +
        '?appId=63632684&appKey=2e3524c7428d0f528ef94db5ce48e5ee';
    $.ajax({
      type: 'GET',
      url: requestUri,
      dataType: 'jsonp',
      success: function(response) {
        callback(response);
      }
    });
  } else {
    callback(SAMPLE_RESPONSE);
  }
};

ScheduleEngine.getAirportInfo = function(response, airportCode) {
  var airports = response['appendix']['airports'];
  for (var i = 0; i < airports.length; ++i) {
    var airportInfo = airports[i];
    if (airportInfo['fs'] == airportCode) {
      return airportInfo;
    }
  }
  window.console.log('Error! Could not find airport info for', airportCode);
};
