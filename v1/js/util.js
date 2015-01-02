function formatDollars(n) {
  if (!n) return '';
  return '$' + n.toFixed(2).replace(/./g, function(c, i, a) {
    return i && c !== "." && !((a.length - i) % 3) ? ',' + c : c;
  });
}

function formatDuration(duration) {
  if (!duration) return '';
  var hours = Math.floor(duration);
  var minutes = Math.round(60 * (duration - hours));
  return hours + 'hrs ' + minutes + 'min';
}

function formatCity(airport, includeAirportCode) {
  if (!airport) return '';

  var city = airport['city'];
  var state = airport['stateCode'];
  var countryCode = airport['countryCode'];
  var country = airport['countryName'];
  var parts = [city];
  if (countryCode == 'US' && state) {
    parts.push(state);
  }
  if (countryCode != 'US') {
    parts.push(country);
  }
  var name = parts.join(', ');
  if (includeAirportCode) {
    name += ' (' + airport['fs'] + ')';
  }
  return name;
}

function parseTime(timeString, utcOffsetHoursString) {
  var utcOffsetHours = parseInt(utcOffsetHoursString);
  return new Date(Date.parse(timeString) - (utcOffsetHours * 60 * 60 * 1000));
}

function normalizeState(destination, useAbbreviation) {
  var localityRegion = destination.split(', ');
  if (localityRegion.length > 1) {
    // The airport data uses state abbreviations, but the full name of the
    // state is listed in the per-diem map, so convert the abbreviation to the
    // full name.
    var state = useAbbreviation ? STATE_NAMES[localityRegion[1]] :
        STATE_ABBREVIATIONS[localityRegion[1]];
    if (state) {
      destination = localityRegion[0] + ', ' + state;
    }
  }
  return destination;
}
