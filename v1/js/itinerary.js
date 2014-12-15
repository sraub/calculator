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
    destination, perDiem, perDiemRate) {
  this.destination = destination;
  this.addPerDiem_(destination, perDiem, perDiemRate);
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

Itinerary.prototype.addFlight = function() {
  var colorIndex = this.flights.length % 3 + 1;
  var flight = new Flight(this, false); //this.flights.length != 0);
  this.flights.push(flight);
  this.colorFlights();
  return flight;
};

Itinerary.prototype.getElement = function() {
  return this.element_;
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
  this.finalDestination_ = destination;
//  $('.final-destination', this.element_).val(destination);
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

Flight.prototype.getOrigin = function() {
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
  for (var i = 0; i < this.legs.length; ++i) {
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
    var date = leg.getArrivalDateLocal();
    costData.addFlyingTime(leg.getFlyingTime());

    var layoverTime = 0;
    if (i != this.legs.length - 1) {
      var arrivalTime = leg.getArrivalTime();
      var nextDepartureTime = this.legs[i + 1].getDepartureTime();
      layoverTime = (nextDepartureTime - arrivalTime) / (60 * 60 * 1000);
    }

    var hotel = 0;
    var perDiem = 0;
    var perDiemRate = 0;
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

    if (i == this.legs.length - 1) {
      perDiem = leg.getPerDiemRate();
      // Add the final per-diem amount.
      if (restStopIndex == -1) {
        // There is no rest stop, so use .75 of the per diem values.
        perDiemRate = .75;
      } else {
        // There is a rest stop, so use 1.0 of the per diem values.
        perDiemRate = 1;
      }
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
  for (var i = 0; i < this.legs.length; ++i) {
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
  for (var i = 0; i < flights.length; ++i) {
    var airportCode = flights[i]['departureAirportFsCode'];
    var airportInfo = ScheduleEngine.getAirportInfo(
        this.response_, airportCode);
    $('select.departure', this.element_).append(
        '<option value="' + i + '">' + formatCity(airportInfo, true) +
        '</option>');
  }

  if (flights.length == 1) {
    this.updateFlightInfo_(0);
    $('input.departure', this.element_).show();
    $('select.departure', this.element_).hide();
  } else if (flights.length > 1) {
    $('input.departure', this.element_).hide();
    $('select.departure', this.element_).show();
  }
};

Leg.prototype.updateFlightInfo_ = function(index) {
  this.flightInfo_ = this.response_['scheduledFlights'][index];
  this.arrivalAirport_ = ScheduleEngine.getAirportInfo(
      this.response_, this.flightInfo_['arrivalAirportFsCode']);
  this.departureAirport_ = ScheduleEngine.getAirportInfo(
      this.response_, this.flightInfo_['departureAirportFsCode']);
  this.departureTimeUtc_ = parseTime(
      this.flightInfo_['departureTime'],
      this.departureAirport_['utcOffsetHours']);
  this.arrivalTimeUtc_ = parseTime(
      this.flightInfo_['arrivalTime'],
      this.arrivalAirport_['utcOffsetHours']);
  this.arrivalDateLocal_ = new Date(
      this.arrivalTimeUtc_.getTime() +
      this.arrivalTimeUtc_.getTimezoneOffset() * 60 * 1000 +
      this.arrivalAirport_['utcOffsetHours'] * 60 * 60 * 1000);

  var departureCity = formatCity(this.departureAirport_, false);
  var arrivalCity = formatCity(this.arrivalAirport_, false);

  var perDiemRates = perDiemLookup.getRates(
      arrivalCity, this.arrivalDateLocal_.toLocaleDateString());
  this.hotelRate_ = perDiemRates[0];
  this.perDiemRate_ = perDiemRates[1];

  $('input.departure', this.element_).val(departureCity);
  $('input.arrival', this.element_).val(arrivalCity);
};
