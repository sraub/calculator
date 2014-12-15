function Destination(itineraries, destinationList, allowRemoval) {
  var element = $('#destination-template').clone().removeAttr('id');
  $('#itinerary .destination-list').append(element);

  var flights = [];
  $.each(itineraries, function(i, itinerary) {
    flights.push(itinerary.addFlight());
  });
  /*
  var contractFlight = contractItinerary.addFlight();
  var alternateFlight = alternateItinerary.addFlight();
  */

  var inputElement = $('.final-destination', element);
  addPlaceAutocomplete(inputElement, function() {
    $.each(flights, function(i, flight) {
      flight.updateDestination(inputElement.val());
    });
    /*
    contractFlight.updateDestination(inputElement.val());
    alternateFlight.updateDestination(inputElement.val());
    */
  });

  var me = this;
  if (allowRemoval) {
    $('.glyphicon-remove', element).click(function() {
      element.remove();
      /*
      contractFlight.remove();
      alternateFlight.remove();
      */
      $.each(flights, function(i, flight) {
        flight.remove();
      });
      flights = [];
//      contractItinerary.removeFlight(contractFlight);
//      alternateItinerary.removeFlight(alternateFlight);
      destinationList.colorFlights();
    });
  } else {
    $('.glyphicon-remove', element).hide();
  }

  inputElement.focus();
  destinationList.colorFlights();
}

function DestinationList(contractItinerary, alternateItinerary) {
  var me = this;
  var itineraries = [contractItinerary, alternateItinerary];
  $('#itinerary .add-destination').click(function() {
    new Destination(itineraries, me, true);
  });
  new Destination(itineraries, this, false);
}

DestinationList.prototype.colorFlights = function() {
  $('#itinerary .final-destination').each(function(i, elem) {
    var colorIndex = i % 3 + 1;
    $(elem).removeClass('color1 color2 color3').addClass('color' + colorIndex);
  });
};
