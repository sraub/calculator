function ComparisonTable(element) {
  /**
   * The table body element.
   * @type {Element}
   */
  this.element_ = element;
}

ComparisonTable.prototype.addCostRow = function(
    selector, contractCost, alternateCost) {
  var row = $('#comparison-table-template ' + selector).clone()
    .appendTo(this.element_);
  $('td.contract.cost', row).text(formatDollars(contractCost));
  $('td.alternate.cost', row).text(formatDollars(alternateCost));
  return row;
};

ComparisonTable.prototype.addItemRow = function(label, contractDescription,
    contractCost, alternateDescription, alternateCost, opt_format) {
  var row = $('#comparison-table-template .item-row').clone()
    .appendTo(this.element_);
  $('td.item-row-label', row).text(label);
  $('td.contract.desc', row).text(
      opt_format ? opt_format(contractDescription) : contractDescription);
  $('td.contract.cost', row).text(formatDollars(contractCost));
  $('td.alternate.desc', row).text(
      opt_format ? opt_format(alternateDescription) : alternateDescription);
  $('td.alternate.cost', row).text(formatDollars(alternateCost));
  return row;
}

ComparisonTable.prototype.update = function(contract, alternate) {
  this.element_.empty();

  // Fare | | contract fare | | alternate fare.
  this.addCostRow('.fare-row', contract.getFare(), alternate.getFare());

  // For each flight:
  for (var i = 0; i < contract.flights.length; ++i) {
    var contractFlight = contract.flights[i].getCostData();
    var alternateFlight = alternate.flights[i].getCostData();

    // Flight i: Origin to Final Destination
    var row = $('#comparison-table-template .flight-header-row')
      .clone().appendTo(this.element_);
    $('span.flight-index', row).text(i + 1);
    $('span.flight-origin', row).text(contractFlight.origin);
    $('span.flight-destination', row).text(contractFlight.destination);

    // Flying time | contract hours | cost | alternate hours | cost
    this.addItemRow('Flying time',
        contractFlight.flyingTime,
        contractFlight.flyingCost,
        alternateFlight.flyingTime,
        alternateFlight.flyingCost,
        formatDuration);

    if (contractFlight.layoverTime || alternateFlight.layoverTime) {
      // Layovers | contract hours | cost | alternate hours | cost (if any)
      this.addItemRow('Layover',
          contractFlight.layoverTime,
          contractFlight.layoverCost,
          alternateFlight.layoverTime,
          alternateFlight.layoverCost,
          formatDuration);
    }

    var contractPerDiemLocations = [];
    var alternatePerDiemLocations = [];
    if (contractFlight.restStopLocation ||
        alternateFlight.restStopLocation) {
      // Rest Stop | contract hours | cost | alternate hours | cost (if any)
      this.addItemRow('Rest Stop',
          contractFlight.restStopTime,
          contractFlight.restStopCost,
          alternateFlight.restStopTime,
          alternateFlight.restStopCost,
          formatDuration);

      // Lodging | contract city | cost | alternate city | cost (if any)
      this.addItemRow('Lodging',
          contractFlight.restStopLocation,
          contractFlight.hotelCost,
          alternateFlight.restStopLocation,
          alternateFlight.hotelCost);
    }

    // The locations are all listed in flight.perDiem, but need to be ordered
    // such that it's origin, rest stop, destination.
    for (var perDiemLocation in contractFlight.perDiem) {
      contractPerDiemLocations.push(perDiemLocation);
    }
    for (var perDiemLocation in alternateFlight.perDiem) {
      alternatePerDiemLocations.push(perDiemLocation);
    }

    /*
    if (contractFlight.restStopLocation &&
        contractFlight.restStopLocation !=
        contractFlight.destination) {
      contractPerDiemLocations.push(contractFlight.restStopLocation);
    }
    if (alternateFlight.restStopLocation &&
        alternateFlight.restStopLocation !=
        alternateFlight.destination) {
      alternatePerDiemLocations.push(alternateFlight.restStopLocation);
    }
    contractPerDiemLocations.push(contractFlight.destination);
    alternatePerDiemLocations.push(alternateFlight.destination);
    */

    // M & IE | contract city | cost | alternate city | cost
    //          contract city | cost | alternate city | cost (if any)
    var numberRows = Math.max(contractPerDiemLocations.length,
        alternatePerDiemLocations.length);
    for (var j = 0; j < numberRows; ++j) {
      var row = this.addItemRow('M & IE',
          contractPerDiemLocations[j],
          contractFlight.perDiem[contractPerDiemLocations[j]],
          alternatePerDiemLocations[j],
          alternateFlight.perDiem[alternatePerDiemLocations[j]]);
      if (j == 0) {
        $('.item-row-label', row).attr('rowspan', numberRows);
      } else {
        $('.item-row-label', row).remove();
      }
    }

    // Subtotal | | contract subtotal | | alternate subtotal
    this.addCostRow('.subtotal-row', contractFlight.totalCost,
        alternateFlight.totalCost);
  }

  // Total | | contract total | | alternate total
  this.addCostRow('.total-row', contract.getTotalCost(),
      alternate.getTotalCost());
};
