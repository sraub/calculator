var TripType = {
  ROUND_TRIP: 0,
  ONE_WAY: 1,
  MULTI_CITY: 2
};

function setUpInputElement(inputElement, homeIcon, destinationList) {
  addPlaceAutocomplete(inputElement, function() {
    destinationList.checkActiveDutyStation();
  });

  homeIcon.click(function() {
    if (homeIcon.hasClass('active')) {
      // This was already active, so update the duty station to null.
      destinationList.updateActiveDutyStation(null);
    } else {
      destinationList.updateActiveDutyStation(inputElement.val());
    }
  });
}

function Destination(itineraries, destinationList, allowRemoval) {
  this.destinationList_ = destinationList;

  var element = this.element_ =
      $('#destination-template').clone().removeAttr('id');
  $('#itinerary .destination-list').append(element);

  var flights = this.flights_ = [];
  $.each(itineraries, function(i, itinerary) {
    flights.push(itinerary.addFlight());
  });

  var inputElement = $('.final-destination', element);
  addPlaceAutocomplete(inputElement);
    /*
    $.each(flights, function(i, flight) {
      flight.updateDestination(inputElement.val());
    });
  });
    */

  var homeIcon = $('.glyphicon-home', element);
  setUpInputElement(inputElement, homeIcon, destinationList);
  /*
  homeIcon.click(function() {
    if (homeIcon.hasClass('active')) {
      // This was already active, so update the duty station to null.
      destinationList.updateActiveDutyStation(null);
    } else {
      destinationList.updateActiveDutyStation(inputElement.val());
    }
  });
  */

  var me = this;
  if (allowRemoval) {
    $('.glyphicon-remove', element).click(function() {
      me.remove();

      /*
      element.remove();
      $.each(flights, function(i, flight) {
        flight.remove();
      });
      flights = [];
      destinationList.colorFlights();
      */
    });
  } else {
    $('.glyphicon-remove', element).hide();
  }

  inputElement.focus();
  destinationList.colorFlights();
}

Destination.prototype.getLocation = function() {
  return this.element_.val();
};

Destination.prototype.remove = function() {
  this.element_.remove();
  $.each(this.flights_, function(i, flight) {
    flight.remove();
  });
  this.destinationList_.removeDestination(this);
};

function DestinationList(contractItinerary, alternateItinerary) {
  this.itineraries_ = [contractItinerary, alternateItinerary];
  this.destinations_ = [];

  var me = this;
  $('#itinerary .add-destination').click(function() {
    me.addDestination(true);
  });
  me.addDestination(false);

  var dutyStationInput = $('.duty-station');
  addPlaceAutocomplete(dutyStationInput);
  dutyStationInput.focus();

  var originInput = $('.origin');
//  addPlaceAutocomplete(originInput);
  originInput.focus();

  var homeIcon = $('.origin ~ span .glyphicon-home');
  /*
  homeIcon.click(function() {
    if (homeIcon.hasClass('active')) {
      // This was already active, so update the duty station to null.
      me.updateActiveDutyStation(null);
    } else {
      me.updateActiveDutyStation(originInput.val());
    }
  });
  */
  setUpInputElement(originInput, homeIcon, this);

  this.setTripType(TripType.ROUND_TRIP);
}

DestinationList.prototype.reset = function() {
  for (var i = this.destinations_.length - 1; i > 0; --i) {
    this.destinations_[i].remove();
  }
};

DestinationList.prototype.removeDestination = function(toRemove) {
  for (var i = 0; i < this.destinations_.length; ++i) {
    if (this.destinations_[i] == toRemove) {
      this.destinations_.splice(i, 1);
      break;
    }
  }
};

DestinationList.prototype.addDestination = function(allowRemoval) {
  this.destinations_.push(
      new Destination(this.itineraries_, this, allowRemoval));
};

DestinationList.prototype.colorFlights = function() {
  $('#itinerary .final-destination').each(function(i, elem) {
    var colorIndex = i % 3 + 1;
    $(elem).removeClass('color1 color2 color3').addClass('color' + colorIndex);
  });
};

DestinationList.prototype.updateActiveDutyStation = function(value) {
  window.console.log('Setting the active duty station to', value);
  // Iterate over the final destinations. Check their  
  this.activeDutyStation_ = value;
  this.checkActiveDutyStation();
};

DestinationList.prototype.checkActiveDutyStation = function() {
  var activeDutyStation = this.activeDutyStation_;
  $('#itinerary div.input-group').each(function(i, elem) {
    if (activeDutyStation && $('input', elem).val() == activeDutyStation) {
      $('.glyphicon-home', elem).addClass('active');
    } else {
      $('.glyphicon-home', elem).removeClass('active');
    }
  });
};

DestinationList.prototype.getActiveDutyStation = function() {
  return this.activeDutyStation_;
};

DestinationList.prototype.isInitialized = function() {
  var destinations = $('#itinerary .final-destination').get();
  for (var i = 0; i < destinations.length; ++i) {
    if ($(destinations[i]).val() != '') {
      return true;
    }
  }
  return false;
};

DestinationList.prototype.setTripType = function(tripType) {
  this.tripType_ = tripType;
  if (tripType == TripType.MULTI_CITY) {
    this.addDestination(false);
    $('#itinerary .add-destination').show();
  } else {
    this.reset();
    $('#itinerary .add-destination').hide();
  }
};

DestinationList.prototype.getDestinations = function() {
  var origin = $('.origin').val();
  var destinations = [origin];
  $('#itinerary input.final-destination').each(function(i, elem) {
    destinations.push($(elem).val());
  });
  if (this.tripType_ == TripType.ROUND_TRIP) {
    destinations.push(origin);
  }
  return destinations;
};
