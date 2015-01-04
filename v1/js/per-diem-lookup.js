function PerDiemLookup() {
}

PerDiemLookup.prototype.getRateList_ = function(destination) {
  var destination = normalizeState(destination);
  var perDiemList = PERDIEM_DATA[destination];
  if (!perDiemList) {
    // Ask the user to select the per-diem.
    // TODO(sraub): Log that this per-diem was not found.
  }
  return perDiemList;
};

PerDiemLookup.prototype.getRatesByAirportCode = function(airportCode, date) {
  var perDiemLocation = AIRPORT_TO_PERDIEM_LOCATION[airportCode];
  if (!perDiemLocation) {
    window.console.log('Could not find per diem location for', airportCode);
    return [0, 0];
  }
  return perDiemLookup.getRates(perDiemLocation, date);
};

/**
 * Returns the per diem costs for the destination on the given date. The costs
 * are returned as an array where the first value is the lodging rate and the
 * second is meals & incidentals.
 * @param {string} destination The destination, which is known to be in the
 *     PERDIEM_DATA dictionary.
 * @param {string} date A date provided in the form YYYY-MM-DD.
 * @return {Array.<number>} An two-item array; item 0 is the hotel rate and
 *     item 2 is the meals and incidentals rate.
 * @private
 */
PerDiemLookup.prototype.getRates = function(destination, date) {
  var month, day;
  var match = date.match(/(\d\d?)[-\/](\d\d?)[-\/]\d{4}/) ||
    date.match(/\d{4}[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (match) {
    month = match[1];
    day = match[2];
  } else {
    window.console.log('Problem with date', date);
    return;
  }

  function isDateBetween(startMonth, startDay, endMonth, endDay) {
    if (month < startMonth || month > endMonth) {
      return false;
    }
    if (month == startMonth && day < startDay) {
      return false;
    }
    if (month == endMonth && day > endDay) {
      return false;
    }
    return true;
  }

  var perDiemList = this.getRateList_(destination);
  for (var i = 0; perDiemList && i < perDiemList.length; ++i) {
    var perDiemData = perDiemList[i];
    var startMonth = perDiemData[0];
    var startDay = perDiemData[1];
    var endMonth = perDiemData[2];
    var endDay = perDiemData[3];
    var perDiem = [perDiemData[4], perDiemData[5]];
    if (startMonth > endMonth) {
      if (isDateBetween(1, 1, endMonth, endDay)) {
        return perDiem;
      }
      endMonth = 12;
      endDay = 31;
    }
    if (isDateBetween(startMonth, startDay, endMonth, endDay)) {
      return perDiem;
    }
  }
  window.console.log('Did not find date data', destination);
  return [0, 0];
};
