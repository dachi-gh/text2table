var text2table = (function(){
  'use strict';
  
  var regex, input;
  var rows;
  var columns = [], isNumeric = [];
  
  var data = {
    expression: '\t',
    modifier: 'g'
  };
  
  var extend = function(target, source) {
    if(source) {
      for(var key in source) {
        var val = source[key];
        if(typeof val !== 'undefined') {
          target[key] = val;
        }
      }
    }
    return target;
  };
  
  // Global
  
  var initialize() {
    regex = new RegExp(data.expression, data.modifier);
  };
  
  var function getRows() {
    rows = input.split(/[\r\n]+/);
    return rows;
  };
  
  var function getCol(n) {
    return rows[n].split(regex);
  }
  
  var function getCols() {
    for (var i = 0; i < rows.length; i += 1) {
      var col = getCol(i);
      for (var s = 0; s < col.length; s += 1) {
        var data = col[s];
        var new = columns[s] == undefined;
        if (new) {
          isNumeric[s] = true;
        }
        if (new || columns[s] < data.length) {
          columns[s] = data.length;
        }
      }
    }
    return columns;
  }
 
  // toTable
  
  
  // toText
  
  return {
    data: function(opts) {
      extend(data, opts);
    },
    toTable: function(in) {
      input = in;
      initialize();
      
      if (getRows()[rows.length - 1] === '') { rows.pop(); }
      getCols();
    },
    toText: function() {
      
    }
  };
})();
