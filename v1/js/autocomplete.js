$(function() {
  function hasCommaBeforeMatch(match, label) {
    return label.substring(0, match.index).indexOf(',') != -1;
  }

  function rank(termRegex, labels) {
    labels.sort(function(a, b) {
      a = a.label || a.value || a;
      b = b.label || b.value || b;
      var matchA = new RegExp(termRegex, 'i').exec(a);
      var matchB = new RegExp(termRegex, 'i').exec(b);
      if (matchA && matchB) {
        if (matchA.index == 0 && matchB.index != 0) {
          return -1;
        } else if (matchA.index != 0 && matchB.index == 0) {
          return 1;
        }
      } else {
        window.console.log('Something doesn\'t match');
        window.console.log('a', !!matchA, a);
        window.console.log('b', !!matchB, b);
      }

      // Either neither or both matches are the first word, so see how many
      // commas come before the match.
      var hasCommaA = hasCommaBeforeMatch(matchA, a);
      var hasCommaB = hasCommaBeforeMatch(matchB, b);
      if (!hasCommaA && hasCommaB) {
        return -1;
      } else if (hasCommaA && !hasCommaB) {
        return 1;
      }

      // If either of these is a country (has 0 commas), order it first.
      var hasCommaA = a.indexOf(',') != -1;
      var hasCommaB = b.indexOf(',') != -1;
      if (!hasCommaA && hasCommaB) {
        return -1;
      } else if (hasCommaA && !hasCommaB) {
        return 1;
      }

      // Both matches occur in the same portion of the label. Sort the strings
      // lexigraphically, with special handling for punctuation.
      // Replace - with space so that it's alphabetized equivalently. Replace
      // comma with space so 'San Francisco, California' is listed before
      // 'San Francisco County, California'.
      a = a.replace(/[\-,]/g, ' ').replace(/\./, '');
      b = b.replace(/[\-,]/g, ' ').replace(/\./, '');
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return labels;
  }

  $.ui.autocomplete.filter = function(labels, term) {
    // Make hyphens, periods, and commas optional, where hyphens are replaced
    // with a space.
    var termRegex = $.ui.autocomplete.escapeRegex(term).
        replace(/\\\-/g, '[\- ]').
        replace(/(\\[,\.)(])/g, '$1?');
    var firstWordMatcher = new RegExp('^' + termRegex, 'i');
    var newWordMatcher = new RegExp('[ -\']' + termRegex, 'i');
    return rank(termRegex, $.grep(labels, function (value) {
      var val = value.label || value.value || value;
      val = val.replace(/[\-]/g, ' ').replace(/[,\.(]/g, '');
      return firstWordMatcher.test(val) || newWordMatcher.test(val);
    }));
  };

  // Highlight matching terms.
  $.ui.autocomplete.prototype._renderItem = function(ul, item) {
    var item = jQuery.extend({}, item);
    // Only bold complete words. First run the replacement on the first word.
    // Then require a leading non-alpha character.
    var termRegex = $.ui.autocomplete.escapeRegex(this.term);
    termRegex = termRegex.replace(/\\ /g, '[ \\-,\.)(]*');
    var regex =
        '(?![^&;]+;)(?!<[^<>]*)(' + termRegex + ')(?![^<>]*>)(?![^&;]+;)';
    item.label = item.label.replace(new RegExp('^' + regex, 'gi'),
      '<strong>$1</strong>');
    item.label = item.label.replace(new RegExp('([^A-Za-z])' + regex, 'gi'),
      '$1<strong>$2</strong>');
    return $('<li></li>')
        .data('item.autocomplete', item)
        .append('<a>' + item.label + '</a>')
        .appendTo(ul);
  };
});

var airline_autocomplete_labels = [];
for (var i = 0; i < AIRLINES.length; ++i) {
  var airline = AIRLINES[i];
  airline_autocomplete_labels.push({
    label: airline.primary + ' (' + airline.code + ')',
    value: airline.code
  });
}

function addAirlineAutocomplete(elements, onchange) {
  function add_(element) {
    $(element).autocomplete({
      source: airline_autocomplete_labels,
      change: function (event, ui) {
        if (!ui.item) {
          // http://api.jqueryui.com/autocomplete/#event-change -
          // The item selected from the menu, if any. Otherwise the property is
          // null so clear the item for force selection
          $(element).val('');
        }
        if (onchange) {
          onchange(event, ui);
        }
      }
    });
  }

  for (var i = 0; i < elements.length; ++i) {
    add_(elements[i]);
  }
}

var place_autocomplete_labels = [];
for (var key in PERDIEM_DATA) {
  if (PERDIEM_DATA.hasOwnProperty(key)) {
    place_autocomplete_labels.push(key);
  }
}

function addPlaceAutocomplete(elements, onchange) {
  function add_(element) {
    $(element).autocomplete({
      source: place_autocomplete_labels,
      change: function (event, ui) {
        if (!ui.item) {
          // http://api.jqueryui.com/autocomplete/#event-change -
          // The item selected from the menu, if any. Otherwise the property is
          // null so clear the item for force selection
          $(element).val('');
        }
        if (onchange) {
          onchange(event, ui);
        }
      }
    });
  }

  for (var i = 0; i < elements.length; ++i) {
    add_(elements[i]);
  }
}

addPlaceAutocomplete($('#destination-template .final-destination').get());
