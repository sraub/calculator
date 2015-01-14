var PER_HOUR_RATE = 150;
var MAXIMUM_INTERMEDIARY_REST_STOP_HOURS = 14;
var MAXIMUM_DESTINATION_REST_STOP_HOURS = 9;

function CostData(origin) {
  this.origin = origin;
  this.flyingTime = 0;
  this.flyingCost = 0;
  this.layoverTime = 0;
  this.layoverCost = 0;
  this.destination = '';
  this.restStopLocation = 0;
  this.restStopTime = 0;
  this.restStopCost = 0;
  this.hotelCost = 0;
  this.perDiem = {};
  this.perDiemCost = 0;
}

CostData.prototype.addFlyingTime = function(flyingTime) {
  this.flyingTime += flyingTime;
  this.flyingCost = this.flyingTime * PER_HOUR_RATE;
  this.updateTotalCost_();
};

CostData.prototype.addLayoverTime = function(layoverTime) {
  this.layoverTime += layoverTime;
  this.layoverCost = this.layoverTime * PER_HOUR_RATE;
  this.updateTotalCost_();
};

CostData.prototype.setDestination = function(
    destination, perDiem, perDiemRate, opt_perDiemLocation) {
  this.destination = destination;
  this.addPerDiem_(opt_perDiemLocation || destination, perDiem, perDiemRate);
  this.updateTotalCost_();
};

CostData.prototype.setRestStop = function(
    location, restStopTime, hotelCost, perDiemCost) {
  this.restStopLocation = location;
  this.restStopTime = restStopTime;
  this.restStopCost = this.restStopTime * PER_HOUR_RATE;
  this.hotelCost = hotelCost;
  this.addPerDiem_(location, perDiemCost, 0.75);
  this.updateTotalCost_();
};

CostData.prototype.addPerDiem_ = function(destination, perDiem, perDiemRate) {
  if (!this.perDiem[destination]) {
    this.perDiem[destination] = 0;
  }
  this.perDiem[destination] += perDiem * perDiemRate;
  this.perDiemCost = 0;
  for (var destination in this.perDiem) {
    this.perDiemCost += this.perDiem[destination];
  }
};

CostData.prototype.updateTotalCost_ = function() {
  this.totalCost = this.flyingCost + this.layoverCost + this.restStopCost +
      this.hotelCost + this.perDiemCost;
};


function Itinerary(element) {
  this.element_ = element;
  this.flights = [];

  /*
  var me = this;
  $('.add-flight', this.element_).click(function() {
    me.addFlight();
  });

  this.addFlight();
  */

  $('.fare input', this.element_).focus();
}

Itinerary.prototype.getElement = function() {
  return this.element_;
};

Itinerary.prototype.update = function(destinationList, dutyStation) {
  if (!destinationList.length) {
    return;
  }
  var origin = normalizeState(destinationList[0], true);
  for (var i = 1; i < destinationList.length; ++i) {
    var destination = normalizeState(destinationList[i], true);
    if (this.flights.length < i) {
      this.addFlight();
    }
    var flight = this.flights[i - 1];
    if (flight.getOrigin() != origin) {
      flight.updateOrigin(origin);
    }
    if (flight.getFinalDestination() != destination) {
      flight.updateDestination(destination);
    }
    origin = destination;
  }
  for (var i = destinationList.length; i <= this.flights.length; ++i) {
    this.flights[i - 1].remove();
  }
  this.activeDutyStation_ = dutyStation && normalizeState(dutyStation);
};

Itinerary.prototype.getDutyStation = function() {
  if ($('.duty-station').val()) {
    return normalizeState($('.duty-station').val(), true);
  } else {
    return this.activeDutyStation_;
  }
};

Itinerary.prototype.addFlight = function() {
  var colorIndex = this.flights.length % 3 + 1;
  var flight = new Flight(this, false); //this.flights.length != 0);
  this.flights.push(flight);
  this.colorFlights();
  return flight;
};

Itinerary.prototype.removeFlight = function(flight) {
  for (var i = 0; i < this.flights.length; ++i) {
    if (this.flights[i] == flight) {
      this.flights.splice(i, 1);
      break;
    }
  }
  this.colorFlights();
};

Itinerary.prototype.colorFlights = function() {
  $('#flight-placeholder div', this.element_).each(function(i, element) {
    var colorIndex = i % 3 + 1;
    $(element).removeClass('color1 color2 color3').addClass(
        'color' + colorIndex);
  });
};

Itinerary.prototype.getFare = function() {
  return parseFloat($('.fare .form-control', this.element_).val());
};

Itinerary.prototype.getTotalCost = function() {
  var totalCost = this.getFare();
  for (var i = 0; i < this.flights.length; ++i) {
    totalCost += this.flights[i].getTotalCost();
  }
  return totalCost;
};

Itinerary.prototype.getCostData = function() {
  var costData = {
    fare: this.getFare(),
    worktime: 0,
    perDiem: 0,
    hotel: 0,
    total: 0
  };
  for (var i = 0; i < this.flights.length; ++i) {
    var flightCostData = this.flights[i].getCostData();
    costData.worktime += flightCostData.flyingCost +
        flightCostData.layoverCost + flightCostData.restStopCost;
    costData.perDiem += flightCostData.perDiemCost;
    costData.hotel += flightCostData.hotelCost;
    costData.total += flightCostData.totalCost;
  }
  return costData;
};



function Flight(itinerary, allowRemoval) {
  this.itinerary_ = itinerary;
  this.finalDestination_ = '';
  this.element_ = $('#flight-template').clone();
  this.element_.removeAttr('id');

//  $('.final-destination').val(destination);
//  addPlaceAutocomplete($('.final-destination', this.element_));

  var me = this;
  $('.add-leg', this.element_).click(function() {
    me.legs.push(new Leg(me, true));
  });

  /*
  if (allowRemoval) {
    $('.remove-flight', this.element_).click(function() {
      me.element_.remove();
      itinerary.removeFlight(me);
    });
  } else {
    $('.remove-flight', this.element_).hide();
  }
  */
  $('#flight-placeholder', itinerary.getElement()).append(this.element_);

  this.legs = [new Leg(this, false)];

//  $('.final-destination', this.element_).focus();
  $('.carrier', this.element_).focus();
}

Flight.prototype.remove = function() {
  this.element_.remove();
  this.itinerary_.removeFlight(this);
};

Flight.prototype.updateDestination = function(destination) {
  $('.final-destination', this.element_).text(destination);
  this.finalDestination_ = normalizeState(destination, true);
};

Flight.prototype.updateOrigin = function(origin) {
  $('.origin', this.element_).text(origin);
  this.origin_ = origin;
};

Flight.prototype.getElement = function() {
  return this.element_;
};

Flight.prototype.removeLeg = function(leg) {
  for (var i = 0; i < this.legs.length; ++i) {
    if (this.legs[i] == leg) {
      this.legs.splice(i, 1);
      break;
    }
  }
};

Flight.prototype.getPreviousArrivalAirport = function(leg) {
  for (var i = this.legs.length - 1; i >= 1; --i) {
    if (leg == this.legs[i]) {
      return this.legs[i - 1].getArrivalAirport();
    }
  }
  return null;
};

Flight.prototype.getOrigin = function() {
  return this.origin_;
};

Flight.prototype.getDepartureCity = function() {
  return this.legs[0].getDepartureCity();
};

Flight.prototype.getFinalDestination = function() {
  return this.finalDestination_;
//  return $('.final-destination', this.element_).val();
};

Flight.prototype.getArrivalDate = function() {
  return this.legs[this.legs.length - 1].getArrivalDateLocal();
};

Flight.prototype.getFlyingTime = function() {
  var flyingTime = 0;
  for (var i = 0; i < this.legs.length; ++i) {
    var leg = this.legs[i];
    flyingTime += leg.getFlyingTime();
  }
  return flyingTime;
};

Flight.prototype.getFlyingTimeCost = function() {
  return this.getFlyingTime() * PER_HOUR_RATE; 
};

Flight.prototype.getLayoverTime = function() {
  var layoverTime = 0;
  for (var i = 1; i < this.legs.length - 1; ++i) {
    var leg = this.legs[i];
    var previous = this.legs[i - 1];
    layoverTime += leg.getDepartureTime() - previous.getArrivalTime();
  }
  return layoverTime / 60 * 60 * 1000;
};

Flight.prototype.getLayoverTimeCost = function() {
  return this.getLayoverTime() * PER_HOUR_RATE;
};

Flight.prototype.getComparisonData = function() {
  var flightCostData = null;
  if (this.getFlyingTime() + this.getLayoverTime() <= 14) {
    flightCostData = this.computeCostWithRestStop_(-1);
  }

  var flightCostData = null;
  // The rest stop cannot occur at the final destination, only at intermediary
  // stops.
  // TODO(sraub): Check if this is true.
  for (var i = 0; i < this.legs.length - 1; ++i) {
    var costData = this.computeCostWithRestStop_(i);
    if (!flightCostData || costData.totalCost <= flightCostData.totalCost) {
      flightCostData = costData;
    }
  }

  var layoverTime = 0;
  for (var i = 0; i < flightCostData.details.length; ++i) {
    if (flightCostData.restStopIndex != i) {
      layoverTime += flightCostData.details[i].layoverTime;
    }
  }

  var comparisonData = {
    origin: this.getOrigin(),
    destination: this.getDestination(),
    flyingTime: this.getFlyingTime(),
    layoverTime: layoverTime,
    destinationPerDiem: flightCostData.details[this.legs.length - 1].perDiem,
    totalCost: flightCostData.totalCost
  };

  if (flightCostData.restStopIndex != -1) {
    var restStopDetails = flightCostData.details[flightCostData.restStopIndex];
    comparisonData.restStop = restStopDetails.location;
    comparisonData.hotel = restStopDetails.hotel;
    comparisonData.restStopTime = restStopDetails.layoverTime;
    comparisonData.restStopPerDiem = restStopDetails.perDiem;
  }
};

Flight.prototype.computeCostWithRestStop_ = function(restStopIndex) {
  var costData = new CostData(this.getOrigin());
  for (var i = 0; i < this.legs.length; ++i) {
    var leg = this.legs[i];
    if (!leg.getArrivalCity()) {
      continue;
    }
    var destination = i == this.legs.length - 1 ?
        this.getFinalDestination() : leg.getArrivalCity();
    var returningHome =
        this.getFinalDestination() == this.itinerary_.getDutyStation();

    costData.addFlyingTime(leg.getFlyingTime());

    var layoverTime = 0;
    if (i != this.legs.length - 1) {
      var arrivalTime = leg.getArrivalTime();
      var nextDepartureTime = this.legs[i + 1].getDepartureTime();
      layoverTime = (nextDepartureTime - arrivalTime) / (60 * 60 * 1000);
    }

    var hotel = 0;
    var perDiem = 0;
    // If there is no rest stop, use 75% of the per diem values. If there is a
    // rest stop, then 100% of the rest stop is used.
    var perDiemRate = restStopIndex == -1 ? .75 : 1;
    var computedLayoverTime = 0;
    if (i == restStopIndex) {
      hotel = leg.getHotelRate();
      perDiem = leg.getPerDiemRate();
      if (i == this.legs.length - 1) {
        // The final destination is the rest stop.
        computedLayoverTime = MAXIMUM_DESTINATION_REST_STOP_HOURS;
      } else {
        // An intermediary location is the rest stop.
        computedLayoverTime = MAXIMUM_INTERMEDIARY_REST_STOP_HOURS;
      }
      costData.setRestStop(destination, computedLayoverTime, hotel, perDiem);
    } else {
      // This is not a rest stop, so just compute the regular layover time.
      costData.addLayoverTime(layoverTime);
    }

    // Add the final per-diem amount. If the flight returns the traveler to the
    // duty station, then the per diem is computed at the place of origin.
    if (returningHome && i == 0) {
      perDiem = leg.getOriginPerDiemRate();
      costData.setDestination(this.getFinalDestination(), perDiem, perDiemRate,
          leg.getDepartureCity());
    } else if (!returningHome && i == this.legs.length - 1) {
      perDiem = leg.getPerDiemRate();
      costData.setDestination(destination, perDiem, perDiemRate);
    }
  }
  return costData;
};

Flight.prototype.getCostData = function() {
  if (this.getFlyingTime() + this.getLayoverTime() <= 14) {
    return this.computeCostWithRestStop_(-1);
  }

  var flightCostData = null;
  var numLegs = this.legs.length - 1;
  // If you are returning to your duty station, then you cannot take a rest stop
  // at the final destination. For that reason, consider only n - 1 legs.
  if (this.getFinalDestination() == this.itinerary_.getDutyStation()) {
    numLegs = this.legs.length - 2;
  }
  for (var i = 0; i <= numLegs; ++i) {
    var costData = this.computeCostWithRestStop_(i);
    if (!flightCostData || costData.totalCost <= flightCostData.totalCost) {
      flightCostData = costData;
    }
  }

  return flightCostData;
};

Flight.prototype.getTotalCost = function() {
  return this.getCostData().totalCost;
};


function Leg(flight, allowRemoval) {
  var element = this.element_ = $('#leg-template').clone();
  element.removeAttr('id');
  this.response_ = null;
  this.flight_ = flight;

  var me = this;
  $('.listen', this.element_).change(function() {
    ScheduleEngine.getScheduleData(
        me.getCarrier(), me.getFlightNumber(), me.getDate(), 
        function(response) {
          me.setResponse(response);
        });
  });

  $('select.departure', element).change(function(e) {
    me.updateFlightInfo_(e.target.value);
  });

  if (allowRemoval) {
    $('.remove-row', element).click(function() {
      element.remove();
      flight.removeLeg(me);
    });
  } else {
    $('.remove-row', element).hide();
  }
  element.insertBefore($('li:last-child', flight.getElement()));

  $('.carrier', element).focus();
}

Leg.prototype.getCarrier = function() {
  return $('input.carrier', this.element_).val();
};

Leg.prototype.getFlightNumber = function() {
  return $('input.flight-number', this.element_).val();
};

Leg.prototype.getDate = function() {
  return $('input.date', this.element_).val();
};

Leg.prototype.getDepartureCity = function() {
  return formatCity(this.departureAirport_, false);
};

Leg.prototype.getDepartureAirport = function() {
  return this.departureAirport_;
};

Leg.prototype.getArrivalCity = function() {
  return formatCity(this.arrivalAirport_, false);
};

Leg.prototype.getArrivalAirport = function() {
  return this.arrivalAirport_;
};

Leg.prototype.getFlightDetails = function() {
  return this.flightInfo_;
};

Leg.prototype.getDepartureTime = function() {
  return this.departureTimeUtc_ || 0;
};

Leg.prototype.getArrivalTime = function() {
  return this.arrivalTimeUtc_ || 0;
};

Leg.prototype.getArrivalDateLocal = function() {
  return this.arrivalDateLocal_ && this.arrivalDateLocal_.toLocaleDateString();
};

Leg.prototype.getFlyingTime = function() {
  return (this.getArrivalTime() - this.getDepartureTime()) / (60 * 60 * 1000);
};

Leg.prototype.getHotelRate = function() {
  return this.hotelRate_;
};

Leg.prototype.getPerDiemRate = function() {
  return this.perDiemRate_;
};

Leg.prototype.getOriginPerDiemRate = function() {
  return this.originPerDiemRate_;
};

Leg.prototype.setResponse = function(response) {
  this.response_ = response;

  var flights = response['scheduledFlights'];
  // Set the departure city.
  // There may be multiple departure cities. If so, show the select instead of
  // the input box.

  // Remove any existing select options, except for the first.
  var existingOptions = $('select.departure option', this.element_).get();
  for (var i = 1; i < existingOptions.length; ++i) {
    $(existingOptions[i]).remove();
  }

  // Add all of the flights to the select control.
  var previousAirport = this.flight_.getPreviousArrivalAirport(this);
  var selected = -1;
  for (var i = 0; i < flights.length; ++i) {
    var airportCode = flights[i]['departureAirportFsCode'];
    var airportInfo = ScheduleEngine.getAirportInfo(
        this.response_, airportCode);
    var departureCity = formatCity(airportInfo, true);
    var option = $('<option></option>').attr('value', i).text(departureCity);
    if (previousAirport && previousAirport['fs'] == airportCode) {
      option.attr('selected', 'selected');
      selected = i;
    }
    $('select.departure', this.element_).append(option);
  }

  if (flights.length == 1) {
    this.updateFlightInfo_(0);
    $('input.departure', this.element_).show();
    $('select.departure', this.element_).hide();
  } else if (flights.length > 1) {
    if (selected != -1) {
      this.updateFlightInfo_(selected);
    } else {
      $('input.arrival', this.element_).val('');
    }
    $('input.departure', this.element_).hide();
    $('select.departure', this.element_).show();
  }
};

Leg.prototype.updateFlightInfo_ = function(index) {
  this.flightInfo_ = this.response_['scheduledFlights'][index];

  var arrivalAirportCode = this.flightInfo_['arrivalAirportFsCode'];
  var departureAirportCode = this.flightInfo_['departureAirportFsCode'];
  this.arrivalAirport_ = ScheduleEngine.getAirportInfo(
      this.response_, arrivalAirportCode);
  this.departureAirport_ = ScheduleEngine.getAirportInfo(
      this.response_, departureAirportCode);
  this.departureTimeUtc_ = parseTime(
      this.flightInfo_['departureTime'],
      this.departureAirport_['utcOffsetHours']);
  this.arrivalTimeUtc_ = parseTime(
      this.flightInfo_['arrivalTime'],
      this.arrivalAirport_['utcOffsetHours']);
  var departureDateLocal = new Date(
      this.departureTimeUtc_.getTime() +
      this.departureTimeUtc_.getTimezoneOffset() * 60 * 1000 +
      this.departureAirport_['utcOffsetHours'] * 60 * 60 * 1000);
  this.arrivalDateLocal_ = new Date(
      this.arrivalTimeUtc_.getTime() +
      this.arrivalTimeUtc_.getTimezoneOffset() * 60 * 1000 +
      this.arrivalAirport_['utcOffsetHours'] * 60 * 60 * 1000);

  var perDiemRates = perDiemLookup.getRatesByAirportCode(
      arrivalAirportCode, this.arrivalDateLocal_.toLocaleDateString());
  this.hotelRate_ = perDiemRates[0];
  this.perDiemRate_ = perDiemRates[1];

  perDiemRates = perDiemLookup.getRatesByAirportCode(
      departureAirportCode, departureDateLocal.toLocaleDateString());
  this.originPerDiemRate_ = perDiemRates[1];

  var departureCity = formatCity(this.departureAirport_, false);
  var arrivalCity = formatCity(this.arrivalAirport_, false);
  $('input.departure', this.element_).val(departureCity);
  $('input.arrival', this.element_).val(arrivalCity);
};
