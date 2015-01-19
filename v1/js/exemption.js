function Exemption(element) {
  this.element_ = element;
}

Exemption.prototype.update = function(contract, alternate) {
  $('#exemption .bs-callout').hide();
  if (isNaN(contract.getTotalCost()) || isNaN(alternate.getTotalCost())) {
    $('#exemption .incomplete').show();
    return;
  }
  if (contract.getTotalCost() <= alternate.getTotalCost()) {
    $('#exemption .not-qualifies').show();
  } else {
    $('#exemption .qualifies').show();
  }

  // Itinerary
  var itinerary = $('.itinerary tbody', this.element_).empty();
  for (var i = 0; i < contract.flights.length; ++i) {
    var flight = contract.flights[i];
    var row = $('#exemption-template .flight-summary')
      .clone().appendTo(itinerary);
    $('.flight-index', row).text(i + 1);
    $('.flight-origin', row).text(flight.getOrigin());
    $('.flight-destination', row).text(flight.getFinalDestination());
    $('.flight-arrival-date', row).text(flight.getArrivalDate());
  }

  // Comparison
  var costComparison = $('.comparison.cost', this.element_);
  function setComparisonCost(selector, contractCost, alternateCost) {
    var parentSelector = $(selector, costComparison);
    $('td.contract', parentSelector).text(formatDollars(contractCost));
    $('td.alternate', parentSelector).text(formatDollars(alternateCost));
  }
  var timeComparison = $('.comparison.time', this.element_);
  function setComparisonTime(selector, contractTime, alternateTime) {
    var parentSelector = $(selector, timeComparison);
    $('td.contract', parentSelector).text(formatDuration(contractTime));
    $('td.alternate', parentSelector).text(formatDuration(alternateTime));
  }

  var contractCostData = contract.getCostData();
  var alternateCostData = alternate.getCostData();
  setComparisonCost('.fare-row', contractCostData.fare, alternateCostData.fare);
  setComparisonCost('.lost-worktime-row',
      contractCostData.worktime, alternateCostData.worktime);
  setComparisonCost('.perdiem-row',
      contractCostData.perDiem, alternateCostData.perDiem);
  setComparisonCost('.lodging-row',
      contractCostData.hotel, alternateCostData.hotel);
  setComparisonCost('.total-row',
      contractCostData.total - contractCostData.worktime +
          contractCostData.fare,
      alternateCostData.total - alternateCostData.worktime +
          alternateCostData.fare);
//      contract.getTotalCost(), alternate.getTotalCost());
  setComparisonTime('.flying-row',
      contractCostData.flyingTime, alternateCostData.flyingTime);
  setComparisonTime('.layover-row',
      contractCostData.layoverTime, alternateCostData.layoverTime);
  setComparisonTime('.rest-stop-row',
      contractCostData.restStopTime, alternateCostData.restStopTime);
  setComparisonTime('.total-row',
      contractCostData.travelTime, alternateCostData.travelTime);

  function fillItineraryDetails(itinerary, parentElement) {
    function addDetailsRow(index, rowspan, destination, flightNumber,
        flyingTime, flightCostData) {
      var details = $('#exemption-template .flight-details').clone()
          .appendTo(parentElement);
      if (rowspan != 0) {
        $('.flight-index', details).text(index).attr('rowspan', rowspan);
      } else {
        $('.flight-index', details).remove();
      }
      $('.flight-destination', details).text(destination);
      $('.flight-number', details).text(flightNumber);
      $('.flying-time', details).text(formatDuration(flyingTime));

      // If the flight costs indicate that this is a rest stop...
      if (flightCostData.restStopLocation == destination) {
        $('.lodging-cost', details).text(formatDollars(flightCostData.hotelCost));
        $('.perdiem-cost', details).text(formatDollars(flightCostData.perDiem[destination]));
      } else {
        $('.lodging-cost', details).text('');
        $('.perdiem-cost', details).text('');
      }
      if (flightCostData.restStopLocation == destination) {
        $('.lodging-cost', details).text(formatDollars(flightCostData.hotelCost));
      }
      if (flightCostData.destination == destination) {
        $('.perdiem-cost', details).text(formatDollars(flightCostData.perDiem[destination]));
      }
    }

    for (var i = 0; i < itinerary.flights.length; ++i) {
      var flight = itinerary.flights[i];
      var flightCostData = flight.getCostData();
      var groundLeg = flight.getFinalDestination() !=
          flight.legs[flight.legs.length - 1].getArrivalCity();
      for (var j = 0; j < flight.legs.length; ++j) {
        var numLegs = groundLeg ? flight.legs.length + 1 : flight.legs.length;
        var leg = flight.legs[j];
        addDetailsRow(i + 1, j == 0 ? numLegs : 0, leg.getArrivalCity(),
            leg.getCarrier() + ' ' + leg.getFlightNumber(),
            leg.getFlyingTime(), flightCostData);
      }
      if (groundLeg) {
        addDetailsRow(0, 0, flight.getFinalDestination(), 'Ground',
            0, flightCostData);
      }
    }
  }

  // Contract Fare
  fillItineraryDetails(contract, $('.contract-details tbody').empty());

  // Alternate Fare
  fillItineraryDetails(alternate, $('.alternate-details tbody').empty());
};
